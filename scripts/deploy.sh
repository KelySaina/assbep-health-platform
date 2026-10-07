#!/usr/bin/env bash
# ============================================================================
# ASSBEP — VPS deploy step (run BY the CI/CD workflow over SSH).
#
# Expects in the environment:
#   IMAGE_TAG      git SHA to deploy
#   GITHUB_TOKEN   optional — authenticates `git fetch` if the repo goes private
#
# Flow: sync the checkout to the SHA -> preflight -> rebuild -> poll the health
# endpoint -> on failure, roll back to the last good SHA.
# ============================================================================
set -euo pipefail

: "${IMAGE_TAG:?IMAGE_TAG is required}"

COMPOSE="docker compose -f docker-compose.api.yml"
LAST_GOOD_FILE=".deployed_tag"
HEALTH_RETRIES=30   # 30 * 5s = up to 2.5 min for build + migrations + boot
HEALTH_DELAY=5

log() { printf '\n\033[36m==> %s\033[0m\n' "$*"; }
die() { printf '\n\033[31m==> %s\033[0m\n' "$*" >&2; exit 1; }

read_env() { sed -n "s/^$1=//p" .env 2>/dev/null | tail -n1; }

preflight() {
  [ -f .env ] ||
    die ".env not found in $(pwd). Copy .env.api.production.example to .env and fill it in."

  # docker-compose.yml ships development credentials on purpose and is NOT what
  # gets deployed — $COMPOSE pins docker-compose.api.yml. Catch the case where
  # those defaults have been pasted into the real .env anyway.
  for key in POSTGRES_PASSWORD JWT_SECRET SESSION_SECRET MINIO_ROOT_PASSWORD MINIO_SECRET_KEY; do
    v="$(read_env "$key")"
    case "$v" in
      "") die "$key is empty in .env." ;;
      postgres|minioadmin|changeme|assbep-secret-key-change-in-production)
        die "$key in .env is still a development default ('$v'). docker-compose.yml
       carries those for local work; a public deployment does not get them." ;;
    esac
    if [ "${#v}" -lt 12 ]; then
      die "$key in .env is only ${#v} characters. Generate a real one: openssl rand -hex 32"
    fi
  done

  API_HOSTNAME="$(read_env API_HOSTNAME)"
  [ -n "$API_HOSTNAME" ] || die "API_HOSTNAME is empty in .env — nothing to route or health-check."

  # The proxy lives outside this stack now, so a deploy can neither start nor fix
  # it — but it can decline to spend minutes polling a URL nothing will answer.
  command -v caddy >/dev/null 2>&1 ||
    die "caddy is not installed on this host, so nothing serves ${API_HOSTNAME}.
       Install it, then: sudo ./scripts/caddy-site.sh --install"
  systemctl is-active --quiet caddy ||
    die "caddy is installed but not running — 'systemctl status caddy' says why."
  grep -rqF "$API_HOSTNAME" /etc/caddy 2>/dev/null ||
    die "no Caddy site answers for ${API_HOSTNAME}.
       Run: sudo ./scripts/caddy-site.sh --install"

  case "$(read_env BIND_HOST)" in
    ""|127.0.0.1|localhost) ;;
    *) die "BIND_HOST is '$(read_env BIND_HOST)' — the API and MinIO would be published
       on every interface, in plain http, around Caddy. Set it to 127.0.0.1." ;;
  esac

  # MinIO's own image ran as root; the Chainguard one runs as uid 65532. A volume
  # written by the old image stays root-owned and the server exits with "drive may
  # be faulty" — which says nothing about permissions. Catch it before the health
  # poll turns it into a rollback.
  vol="$(docker volume ls -q --filter "name=_minio_data$" | head -n1)"
  if [ -n "$vol" ]; then
    img="$(grep -m1 -oE 'cgr\.dev/chainguard/minio@sha256:[0-9a-f]+' docker-compose.api.yml || true)"
    if [ -n "$img" ] && ! docker run --rm -u 65532 -v "$vol:/d" --entrypoint sh "$img" \
         -c 'test -w /d' >/dev/null 2>&1; then
      die "the MinIO volume '$vol' is not writable by uid 65532, which the current
       image runs as. The objects are intact; the ownership is what changed.
       Fix it once, with the stack down, then re-run:
         $COMPOSE stop minio
         docker run --rm -v $vol:/d alpine chown -R 65532:65532 /d"
    fi
  fi
}

API_HOSTNAME="$(read_env API_HOSTNAME)"
HEALTH_URL="https://${API_HOSTNAME}/api/programs"
API_HOST_PORT="$(read_env API_HOST_PORT)"; : "${API_HOST_PORT:=4100}"

log "Syncing repo to ${IMAGE_TAG}"
if [ -n "${GITHUB_TOKEN:-}" ]; then
  git -c http.https://github.com/.extraheader="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$GITHUB_TOKEN" | base64 | tr -d '\n')" \
    fetch --all --prune --quiet
else
  git fetch --all --prune --quiet
fi
git checkout --force "$IMAGE_TAG"

PREV_TAG="$(cat "$LAST_GOOD_FILE" 2>/dev/null || true)"

deploy_tag() {
  local tag="$1"
  log "Deploying ${tag}"
  # No `down` first, unlike the workflow this replaces: that stopped Postgres and
  # MinIO on every deploy, so a build failure left the site down rather than
  # serving the previous version. Compose recreates only what actually changed.
  IMAGE_TAG="$tag" $COMPOSE up -d --build
}

health_ok() {
  log "Health-checking ${HEALTH_URL}"
  for i in $(seq 1 "$HEALTH_RETRIES"); do
    if curl -fsS --max-time 5 -o /dev/null "$HEALTH_URL"; then
      echo "  healthy after ${i} attempt(s)"
      return 0
    fi
    # Distinguish "the app is broken" from "the proxy or DNS is", instead of
    # leaving one failure to mean both.
    if [ "$i" = 3 ]; then
      if curl -fsS --max-time 5 -o /dev/null "http://127.0.0.1:${API_HOST_PORT}/api/programs" 2>/dev/null; then
        echo "  note: the API answers on 127.0.0.1:${API_HOST_PORT} but not through ${API_HOSTNAME}"
        echo "        -> routing/TLS, not the deploy. Check DNS, then:"
        echo "           journalctl -u caddy -n 50 --no-pager"
      fi
    fi
    sleep "$HEALTH_DELAY"
  done
  return 1
}

preflight
deploy_tag "$IMAGE_TAG"

if health_ok; then
  echo "$IMAGE_TAG" > "$LAST_GOOD_FILE"
  log "Deploy OK: ${IMAGE_TAG}"
  docker image prune -f >/dev/null 2>&1 || true
else
  log "Health check FAILED for ${IMAGE_TAG}"
  if [ -n "$PREV_TAG" ] && [ "$PREV_TAG" != "$IMAGE_TAG" ]; then
    # Honest limitation: this rolls back code and images, not the database.
    log "Rolling back to ${PREV_TAG}"
    git checkout --force "$PREV_TAG" || true
    deploy_tag "$PREV_TAG"
    health_ok && echo "  rollback healthy" || echo "  !! rollback also unhealthy — needs manual attention"
  else
    echo "  no previous good tag recorded — leaving as-is for inspection"
  fi
  exit 1
fi
