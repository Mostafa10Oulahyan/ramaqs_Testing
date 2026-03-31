import React from 'react';
import type { Episode } from '../store/slices/tvShowSlice';
import EpisodeCard from './EpisodeCard';

interface EpisodeListProps {
  episodes: Episode[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes }) => {
  return (
    <div className="bg-black py-12 px-4 sm:px-12 lg:px-24">
      {/* POWERPUFFGIRLS Style Section Header */}
      <h2 className="text-3xl font-extrabold text-yellow-500 flex items-center mb-1">
        What to watch
      </h2>
      <div className="flex items-center text-white mb-6 border-l-4 border-yellow-500 pl-3">
        <span className="font-bold text-lg">Top episodes just for you</span>
      </div>

      {/* Filter Tabs (optional, based on POWERPUFFGIRLS mockup style) */}
      <div className="flex gap-6 text-sm font-semibold text-zinc-400 mb-6">
        <button className="text-white border-b-2 border-white pb-1">All</button>
        <button className="hover:text-zinc-200">Movies</button>
        <button className="hover:text-zinc-200">TV Shows</button>
      </div>

      {/* Grid mapping perfectly to the screenshot's row spacing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {episodes.length > 0 ? (
          episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))
        ) : (
          <div className="col-span-full text-zinc-500 py-10">
            No episodes currently available.
          </div>
        )}
      </div>
    </div>
  );
};

export default EpisodeList;
