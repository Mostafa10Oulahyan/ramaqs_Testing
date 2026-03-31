import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleWatchlist } from '../store/slices/watchlistSlice';
import type { Show } from '../store/slices/tvShowSlice';

interface ShowDetailsProps {
  show: Show;
}

const ShowDetails: React.FC<ShowDetailsProps> = ({ show }) => {
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector(state => state.watchlist.items);
  
  const inWatchlist = watchlist.some(item => item.id === show.id);
  const bgImage = show.image?.original || show.image?.medium || '';

  const handleTrailer = () => {
    const query = encodeURIComponent(`${show.name} Trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '70vh', minHeight: '600px', maxHeight: '800px' }}>
      {/* Blurred Deep Background (Fallbacks for empty sides) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-top opacity-30 blur-3xl scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Contained Full Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-contain bg-center md:bg-[80%_top] bg-no-repeat opacity-50 md:opacity-80"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Gradients blending into the background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end pb-12 px-4 sm:px-12 lg:px-24">
        
        {/* Content overlaid at the bottom */}
        <div className="max-w-4xl pt-[20%]">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            {show.name}
          </h1>
          
          {/* Genre Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {show.genres.map((genre) => (
              <span key={genre} className="px-3 py-1 rounded-full border border-zinc-400/50 bg-black/60 backdrop-blur-sm text-sm text-zinc-300">
                {genre}
              </span>
            ))}
          </div>

          {/* Description */}
          <div 
            className="text-lg md:text-xl text-zinc-100 max-w-2xl line-clamp-3 mb-6 leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            dangerouslySetInnerHTML={{ __html: show.summary || "" }}
          />

          <p className="text-zinc-300 font-semibold mb-8">On Television</p>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleTrailer}
              className="bg-white text-black font-bold py-3 px-8 rounded flex items-center gap-2 hover:bg-zinc-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              Watch Trailer
            </button>
            <button 
              onClick={() => dispatch(toggleWatchlist(show))}
              className={`backdrop-blur-sm text-white border border-zinc-600 font-bold py-3 px-8 rounded flex items-center gap-2 transition-colors ${inWatchlist ? 'bg-green-700/80 hover:bg-green-600' : 'bg-zinc-800/80 hover:bg-zinc-700'}`}
            >
              {inWatchlist ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )}
              {inWatchlist ? 'In Watchlist' : 'Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
