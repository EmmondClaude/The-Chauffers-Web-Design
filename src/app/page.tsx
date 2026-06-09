import { FC } from 'react';

const Home: FC = () => {
  return (
    <main className="min-h-screen">
      <section className="flex items-center justify-center h-screen bg-brand-dark">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-brand-accent mb-4">
            The Chauffers
          </h1>
          <p className="text-xl text-brand-light mb-8">
            Premium Chauffeur Service
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-brand-accent text-brand-dark font-semibold rounded hover:opacity-90 transition">
              Book Now
            </button>
            <button className="px-8 py-3 border-2 border-brand-accent text-brand-accent font-semibold rounded hover:bg-brand-accent hover:text-brand-dark transition">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
