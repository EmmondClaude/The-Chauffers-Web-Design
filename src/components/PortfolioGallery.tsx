'use client';

import { FC, useEffect, useState } from 'react';
import type { Portfolio } from '@/types';

interface PortfolioGalleryProps {
  featured?: boolean;
}

const PortfolioGallery: FC<PortfolioGalleryProps> = ({ featured = false }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const endpoint = featured ? '/api/portfolio?featured=true' : '/api/portfolio';
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch portfolio');
        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        console.error('Portfolio fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [featured]);

  const filtered = filter === 'all' ? portfolios : portfolios.filter((p) => p.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-brand-accent text-lg">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-brand-accent mb-12">Our Work</h2>

        {/* Filter buttons */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded transition ${
              filter === 'all' ? 'bg-brand-accent text-brand-dark' : 'border border-brand-accent text-brand-accent'
            }`}
          >
            All
          </button>
          {Array.from(new Set(portfolios.map((p) => p.category))).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded transition capitalize ${
                filter === cat ? 'bg-brand-accent text-brand-dark' : 'border border-brand-accent text-brand-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg h-80 bg-gray-800">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-brand-light text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-brand-light">
            <p>No portfolio items found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioGallery;
