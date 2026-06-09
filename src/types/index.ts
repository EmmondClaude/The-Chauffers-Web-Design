export interface BookingFormData {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  serviceType: 'standard' | 'premium' | 'vip';
  specialRequests?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: Date;
}
