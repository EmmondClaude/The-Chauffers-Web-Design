import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { pickupLocation, dropoffLocation, pickupDate, pickupTime, passengers, serviceType, email, firstName, lastName } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !passengers || !serviceType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // TODO: Integrate with database
    // For now, log the booking data
    console.log('New booking:', {
      pickupLocation,
      dropoffLocation,
      pickupDate,
      pickupTime,
      passengers,
      serviceType,
      email,
      firstName,
      lastName,
      createdAt: new Date(),
    });

    // TODO: Send confirmation email

    return res.status(200).json({
      success: true,
      message: 'Booking received. We will contact you shortly.',
      bookingId: Math.random().toString(36).substr(2, 9),
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
