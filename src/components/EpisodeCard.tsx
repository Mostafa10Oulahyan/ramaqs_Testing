import React from 'react';
import { Link } from 'react-router-dom';
import type { Episode } from '../store/slices/tvShowSlice';

interface EpisodeCardProps {
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  return (
    <Link 
      to={`/episode/${episode.id}`}
      className="flex flex-col bg-[#1A1A1A] text-white hover:bg-zinc-800 transition-colors w-full h-[380px] shadow-lg overflow-hidden relative group"
    >
      {/* Thumbnail */}
      <div className="relative h-[220px] w-full shrink-0">
        <img 
          src={episode.image?.medium || episode.image?.original || 'https://via.placeholder.com/300x170'} 
          alt={episode.name}
          className="w-full h-full object-cover"
        />
        {/* Top-left Watchlist add button */}
        <div className="absolute top-0 left-0 bg-black/60 p-2 hover:bg-zinc-700/80 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col p-4 flex-grow min-h-0">
        
        {/* Star Rating & Info Context */}
        <div className="flex items-center gap-1 text-zinc-400 text-sm mb-1 mt-auto shrink-0">
          <span className="text-yellow-500">★</span> 
          <span>{episode.rating.average || 'N/A'}</span>
          <span className="mx-2 px-1 border border-zinc-600 text-[10px] rounded-sm text-zinc-400">
            S{episode.season}E{episode.number}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base leading-tight mt-1 line-clamp-2">
          {episode.name}
        </h3>
        
        {/* Watch Button */}
        <div className="mt-auto w-full pt-3 shrink-0">
          <button className="w-full bg-[#1A1A1A] text-blue-400 font-semibold py-2 rounded-md hover:bg-zinc-700 transition-colors border-2 border-transparent group-hover:bg-zinc-700 flex justify-center items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            Watch Episode
          </button>
        </div>
      </div>
    </Link>
  );
};

export default EpisodeCard;
