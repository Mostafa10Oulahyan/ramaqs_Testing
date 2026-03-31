import React from 'react';
import { MapPin, Calendar, User } from 'lucide-react';
import type { Person } from '../store/slices/celebsSlice';

interface PersonCardProps {
  person: Person;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  const imageUrl = person.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image';

  return (
    <div className="bg-[#1a1a1a] rounded overflow-hidden shadow-lg group relative flex flex-col h-full border border-zinc-800 transition-transform duration-300 hover:scale-[1.02]">
      {/* Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-black flex-shrink-0 cursor-pointer">
        <img 
          src={imageUrl} 
          alt={person.name}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          loading="lazy"
        />
      </div>

      {/* Content Container */}
      <div className="p-3 flex flex-col flex-grow relative bg-[#1a1a1a] z-10">
        <h3 className="text-white font-bold text-base line-clamp-1 hover:underline cursor-pointer">
          {person.name}
        </h3>
        
        {/* Sub Info */}
        <div className="mt-2 flex flex-col gap-[6px] text-xs text-zinc-400 font-medium">
           {person.country && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" /> 
                <span className="truncate">{person.country.name}</span>
              </span>
           )}
           {person.birthday && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{person.birthday}</span>
              </span>
           )}
           {person.gender && (
             <span className="flex items-center gap-1.5 mt-1">
               <span className="flex items-center gap-1 border border-zinc-700/80 px-1.5 py-[2px] rounded-sm bg-zinc-800 text-zinc-300">
                 <User className="w-3 h-3 text-zinc-400" />
                 {person.gender}
               </span>
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
