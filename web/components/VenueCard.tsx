import Link from 'next/link';
import { Venue } from '@/lib/api';

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
        <p className="text-gray-600 mb-1">
          📍 {venue.city}, {venue.country}
        </p>
        <p className="text-gray-700 mb-3 line-clamp-2">{venue.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Capacity:</span> {venue.capacity} people
          </div>
          <div className="text-lg font-bold text-blue-600">
            ${venue.pricePerNight.toLocaleString()}/night
          </div>
        </div>

        <div className="mb-4 flex-grow">
          <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
          <div className="flex flex-wrap gap-2">
            {venue.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/venues/${venue.id}`}
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mt-auto"
        >
          Book This Venue
        </Link>
      </div>
    </div>
  );
}

