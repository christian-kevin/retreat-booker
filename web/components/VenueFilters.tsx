'use client';

interface VenueFiltersProps {
  onFilterChange: (filters: { city?: string; minCapacity?: number; maxPrice?: number }) => void;
}

export default function VenueFilters({ onFilterChange }: VenueFiltersProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const city = formData.get('city') as string;
    const minCapacity = formData.get('minCapacity') as string;
    const maxPrice = formData.get('maxPrice') as string;

    onFilterChange({
      city: city || undefined,
      minCapacity: minCapacity ? parseInt(minCapacity) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });
  };

  const handleReset = () => {
    onFilterChange({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filter Venues</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="e.g. Denver"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="minCapacity" className="block text-sm font-medium text-gray-700 mb-1">
            Min Capacity
          </label>
          <input
            type="number"
            name="minCapacity"
            id="minCapacity"
            min="1"
            placeholder="e.g. 30"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Max Price/Night
          </label>
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            min="0"
            placeholder="e.g. 5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

