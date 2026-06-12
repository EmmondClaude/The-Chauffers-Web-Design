import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import LuxuryTransportSite from '@/components/LuxuryTransportSite';

afterEach(cleanup);

describe('LuxuryTransportSite (smoke / extraction integrity)', () => {
  it('renders the intro loading sequence', () => {
    render(<LuxuryTransportSite />);
    expect(screen.getByText(/your driver awaits/i)).toBeInTheDocument();
    expect(screen.getByText(/preparing your arrival/i)).toBeInTheDocument();
    expect(screen.getAllByText('The Chauffeurs').length).toBeGreaterThan(0);
  });

  it('renders the main site (nav, fleet, reserve)', () => {
    render(<LuxuryTransportSite />);
    expect(screen.getByRole('button', { name: /^fleet$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book a car/i })).toBeInTheDocument();
  });

  it('renders the reserve heading', () => {
    render(<LuxuryTransportSite />);
    expect(screen.getByText(/book your chauffeur/i)).toBeInTheDocument();
  });
});
