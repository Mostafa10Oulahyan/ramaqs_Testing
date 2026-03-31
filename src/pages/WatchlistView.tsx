import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import Header from '../components/Header';
import ShowCard from '../components/ShowCard';

const WatchlistView: React.FC = () => {
  const watchlist = useAppSelector(state => state.watchlist.items);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black w-full text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition px-3 py-1.5 rounded-sm mb-4 w-fit -ml-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1 stroke-[3]" /> Go Back
        </button>

        <h1 className="text-3xl font-extrabold text-[#f5c518] flex items-center mb-1">
          Your Watchlist
        </h1>
        <div className="flex items-center text-white mb-6 border-l-4 border-[#f5c518] pl-3">
          <span className="font-bold text-lg">Shows you've saved to watch later</span>
        </div>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mt-8">
            {watchlist.map(show => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-16 border border-zinc-900 rounded-lg mt-8 bg-[#121212]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-zinc-600 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            <h2 className="text-xl font-bold text-zinc-300">Your Watchlist is Empty</h2>
            <p className="text-zinc-500 mt-2 text-center max-w-sm">
              Save shows and movies to keep track of what you want to watch. Click the green [+] inside the show cards to add them!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistView;
