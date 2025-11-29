'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getVenues, Venue } from '@/lib/api';
import BookingForm from '@/components/BookingForm';

export default function VenuePage() {
  const params = useParams();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await getVenues();
        const found = response.data.find((v: Venue) => v.id === params.id);
        
        if (found) {
          setVenue(found);
        } else {
          setError('Venue not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load venue');
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-800 text-lg mb-4">
            {error || 'Venue not found'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        ← Back to Venues
      </button>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{venue.name}</h1>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-700">
            <span className="font-medium">Location:</span> {venue.address}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">City:</span> {venue.city}, {venue.country}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Capacity:</span> Up to {venue.capacity} people
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Price:</span>{' '}
            <span className="text-2xl font-bold text-blue-600">
              ${venue.pricePerNight.toLocaleString()}
            </span>
            <span className="text-gray-600"> per night</span>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700">{venue.description}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {venue.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Request a Booking
        </h2>
        <BookingForm venue={venue} />
      </div>
    </div>
  );
}

