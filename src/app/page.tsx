import LuxuryTransportSite from '@/components/LuxuryTransportSite';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollProgress from '@/components/ScrollProgress';

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <LuxuryTransportSite />
    </SmoothScroll>
  );
}
