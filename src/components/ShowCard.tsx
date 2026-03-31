import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleWatchlist } from '../store/slices/watchlistSlice';
import type { Show } from '../store/slices/tvShowSlice';

interface ShowCardProps {
  show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector(state => state.watchlist.items);
  
  const inWatchlist = watchlist.some(item => item.id === show.id);

  const handleCardClick = () => {
    if (show.isMovie) {
      navigate(`/movie/${show.id}`);
    } else {
      navigate(`/show/${show.id}`);
    }
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation
    dispatch(toggleWatchlist(show));
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TVMaze doesn't typically provide video embeds standard, so we search YouTube
    const query = encodeURIComponent(`${show.name} Trailer`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div 
      onClick={handleCardClick}
      className="flex flex-col bg-[#1A1A1A] text-white hover:bg-[#202020] transition-colors w-full h-[380px] sm:h-[420px] shadow-lg overflow-hidden relative group rounded-md cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-[220px] sm:h-[260px] w-full shrink-0">
        <img 
          src={show.image?.medium || show.image?.original || 'https://via.placeholder.com/300x450'} 
          alt={show.name}
          className="w-full h-full object-cover"
        />
        
        {/* Top-left Watchlist add button */}
        <div 
          onClick={handleWatchlistClick}
          className="absolute top-0 left-0 bg-black/70 p-2 hover:bg-zinc-700/80 cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 transition-colors"
        >
          {inWatchlist ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col p-4 flex-grow min-h-0 relative">
        
        {/* Star Rating & Context */}
        <div className="flex items-center gap-1 text-zinc-400 text-sm mb-1 mt-auto shrink-0">
          <span className="text-[#f5c518] text-base">★</span> 
          <span className="mt-0.5">{typeof show.rating?.average === 'number' ? show.rating.average.toFixed(2) : 'N/A'}</span>
          <span className="ml-auto text-blue-500 hover:text-white transition-colors cursor-pointer group/rate">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 hidden group-hover/rate:inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-1.81.168l1.325 5.042c.11.42-.358.761-.722.548l-4.944-2.888a.563.563 0 00-.546 0l-4.944 2.888c-.364.213-.832-.128-.722-.548l1.325-5.042a.563.563 0 00-1.81-.168l-4.204-3.602c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-tight mt-1 line-clamp-1 hover:underline">
          {show.name}
        </h3>
        
        {/* Genre subtitle */}
        <p className="text-zinc-400 text-xs mt-1 line-clamp-1">
          {show.genres?.join(', ') || 'Various'}
        </p>

        {/* Watch Button */}
        <div className="mt-auto w-full pt-3 shrink-0">
          <button 
            onClick={handleTrailerClick}
            className="w-full bg-[#1A1A1A] text-blue-500 font-semibold py-1.5 rounded-md hover:bg-zinc-800 transition-colors flex justify-center items-center gap-2 text-sm z-10 relative"
          >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            Trailer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowCard;
