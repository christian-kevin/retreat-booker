-- CreateTable: venue (must be created first)
CREATE TABLE "venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price_per_night" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "amenities" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable: booking_inquiry (created after venue due to foreign key)
CREATE TABLE "booking_inquiry" (
    "id" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "attendee_count" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "venue_city_idx" ON "venue"("city");

-- CreateIndex
CREATE INDEX "venue_capacity_idx" ON "venue"("capacity");

-- CreateIndex
CREATE INDEX "venue_price_per_night_idx" ON "venue"("price_per_night");

-- CreateIndex
CREATE INDEX "booking_inquiry_venue_id_idx" ON "booking_inquiry"("venue_id");

-- CreateIndex
CREATE INDEX "booking_inquiry_email_idx" ON "booking_inquiry"("email");

-- CreateIndex
CREATE INDEX "booking_inquiry_venue_id_start_date_end_date_idx" ON "booking_inquiry"("venue_id", "start_date", "end_date");

-- AddForeignKey (venue must exist before this)
ALTER TABLE "booking_inquiry" ADD CONSTRAINT "booking_inquiry_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

