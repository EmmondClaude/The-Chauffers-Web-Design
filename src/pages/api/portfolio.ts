import type { NextApiRequest, NextApiResponse } from 'next';
import type { Portfolio } from '@/types';

// Mock portfolio data - replace with Sanity CMS integration
const mockPortfolio: Portfolio[] = [
  {
    id: '1',
    title: 'Executive Transport Package',
    description: 'Premium luxury service for corporate events',
    image: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=500&h=400&fit=crop',
    category: 'corporate',
    featured: true,
  },
  {
    id: '2',
    title: 'Wedding Day Fleet',
    description: 'Complete chauffeur service for your special day',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop',
    category: 'weddings',
    featured: true,
  },
  {
    id: '3',
    title: 'Airport Transfers',
    description: 'Reliable ground transportation service',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&h=400&fit=crop',
    category: 'travel',
    featured: false,
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Portfolio[]>) {
  if (req.method !== 'GET') {
    return res.status(405).json([]);
  }

  try {
    const { featured } = req.query;

    let portfolio = mockPortfolio;

    if (featured === 'true') {
      portfolio = portfolio.filter((p) => p.featured);
    }

    // TODO: Replace with Sanity CMS query
    // const data = await client.fetch(`*[_type == "portfolio"]${featured === 'true' ? '[featured == true]' : ''}`);

    return res.status(200).json(portfolio);
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return res.status(500).json([]);
  }
}
