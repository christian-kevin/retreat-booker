import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.venue.createMany({
    data: [
      {
        name: 'Mountain Vista Lodge',
        city: 'Denver',
        country: 'USA',
        address: '1234 Mountain Road, Denver, CO 80202',
        capacity: 50,
        pricePerNight: 3500,
        description: 'Stunning mountain views with modern conference facilities',
        amenities: ['WiFi', 'Projector', 'Catering', 'Parking', 'Hiking Trails'],
      },
      {
        name: 'Coastal Retreat Center',
        city: 'San Diego',
        country: 'USA',
        address: '567 Ocean Drive, San Diego, CA 92101',
        capacity: 75,
        pricePerNight: 5000,
        description: 'Beachfront property perfect for team building',
        amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Gym', 'Pool'],
      },
      {
        name: 'Urban Innovation Hub',
        city: 'San Francisco',
        country: 'USA',
        address: '890 Market Street, San Francisco, CA 94102',
        capacity: 100,
        pricePerNight: 7500,
        description: 'Modern downtown space with cutting-edge technology',
        amenities: ['WiFi', 'Video Conferencing', 'Catering', 'Rooftop Terrace'],
      },
      {
        name: 'Lakeside Conference Lodge',
        city: 'Seattle',
        country: 'USA',
        address: '234 Lake View Avenue, Seattle, WA 98101',
        capacity: 40,
        pricePerNight: 3000,
        description: 'Peaceful lakeside setting for focused team retreats',
        amenities: ['WiFi', 'Kayaking', 'Fire Pit', 'Kitchen', 'Nature Trails'],
      },
      {
        name: 'Desert Oasis Resort',
        city: 'Phoenix',
        country: 'USA',
        address: '456 Desert Road, Phoenix, AZ 85001',
        capacity: 60,
        pricePerNight: 4200,
        description: 'Unique desert experience with luxury amenities',
        amenities: ['WiFi', 'Pool', 'Spa', 'Golf Course', 'Restaurant'],
      },
      {
        name: 'Historic Manor House',
        city: 'Boston',
        country: 'USA',
        address: '789 Heritage Lane, Boston, MA 02101',
        capacity: 30,
        pricePerNight: 2800,
        description: 'Charming historic venue with modern conference rooms',
        amenities: ['WiFi', 'Library', 'Garden', 'Catering', 'Parking'],
      },
      {
        name: 'Riverside Innovation Center',
        city: 'Austin',
        country: 'USA',
        address: '321 River Road, Austin, TX 78701',
        capacity: 80,
        pricePerNight: 4500,
        description: 'Creative space along the river with flexible layouts',
        amenities: ['WiFi', 'Outdoor Deck', 'BBQ Area', 'Bikes', 'Catering'],
      },
      {
        name: 'Alpine Chalet Retreat',
        city: 'Denver',
        country: 'USA',
        address: '654 Alpine Way, Denver, CO 80203',
        capacity: 35,
        pricePerNight: 3200,
        description: 'Cozy mountain retreat with panoramic views',
        amenities: ['WiFi', 'Fireplace', 'Hot Tub', 'Ski Access', 'Kitchen'],
      },
      {
        name: 'Tech Campus Hub',
        city: 'San Francisco',
        country: 'USA',
        address: '987 Innovation Blvd, San Francisco, CA 94103',
        capacity: 120,
        pricePerNight: 8000,
        description: 'State-of-the-art facility for tech companies',
        amenities: ['WiFi', 'AV Equipment', 'Breakout Rooms', 'Café', 'Gym'],
      },
      {
        name: 'Vineyard Estate',
        city: 'Napa',
        country: 'USA',
        address: '147 Vineyard Lane, Napa, CA 94559',
        capacity: 45,
        pricePerNight: 6000,
        description: 'Elegant vineyard setting for executive retreats',
        amenities: ['WiFi', 'Wine Tasting', 'Garden', 'Catering', 'Pool'],
      },
    ],
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

