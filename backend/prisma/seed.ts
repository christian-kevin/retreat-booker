import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.venue.createMany({
    data: [
      // Budget options (under $2000)
      {
        name: 'Cozy Startup Space',
        city: 'Portland',
        country: 'USA',
        address: '123 Startup Street, Portland, OR 97201',
        capacity: 15,
        pricePerNight: 800,
        description: 'Affordable co-working space perfect for small teams',
        amenities: ['WiFi', 'Whiteboard', 'Coffee', 'Parking'],
      },
      {
        name: 'Community Center Hall',
        city: 'Chicago',
        country: 'USA',
        address: '456 Main Street, Chicago, IL 60601',
        capacity: 25,
        pricePerNight: 1200,
        description: 'Simple and functional space for team meetings',
        amenities: ['WiFi', 'Projector', 'Tables', 'Chairs', 'Kitchen'],
      },
      {
        name: 'Budget Conference Room',
        city: 'Miami',
        country: 'USA',
        address: '789 Beach Blvd, Miami, FL 33101',
        capacity: 20,
        pricePerNight: 1500,
        description: 'Basic meeting space near the beach',
        amenities: ['WiFi', 'AC', 'Parking'],
      },
      
      // Mid-range options ($2000-$5000)
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
        name: 'Coastal Retreat Center',
        city: 'San Diego',
        country: 'USA',
        address: '567 Ocean Drive, San Diego, CA 92101',
        capacity: 75,
        pricePerNight: 5000,
        description: 'Beachfront property perfect for team building',
        amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Gym', 'Pool'],
      },
      
      // Premium options ($5000-$10000)
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
        name: 'Executive Conference Center',
        city: 'New York',
        country: 'USA',
        address: '123 Wall Street, New York, NY 10005',
        capacity: 150,
        pricePerNight: 9500,
        description: 'Premium downtown location with full-service amenities',
        amenities: ['WiFi', 'Catering', 'Valet Parking', 'Business Center', 'Lounge'],
      },
      
      // Luxury options ($10000+)
      {
        name: 'Luxury Resort & Spa',
        city: 'Las Vegas',
        country: 'USA',
        address: '456 Strip Boulevard, Las Vegas, NV 89109',
        capacity: 200,
        pricePerNight: 12000,
        description: 'Ultra-luxury resort with world-class facilities',
        amenities: ['WiFi', 'Spa', 'Fine Dining', 'Casino Access', 'Pool', 'Concierge'],
      },
      {
        name: 'Private Island Retreat',
        city: 'Key West',
        country: 'USA',
        address: '789 Island Drive, Key West, FL 33040',
        capacity: 50,
        pricePerNight: 15000,
        description: 'Exclusive private island experience for premium retreats',
        amenities: ['WiFi', 'Private Beach', 'Yacht Access', 'Chef', 'Butler Service', 'Helipad'],
      },
      
      // Additional variety
      {
        name: 'Rustic Barn Venue',
        city: 'Nashville',
        country: 'USA',
        address: '321 Country Road, Nashville, TN 37201',
        capacity: 65,
        pricePerNight: 3800,
        description: 'Charming converted barn with modern amenities',
        amenities: ['WiFi', 'Outdoor Space', 'BBQ', 'Parking', 'Sound System'],
      },
      {
        name: 'Modern Loft Space',
        city: 'Los Angeles',
        country: 'USA',
        address: '567 Arts District, Los Angeles, CA 90013',
        capacity: 55,
        pricePerNight: 4800,
        description: 'Stylish loft in the heart of the arts district',
        amenities: ['WiFi', 'Projector', 'Kitchen', 'Parking', 'Rooftop'],
      },
      {
        name: 'Golf & Conference Resort',
        city: 'Scottsdale',
        country: 'USA',
        address: '890 Fairway Drive, Scottsdale, AZ 85255',
        capacity: 90,
        pricePerNight: 6500,
        description: 'Premier golf resort with extensive conference facilities',
        amenities: ['WiFi', 'Golf Course', 'Spa', 'Restaurant', 'Pool', 'Tennis Courts'],
      },
      {
        name: 'Corporate Training Facility',
        city: 'Atlanta',
        country: 'USA',
        address: '234 Business Park, Atlanta, GA 30309',
        capacity: 110,
        pricePerNight: 5500,
        description: 'Purpose-built training center with advanced AV equipment',
        amenities: ['WiFi', 'AV Equipment', 'Breakout Rooms', 'Catering', 'Parking'],
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

