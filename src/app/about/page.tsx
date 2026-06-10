import type { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';

export const metadata: Metadata = {
  title: 'About — The Chauffeurs',
  description:
    'A Las Vegas–born private chauffeur service built on quiet command — licensed, insured, flight-aware, available 24/7 with drop-offs to California, Arizona & Utah.',
};

export default function About() {
  return <AboutPage />;
}
