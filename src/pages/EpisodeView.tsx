import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEpisodeById } from '../store/slices/episodeSlice';
import Header from '../components/Header';
import Loader from '../components/Loader';

const EpisodeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { episodes } = useAppSelector((state) => state.tvShow);
  const existingEpisode = episodes.find(ep => ep.id.toString() === id);

  const { episode, status, error } = useAppSelector((state) => state.episode);
  const displayEpisode = existingEpisode || episode;

  useEffect(() => {
    if (!existingEpisode && id) {
      dispatch(fetchEpisodeById(id));
    }
  }, [existingEpisode, id, dispatch]);

  let content;

  if (status === 'loading' && !existingEpisode) {
    content = (
      <div className="flex justify-center items-center h-[60vh] bg-black">
        <Loader />
      </div>
    );
  } else if (displayEpisode) {
    content = (
      <div className="bg-[#121212] overflow-hidden max-w-5xl mx-auto border border-zinc-900 my-8 shadow-2xl pb-12">
        <div className="relative h-[600px] bg-black overflow-hidden">
          {/* Blurred Background Layer */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-top opacity-30 blur-3xl scale-110"
            style={{ backgroundImage: `url(${displayEpisode.image?.original || displayEpisode.image?.medium || 'https://via.placeholder.com/800x450'})` }}
          />
          
          {/* Uncropped Contained Image */}
          <div 
            className="absolute inset-0 w-full h-full bg-contain bg-center md:bg-right bg-no-repeat opacity-60 md:opacity-80"
            style={{ backgroundImage: `url(${displayEpisode.image?.original || displayEpisode.image?.medium || 'https://via.placeholder.com/800x450'})` }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/30 to-transparent"></div>
          
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-black/60 backdrop-blur text-zinc-300 hover:text-white p-3 rounded shadow transition-colors font-bold flex items-center border border-zinc-700 hover:bg-zinc-800"
          >
            ← Back
          </button>
        </div>
        
        <div className="px-8 md:px-12 -mt-24 relative z-10 text-white">
          <div className="uppercase tracking-wide text-xs text-yellow-500 font-bold mb-2 flex items-center justify-between">
            <span>S{displayEpisode.season?.toString().padStart(2, '0')} E{displayEpisode.number?.toString().padStart(2, '0')}</span>
            <span className="flex items-center text-zinc-300">
              <span className="text-yellow-500 mr-1 text-base">★</span> 
              {displayEpisode.rating.average || 'N/A'}
            </span>
          </div>
          <h1 className="block mt-1 text-5xl leading-tight font-extrabold text-white">
            {displayEpisode.name}
          </h1>
          
          <div 
            className="mt-6 text-zinc-300 text-lg leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: displayEpisode.summary || '<p>No description available.</p>' }} 
          />
          
          <div className="mt-8 border-t border-zinc-800 pt-6 flex flex-col sm:flex-row text-zinc-400 text-sm gap-8">
            <div className="mb-4 sm:mb-0">
              <span className="font-semibold text-zinc-500 block">Air Date</span>
              <span className="text-white">{displayEpisode.airdate}</span> at {displayEpisode.airtime}
            </div>
            <div>
              <span className="font-semibold text-zinc-500 block">Runtime</span>
              <span className="text-white">{displayEpisode.runtime}</span> minutes
            </div>
          </div>
        </div>
      </div>
    );
  } else if (status === 'failed') {
    content = (
      <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 m-8 max-w-4xl mx-auto" role="alert">
        <p className="font-bold">Error loading episode</p>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 bg-black text-white px-4 py-2 rounded font-bold hover:bg-zinc-800 border border-red-700 transition"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black w-full pb-16">
      <Header />
      <main className="mx-auto w-full">
        {content}
      </main>
    </div>
  );
};

export default EpisodeView;
