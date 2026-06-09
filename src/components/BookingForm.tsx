'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { BookingFormData } from '@/types';

const bookingSchema = z.object({
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropoffLocation: z.string().min(1, 'Dropoff location is required'),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  passengers: z.number().min(1).max(8),
  serviceType: z.enum(['standard', 'premium', 'vip']),
  specialRequests: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
});

interface BookingFormProps {
  onSubmit?: (data: BookingFormData) => void;
}

const BookingForm: FC<BookingFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const handleFormSubmit = async (data: BookingFormData) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Booking failed');

      if (onSubmit) {
        onSubmit(data);
      }

      alert('Booking submitted successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg">
      <h2 className="text-3xl font-bold text-brand-accent mb-8">Book Your Ride</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white mb-2">First Name</label>
          <input
            {...register('firstName')}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
            placeholder="John"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-white mb-2">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white mb-2">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-white mb-2">Phone</label>
          <input
            {...register('phone')}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-white mb-2">Pickup Location</label>
          <input
            {...register('pickupLocation')}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
            placeholder="Enter pickup address"
          />
          {errors.pickupLocation && <p className="text-red-500 text-sm mt-1">{errors.pickupLocation.message}</p>}
        </div>
        <div>
          <label className="block text-white mb-2">Dropoff Location</label>
          <input
            {...register('dropoffLocation')}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
            placeholder="Enter dropoff address"
          />
          {errors.dropoffLocation && <p className="text-red-500 text-sm mt-1">{errors.dropoffLocation.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-white mb-2">Date</label>
          <input
            {...register('pickupDate')}
            type="date"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
          />
          {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate.message}</p>}
        </div>
        <div>
          <label className="block text-white mb-2">Time</label>
          <input
            {...register('pickupTime')}
            type="time"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
          />
          {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime.message}</p>}
        </div>
        <div>
          <label className="block text-white mb-2">Passengers</label>
          <input
            {...register('passengers', { valueAsNumber: true })}
            type="number"
            min="1"
            max="8"
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
          />
          {errors.passengers && <p className="text-red-500 text-sm mt-1">{errors.passengers.message}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-white mb-2">Service Type</label>
        <select
          {...register('serviceType')}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </select>
        {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType.message}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-white mb-2">Special Requests</label>
        <textarea
          {...register('specialRequests')}
          className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-brand-accent outline-none"
          placeholder="Any special requests?"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Book Now'}
      </button>
    </form>
  );
};

export default BookingForm;
