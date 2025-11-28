const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  capacity: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
}

export interface BookingInquiry {
  venueId: string;
  companyName: string;
  email: string;
  startDate: string;
  endDate: string;
  attendeeCount: number;
}

export interface VenueFilters {
  city?: string;
  minCapacity?: number;
  maxPrice?: number;
}

export async function getVenues(filters?: VenueFilters): Promise<Venue[]> {
  const params = new URLSearchParams();
  if (filters?.city) params.append('city', filters.city);
  if (filters?.minCapacity) params.append('minCapacity', filters.minCapacity.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

  const url = `${API_URL}/venues${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, { cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }
  
  const result = await response.json();
  // Backend returns { data: Venue[], meta: {...} }
  return result.data || result;
}

export async function createBookingInquiry(inquiry: BookingInquiry) {
  const response = await fetch(`${API_URL}/booking-inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inquiry),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create booking inquiry');
  }

  return response.json();
}

export async function getVenueCities(): Promise<string[]> {
  const response = await fetch(`${API_URL}/venues/cities`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch cities');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

