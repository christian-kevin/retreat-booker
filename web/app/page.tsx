'use client';

import { useState, useEffect } from 'react';
import { getVenues, Venue, VenueFilters, VenuesResponse } from '@/lib/api';
import VenueFiltersComponent from '@/components/VenueFilters';
import VenueCard from '@/components/VenueCard';

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [pagination, setPagination] = useState<VenuesResponse['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VenueFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getVenues({ ...filters, page: currentPage, limit: 9 });
        setVenues(response.data);
        setPagination(response.meta);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load venues';
        console.error('Error fetching venues:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: VenueFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
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
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">
              Showing {venues.length} of {pagination?.total || 0} venue{pagination?.total !== 1 ? 's' : ''}
              {pagination && pagination.totalPages > 1 && (
                <span className="text-gray-500"> (Page {pagination.page} of {pagination.totalPages})</span>
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
          
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPreviousPage || loading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

