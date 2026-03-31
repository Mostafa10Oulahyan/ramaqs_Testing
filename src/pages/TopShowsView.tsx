import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ShowCard from '../components/ShowCard';
import Loader from '../components/Loader';
import type { Show } from '../store/slices/tvShowSlice';

const TopShowsView: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopShows = async () => {
      try {
        setLoading(true);
        // TVMaze natively returns ~250 shows per page. We fetch the best dataset.
        const res = await fetch(`https://api.tvmaze.com/shows`);
        if (!res.ok) throw new Error('Failed to fetch from TVMaze');
        
        const data: Show[] = await res.json();

        // Ensure valid ratings, sort by average descending, slice to top 100.
        const top100Shows = data
          .filter(s => s.rating && s.rating.average && s.rating.average > 0)
          .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
          .slice(0, 100);
        
        setShows(top100Shows);
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching Top TV Shows');
      } finally {
        setLoading(false);
      }
    };

    fetchTopShows();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-black mb-8 border-l-4 border-[#f5c518] pl-4 ml-[-16px]">
          Top 100 TV Shows
        </h1>
        
        {loading ? (
          <div className="flex justify-center h-[50vh] items-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 m-8 max-w-4xl mx-auto">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {shows.map((show, index) => (
              <div key={`${show.id}-${index}`} className="relative h-full flex mt-2 md:mt-0">
                <div className="absolute -top-3 -right-2 z-20 bg-[#f5c518] text-black font-black text-xs md:text-sm px-2 py-0.5 rounded shadow-xl ring-2 ring-black">
                  #{index + 1}
                </div>
                <ShowCard show={show} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TopShowsView;
