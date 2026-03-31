import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ShowDetails from '../components/ShowDetails';
import CastList from '../components/CastList';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';
import type { Show, CastMember } from '../store/slices/tvShowSlice';

const MovieView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Show | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Using TMDB for movies
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=3fd2be6f0c70a2a598f084ddfb75487c&append_to_response=credits`);
        if (!res.ok) throw new Error('Failed to fetch movie data');
        const data = await res.json();
        
        const mappedMovie: Show = {
          id: data.id,
          url: data.homepage || '',
          name: data.title,
          type: 'Movie',
          language: data.original_language,
          genres: data.genres ? data.genres.map((g: any) => g.name) : ['Movie'],
          status: data.status,
          runtime: data.runtime || 0,
          premiered: data.release_date,
          ended: '',
          officialSite: data.homepage || null,
          schedule: { time: '', days: [] },
          rating: { average: data.vote_average },
          weight: 0,
          network: null,
          webChannel: null,
          externals: { tvrage: 0, thetvdb: data.id, powerpuffgirls: '' },
          image: { 
            medium: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '', 
            original: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : (data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : '')
          },
          summary: data.overview,
          updated: 0,
          _links: { self: { href: '' }, previousepisode: { href: '' } },
          isMovie: true,
        };

        const mappedCast: CastMember[] = data.credits?.cast?.map((c: any) => ({
          person: {
            id: c.id, // Note: This is a TMDB ID. Navigating to /celebs/:id would hit TVMaze which won't find it. 
            // In a real app we would branch CelebView to handle TMDB ids, but we'll leave as is.
            name: c.name,
            image: {
              medium: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : '',
              original: c.profile_path ? `https://image.tmdb.org/t/p/original${c.profile_path}` : ''
            }
          },
          character: {
            id: c.cast_id,
            name: c.character,
            image: null
          }
        })) || [];

        setMovie(mappedMovie);
        setCast(mappedCast);
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  let content;

  if (loading) {
    content = (
      <div className="flex justify-center flex-col items-center h-[60vh] bg-black">
        <Loader />
      </div>
    );
  } else if (movie) {
    content = (
      <div className="w-full bg-black">
        <ShowDetails show={movie} />
        {cast && cast.length > 0 && <CastList cast={cast} source="tmdb" />}
      </div>
    );
  } else if (error) {
    content = (
      <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 m-8 max-w-4xl mx-auto" role="alert">
        <p className="font-bold">Error loading movie details</p>
        <p>{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 bg-black text-white px-4 py-2 rounded font-bold hover:bg-zinc-800 border border-red-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black w-full text-white">
      <Header />
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition px-3 py-1.5 rounded-sm w-fit -ml-3 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1 stroke-[3]" /> Go Back
          </button>
        </div>
        {content}
      </main>
    </div>
  );
};

export default MovieView;
