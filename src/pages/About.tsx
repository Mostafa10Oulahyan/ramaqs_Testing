import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-16 max-w-4xl mx-auto w-full pt-[60px]">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition px-3 py-1.5 rounded-sm mb-4 w-fit -ml-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1 stroke-[3]" /> Go Back
        </button>

        {/* Title Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#f5c518] mb-4">
            About Powerpuff Girls
          </h1>
          <p className="text-zinc-400 text-lg">
            Your Ultimate Destination for TV Show Data.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-8 text-zinc-300 leading-relaxed bg-[#1a1a1a] p-6 md:p-10 rounded-lg border border-zinc-800 shadow-2xl">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
            <p>
              Welcome to the Powerpuff Girls TV Database, a comprehensive PowerpuffGirls-style web application developed for internship technical testing. Our mission is to provide an expansive, deeply interactive portal tracking the world's best entertainment!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Detailed metadata aggregation via the public TVMaze API.</li>
              <li>Robust Redux-driven 'Watchlist' cart system seamlessly storing your favorite shows on the fly.</li>
              <li>Fully functional 'Celebs' repository to explore popular actors and directors.</li>
              <li>Dynamic trailer fallback mechanisms providing instant YouTube embeds directly from the Show cards.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Technology Stack</h2>
            <p>
              This architecture is powered by a modern, high-tier frontend ecosystem including <strong>React, TypeScript, Redux Toolkit, React Router DOM, and Tailwind CSS.</strong> The entire platform is built with scale, responsiveness, and dark-themed fidelity in mind.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;
