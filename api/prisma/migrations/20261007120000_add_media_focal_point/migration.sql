-- AlterTable
-- Framing for media: the point that must stay visible when an image is cropped to
-- fit a box, in percent from the top-left. 50/50 is the centre, which is what
-- object-cover already does, so existing rows need no backfill.
ALTER TABLE "media" ADD COLUMN     "focal_x" DOUBLE PRECISION NOT NULL DEFAULT 50,
ADD COLUMN     "focal_y" DOUBLE PRECISION NOT NULL DEFAULT 50;
