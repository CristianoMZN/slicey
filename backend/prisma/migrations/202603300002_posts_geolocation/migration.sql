ALTER TABLE "Post"
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION;

CREATE INDEX "Post_latitude_longitude_idx" ON "Post"("latitude", "longitude");
