import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User } from 'lucide-react';
import Header from '../components/Header';
import Loader from '../components/Loader';
import ShowCard from '../components/ShowCard';
import type { Show } from '../store/slices/tvShowSlice';
import type { Person } from '../store/slices/celebsSlice';

interface CastCredit {
  _embedded: {
    show: Show;
  };
}

const CelebDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const source = params.get('source');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [person, setPerson] = useState<Person | null>(null);
  const [credits, setCredits] = useState<Show[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCelebData = async () => {
      try {
        setLoading(true);
        if (source === 'tmdb') {
          // 1. Fetch Person Details from TMDB
          const personRes = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=3fd2be6f0c70a2a598f084ddfb75487c`);
          if (!personRes.ok) throw new Error('Person not found');
          const data = await personRes.json();
          setPerson({
            id: data.id,
            name: data.name,
            url: '',
            image: {
              medium: data.profile_path ? `https://image.tmdb.org/t/p/w185${data.profile_path}` : '',
              original: data.profile_path ? `https://image.tmdb.org/t/p/original${data.profile_path}` : ''
            },
            country: data.place_of_birth ? { name: data.place_of_birth, code: '', timezone: '' } : undefined,
            birthday: data.birthday,
            deathday: data.deathday || undefined,
            gender: data.gender === 1 ? 'Female' : (data.gender === 2 ? 'Male' : '')
          });

          // 2. Fetch TMDB Movie Credits
          const creditsRes = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=3fd2be6f0c70a2a598f084ddfb75487c`);
          if (!creditsRes.ok) throw new Error('Failed to fetch works');
          const creditsData = await creditsRes.json();
          const movies = creditsData.cast || [];
          const uniqueShows = new Map<number, Show>();
          movies.forEach((m: any) => {
             if (m.vote_average && m.vote_average > 0) {
                uniqueShows.set(m.id, {
                  id: m.id,
                  url: '',
                  name: m.title,
                  type: 'Movie',
                  language: m.original_language,
                  genres: ['Movie'],
                  status: 'Released',
                  runtime: 0,
                  premiered: m.release_date || '',
                  ended: '',
                  officialSite: null,
                  schedule: { time: '', days: [] },
                  rating: { average: m.vote_average },
                  weight: 0,
                  network: null,
                  webChannel: null,
                  externals: { tvrage: 0, thetvdb: 0, powerpuffgirls: '' },
                  image: { 
                    medium: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : '', 
                    original: m.poster_path ? `https://image.tmdb.org/t/p/original${m.poster_path}` : '' 
                  },
                  summary: m.overview,
                  updated: 0,
                  _links: { self: { href: '' }, previousepisode: { href: '' } },
                  isMovie: true,
                });
             }
          });
          setCredits(Array.from(uniqueShows.values()));
        } else {
          // 1. Fetch Person Details from TVMaze
          const personRes = await fetch(`https://api.tvmaze.com/people/${id}`);
          if (!personRes.ok) throw new Error('Person not found');
          const personData = await personRes.json();
          setPerson(personData);
  
          // 2. Fetch Cast Credits (His Works)
          const worksRes = await fetch(`https://api.tvmaze.com/people/${id}/castcredits?embed=show`);
          if (!worksRes.ok) throw new Error('Failed to fetch works');
          const worksData: CastCredit[] = await worksRes.json();
          
          // Extract embedded shows and filter duplicates/nulls
          const uniqueShows = new Map<number, Show>();
          worksData.forEach(credit => {
            if (credit._embedded && credit._embedded.show) {
               const sh = credit._embedded.show;
               if (sh.rating && sh.rating.average && sh.rating.average > 0) {
                 uniqueShows.set(sh.id, sh);
               }
            }
          });
          
          setCredits(Array.from(uniqueShows.values()));
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCelebData();
    }
  }, [id]);

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full pt-[60px]">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition px-3 py-1.5 rounded-sm mb-6 w-fit -ml-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1 stroke-[3]" /> Go Back
        </button>

        {loading ? (
          <div className="flex justify-center h-[50vh] items-center">
            <Loader />
          </div>
        ) : error || !person ? (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg text-center mt-10 text-red-400">
            {error || 'Celebrity not found'}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Left Sidebar: Photo & Details */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-row md:flex-col gap-5 md:gap-0 shrink-0">
              {/* Poster Art */}
              <div className="w-36 sm:w-48 md:w-full shrink-0 bg-[#1a1a1a] p-1.5 md:p-2 border border-zinc-800 rounded shadow-2xl">
                <img 
                  src={person.image?.original || person.image?.medium || 'https://via.placeholder.com/300x450'} 
                  alt={person.name}
                  className="w-full h-auto object-cover rounded aspect-[2/3]"
                />
              </div>
              
              {/* Text Meta Container */}
              <div className="flex flex-col justify-center md:justify-start md:mt-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 md:mb-4 tracking-tight leading-tight">
                  {person.name}
                </h1>
                
                <div className="flex flex-col gap-2 md:gap-3 text-xs sm:text-sm text-zinc-300 font-medium pb-2 md:pb-0">
                  {person.country && (
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-zinc-400 shrink-0" /> {person.country.name}
                    </span>
                  )}
                  {person.birthday && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-zinc-400 shrink-0" /> {person.birthday}
                    </span>
                  )}
                  {person.gender && (
                    <span className="flex items-center gap-2 mt-1 md:mt-2">
                      <span className="flex items-center gap-1.5 border border-zinc-700 px-2 py-0.5 rounded text-zinc-300 bg-zinc-800 w-fit">
                        <User className="w-3.5 h-3.5 shrink-0" /> {person.gender}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Cast Credits Grid */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold border-l-4 border-[#f5c518] pl-3 ml-[-12px] mb-6 mt-4 md:mt-0 pb-1">
                Known For
              </h2>

              {credits.length === 0 ? (
                <div className="text-zinc-500 bg-zinc-900/40 p-10 border border-zinc-800/60 rounded text-center">
                  No registered works found for this person.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {credits.map((show) => (
                    <ShowCard key={show.id} show={show} />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default CelebDetailsView;
