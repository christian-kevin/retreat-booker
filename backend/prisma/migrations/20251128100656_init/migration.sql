-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "amenities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingInquiry" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "attendeeCount" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Venue_city_idx" ON "Venue"("city");

-- CreateIndex
CREATE INDEX "Venue_capacity_idx" ON "Venue"("capacity");

-- CreateIndex
CREATE INDEX "Venue_pricePerNight_idx" ON "Venue"("pricePerNight");

-- CreateIndex
CREATE INDEX "BookingInquiry_venueId_idx" ON "BookingInquiry"("venueId");

-- CreateIndex
CREATE INDEX "BookingInquiry_email_idx" ON "BookingInquiry"("email");

-- CreateIndex
CREATE INDEX "BookingInquiry_venueId_startDate_endDate_idx" ON "BookingInquiry"("venueId", "startDate", "endDate");

-- AddForeignKey
ALTER TABLE "BookingInquiry" ADD CONSTRAINT "BookingInquiry_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
