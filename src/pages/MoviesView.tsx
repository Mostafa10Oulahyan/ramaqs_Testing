import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import type { Show } from '../store/slices/tvShowSlice';
import ShowCard from '../components/ShowCard';
import Header from '../components/Header';
import Loader from '../components/Loader';

const MoviesView: React.FC = () => {
  const [movies, setMovies] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Pull in Global Search state
  const { searchResults, searchQuery, status: searchStatus } = useAppSelector((state) => state.showsList);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Using TMDB for movies, mapping to our TV Show interface
        const res = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1');
        if (!res.ok) throw new Error('Failed to fetch movies data');
        const data = await res.json();
        
        const mappedMovies: Show[] = data.results
          .filter((m: any) => m.vote_average && m.vote_average > 0)
          .map((m: any) => ({
            id: m.id,
            url: '',
            name: m.title,
            type: 'Movie',
            language: m.original_language,
            genres: ['Movie'],
            status: 'Released',
            runtime: 0,
            premiered: m.release_date,
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
          }));
        setMovies(mappedMovies);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const isSearching = !!searchQuery;
  const activeShows = isSearching 
    ? searchResults.filter(s => s.isMovie && s.rating?.average) 
    : movies;
  const displayLoading = isSearching ? searchStatus === 'loading' : loading;

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl mx-auto w-full pt-[60px]">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition px-3 py-1.5 rounded-sm mb-4 w-fit -ml-3"
        >
          <ArrowLeft className="w-4 h-4 mr-1 stroke-[3]" /> Go Back
        </button>

        {/* Title Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-normal tracking-tight border-l-4 border-[#f5c518] pl-2 md:pl-3 ml-[-12px] md:ml-[-16px]">
            {isSearching ? `Search Results: "${searchQuery}"` : 'Movies'}
          </h1>
          {!isSearching && (
            <h2 className="text-zinc-400 text-sm md:text-base mt-2">
              Explore long-format features and premium cinema.
            </h2>
          )}
        </div>

        {/* Content State */}
        {displayLoading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-20 text-red-400 p-4 border border-red-900/30 rounded bg-red-900/10">
            {error}
          </div>
        ) : activeShows.length === 0 ? (
          <div className="col-span-full text-zinc-500 py-10">
            No results found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 pb-20">
            {activeShows.map((movie: Show) => (
              // Add a prefix to TMDB ids if mixed, but since they are mapped and isolated, we just pass the object
              <div key={`${movie.isMovie ? 'm-' : ''}${movie.id}`}>
                <ShowCard show={movie} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MoviesView;
