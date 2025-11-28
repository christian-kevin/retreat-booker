'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBookingInquiry, Venue } from '@/lib/api';

interface BookingFormProps {
  venue: Venue;
}

export default function BookingForm({ venue }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const inquiry = {
      venueId: venue.id,
      companyName: formData.get('companyName') as string,
      email: formData.get('email') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      attendeeCount: parseInt(formData.get('attendeeCount') as string),
    };

    try {
      await createBookingInquiry(inquiry);
      setSuccess(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking inquiry');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-semibold text-green-800 mb-2">
          Booking Inquiry Submitted!
        </h3>
        <p className="text-green-700">
          We'll get back to you shortly. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name *
        </label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Acme Corporation"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="contact@example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date *
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="attendeeCount" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Attendees *
        </label>
        <input
          type="number"
          name="attendeeCount"
          id="attendeeCount"
          required
          min="1"
          max={venue.capacity}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Max ${venue.capacity} people`}
        />
        <p className="mt-1 text-sm text-gray-500">
          This venue can accommodate up to {venue.capacity} people
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Booking Inquiry'}
      </button>
    </form>
  );
}

