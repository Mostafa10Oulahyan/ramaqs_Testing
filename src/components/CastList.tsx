import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CastMember } from '../store/slices/tvShowSlice';

interface CastListProps {
  cast: CastMember[];
  source?: 'tmdb' | 'tvmaze';
}

const CastList: React.FC<CastListProps> = ({ cast, source = 'tvmaze' }) => {
  const navigate = useNavigate();

  if (!cast || cast.length === 0) return null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <h2 className="text-2xl font-bold border-l-4 border-[#f5c518] pl-3 ml-[-12px] mb-6">
        Cast
      </h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {cast.map((member, idx) => (
          <div 
            key={`${member.person.id}-${idx}`}
            onClick={() => navigate(`/celebs/${member.person.id}?source=${source}`)}
            className="flex flex-col flex-shrink-0 w-32 sm:w-40 cursor-pointer group bg-[#1A1A1A] rounded-md overflow-hidden snap-start hover:bg-zinc-800 transition-colors"
          >
            <div className="w-full aspect-[2/3] overflow-hidden">
              <img 
                src={member.person.image?.medium || member.person.image?.original || 'https://via.placeholder.com/150x225'} 
                alt={member.person.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#f5c518] transition-colors">
                {member.person.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                {member.character.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastList;
