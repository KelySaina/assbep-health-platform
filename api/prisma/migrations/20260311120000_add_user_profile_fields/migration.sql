-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "show_in_team" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT;
