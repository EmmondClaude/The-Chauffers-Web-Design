import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import LuxuryTransportSite from '@/components/LuxuryTransportSite';

afterEach(cleanup);

describe('LuxuryTransportSite (smoke / extraction integrity)', () => {
  it('renders the intro with the brand tagline and an Enter button', () => {
    render(<LuxuryTransportSite />);
    expect(screen.getByText(/your driver awaits/i)).toBeInTheDocument();
    expect(screen.getAllByText('The Chauffeurs').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /enter/i })).toBeInTheDocument();
  });

  it('reveals the main site (nav, fleet, reserve) after clicking Enter', () => {
    render(<LuxuryTransportSite />);
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(screen.getByRole('button', { name: /^fleet$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book a car/i })).toBeInTheDocument();
  });

  it('renders the reserve heading once revealed', () => {
    render(<LuxuryTransportSite />);
    fireEvent.click(screen.getByRole('button', { name: /enter/i }));
    expect(screen.getByText(/book your chauffeur/i)).toBeInTheDocument();
  });
});
