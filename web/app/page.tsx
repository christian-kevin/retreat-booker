'use client';

import { useState, useEffect } from 'react';
import { getVenues, Venue, VenueFilters } from '@/lib/api';
import VenueFiltersComponent from '@/components/VenueFilters';
import VenueCard from '@/components/VenueCard';

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VenueFilters>({});

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVenues(filters);
        setVenues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [filters]);

  const handleFilterChange = (newFilters: VenueFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Your Perfect Venue
        </h1>
        <p className="text-gray-600">
          Discover amazing venues for your team offsites
        </p>
      </div>

      <div className="mb-8">
        <VenueFiltersComponent onFilterChange={handleFilterChange} />
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading venues...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      {!loading && !error && venues.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-800 text-lg">
            No venues found matching your criteria. Try adjusting your filters.
          </p>
        </div>
      )}

      {!loading && !error && venues.length > 0 && (
        <div>
          <p className="text-gray-600 mb-4">
            Found {venues.length} venue{venues.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

