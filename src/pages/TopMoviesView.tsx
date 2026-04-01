import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ShowCard from '../components/ShowCard';
import Loader from '../components/Loader';
import type { Show } from '../store/slices/tvShowSlice';

const TopMoviesView: React.FC = () => {
  const [movies, setMovies] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        setLoading(true);
        // TMDB top_rated gives 20 per page. We need 100, so we fetch 5 pages.
        const pageRequests = Array.from({ length: 5 }, (_, i) => 
          fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=${i + 1}`)
            .then(res => {
              if (!res.ok) throw new Error('Failed to fetch from TMDB');
              return res.json();
            })
        );
        
        const pagesData = await Promise.all(pageRequests);
        let allResults: any[] = [];
        pagesData.forEach(page => {
           if (page.results) {
             allResults = [...allResults, ...page.results];
           }
        });

        const mappedMovies: Show[] = allResults
          .filter((m: any) => m.vote_average && m.vote_average > 0)
          .slice(0, 100) // Ensure exactly 100 (if any were filtered out, we might have slightly fewer, but that's fine/accurate to standard)
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
        setError(err.message || 'An error occurred fetching Top Movies');
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovies();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-black text-white">
      <Header />
      <main className="flex-grow px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-20 md:pt-24 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-black mb-8 border-l-4 border-[#f5c518] pl-4 ml-[-16px]">
          Top 100 Movies
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
            {movies.map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="relative h-full flex">
                <div className="absolute top-2 right-2 z-20 bg-[#f5c518] text-black font-black text-xs md:text-sm px-2 py-0.5 rounded shadow-lg ring-2 ring-black">
                  #{index + 1}
                </div>
                <ShowCard show={movie} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TopMoviesView;
