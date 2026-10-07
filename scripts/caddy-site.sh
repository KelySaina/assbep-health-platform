#!/usr/bin/env bash
# ============================================================================
# ASSBEP — render deploy/caddy/assbep.caddyfile from .env and install it into
# the host's Caddy. Replaces the Caddy this stack used to ship, which bound
# 80/443 from inside the compose project.
#
#   ./scripts/caddy-site.sh                 print the rendered block, write nothing
#   sudo ./scripts/caddy-site.sh --install  install, validate, reload
#
# The rendered file carries literal values, so Caddy is never handed this
# project's .env — a process that needs a hostname and two ports has no business
# holding the database password, the MinIO keys and the SMTP credentials.
# ============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TEMPLATE="deploy/caddy/assbep.caddyfile"
SITE_DIR="/etc/caddy/sites"
SITE_FILE="$SITE_DIR/assbep.caddyfile"
MAIN_CADDYFILE="/etc/caddy/Caddyfile"
IMPORT_LINE="import $SITE_DIR/*.caddyfile"
DO_INSTALL=0

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; YEL=$'\033[33m'; GRN=$'\033[32m'; OFF=$'\033[0m'
else
  BOLD=""; DIM=""; RED=""; YEL=""; GRN=""; OFF=""
fi
say()  { printf '%s\n' "$*" >&2; }
step() { printf '\n%s==>%s %s\n' "$BOLD" "$OFF" "$*" >&2; }
ok()   { printf '  %s✓%s %s\n' "$GRN" "$OFF" "$*" >&2; }
warn() { printf '  %s!%s %s\n' "$YEL" "$OFF" "$*" >&2; }
die()  { printf '\n%serror:%s %s\n' "$RED" "$OFF" "$*" >&2; exit 1; }

while [ $# -gt 0 ]; do
  case "$1" in
    --install) DO_INSTALL=1; shift ;;
    -h|--help) awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) die "Unknown option: $1 (try --help)" ;;
  esac
done

[ -f "$TEMPLATE" ] || die "$TEMPLATE is missing — run this from a complete checkout."
[ -f .env ] || die ".env not found in $ROOT — copy .env.api.production.example to .env and fill it in."

read_env() { sed -n "s/^$1=//p" .env | tail -n1; }

API_HOSTNAME="$(read_env API_HOSTNAME)"
API_HOST_PORT="$(read_env API_HOST_PORT)";     : "${API_HOST_PORT:=4100}"
MINIO_HOST_PORT="$(read_env MINIO_HOST_PORT)"; : "${MINIO_HOST_PORT:=9100}"
BIND_HOST="$(read_env BIND_HOST)"
MINIO_PUBLIC_URL="$(read_env MINIO_PUBLIC_URL)"

[ -n "$API_HOSTNAME" ] ||
  die "API_HOSTNAME is empty in .env — Caddy has no hostname to answer for.
       e.g. API_HOSTNAME=api.assbep.75-119-136-160.nip.io"

if [ -n "$BIND_HOST" ] && [ "$BIND_HOST" != "127.0.0.1" ] && [ "$BIND_HOST" != "localhost" ]; then
  warn "BIND_HOST is '$BIND_HOST', not 127.0.0.1 — the API and MinIO are published on"
  warn "  every interface, so they answer in plain http around Caddy. Fix it in .env"
  warn "  and re-run 'docker compose -f docker-compose.api.yml up -d'."
fi

# The API hands MINIO_PUBLIC_URL to clients as the base of every uploaded file's
# URL. If it does not point at this host's /storage prefix, uploads will appear to
# work and every document will 404 in the browser — a failure that looks like
# storage and is actually configuration.
case "$MINIO_PUBLIC_URL" in
  "https://$API_HOSTNAME/storage"|"https://$API_HOSTNAME/storage/") ;;
  "") warn "MINIO_PUBLIC_URL is empty in .env — uploaded files will have no public URL." ;;
  *)  warn "MINIO_PUBLIC_URL is '$MINIO_PUBLIC_URL', which is not https://$API_HOSTNAME/storage."
      warn "  Caddy serves uploads at that path; anything else and documents 404 in the browser." ;;
esac

render() {
  sed -e "s|{\$API_HOSTNAME}|$API_HOSTNAME|g" \
      -e "s|{\$API_HOST_PORT:4100}|$API_HOST_PORT|g" \
      -e "s|{\$MINIO_HOST_PORT:9100}|$MINIO_HOST_PORT|g" \
      "$TEMPLATE"
}

if [ "$DO_INSTALL" -eq 0 ]; then
  render
  { say ""; say "  ${DIM}Nothing was written. To install it:  sudo $0 --install${OFF}"; } >&2
  exit 0
fi

step "Installing the Caddy site for ${API_HOSTNAME}"
[ "$(id -u)" -eq 0 ] || die "--install writes under /etc/caddy — re-run it with sudo."
command -v caddy >/dev/null 2>&1 ||
  die "caddy is not installed. See https://caddyserver.com/docs/install#debian-ubuntu-raspbian"

install -d -m 0755 "$SITE_DIR"
render > "$SITE_FILE.new"
chmod 0644 "$SITE_FILE.new"

# Caddy reads one Caddyfile. A per-app file is worth nothing until the main one
# imports the directory, and a missing import is silent: Caddy reloads happily and
# simply never answers for this host.
if [ ! -f "$MAIN_CADDYFILE" ]; then
  printf '%s\n' "$IMPORT_LINE" > "$MAIN_CADDYFILE"; ok "created $MAIN_CADDYFILE with the import"
elif ! grep -qF "$SITE_DIR" "$MAIN_CADDYFILE"; then
  printf '\n# Per-app site blocks, one file each.\n%s\n' "$IMPORT_LINE" >> "$MAIN_CADDYFILE"
  ok "added the import to $MAIN_CADDYFILE"
fi

mv "$SITE_FILE.new" "$SITE_FILE"; ok "$SITE_FILE"

# Validate before reloading. A reload on a bad config leaves the old one serving
# and still reports success, so the next restart — days later, for an unrelated
# reason — is what actually takes every site on this box down.
if caddy validate --config "$MAIN_CADDYFILE" --adapter caddyfile >/dev/null 2>&1; then
  ok "config validates"
else
  caddy validate --config "$MAIN_CADDYFILE" --adapter caddyfile || true
  rm -f "$SITE_FILE"
  die "the Caddyfile does not validate. This site file was removed again and Caddy
       was NOT reloaded, so the other apps on this box are untouched.
       'ambiguous site definition' means ${API_HOSTNAME} is already defined
       elsewhere in /etc/caddy — delete that copy, not this one."
fi

# Validation passing does not mean loading will: it checks syntax, not whether a
# port can be bound or a file opened. Never hide this behind `&& ok`.
if systemctl reload caddy; then
  ok "caddy reloaded"
else
  say ""; systemctl status caddy --no-pager --lines=15 >&2 || true
  die "caddy did not reload, so ${API_HOSTNAME} is NOT live. The previously running
       config is still serving, so the other apps are unaffected — but a
       'systemctl restart caddy' would now fail and take them down too."
fi

say ""
say "  ${BOLD}Routed${OFF}"
say "    https://${API_HOSTNAME}/api/*      -> 127.0.0.1:${API_HOST_PORT}   (api)"
say "    https://${API_HOSTNAME}/storage/*  -> 127.0.0.1:${MINIO_HOST_PORT}   (minio, prefix stripped)"
say "    https://${API_HOSTNAME}/healthz    -> answered by Caddy"
say ""
say "  ${BOLD}Next${OFF}"
say "   1. point an A/AAAA record for ${API_HOSTNAME} at this host."
say "   2. open 80 and 443 only — ${API_HOST_PORT} and ${MINIO_HOST_PORT} are on loopback."
say "   3. watch the certificate:  ${DIM}journalctl -u caddy -f${OFF}"
say "   4. confirm:  ${DIM}curl -fsS https://${API_HOSTNAME}/healthz${OFF}"
say ""
