import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchShowDetails } from '../store/slices/tvShowSlice';
import Header from '../components/Header';
import ShowDetails from '../components/ShowDetails';
import EpisodeList from '../components/EpisodeList';
import CastList from '../components/CastList';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';

const ShowView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { show, episodes, cast, status, error } = useAppSelector((state) => state.tvShow);

  useEffect(() => {
    if (id) {
      dispatch(fetchShowDetails(id));
      window.scrollTo(0, 0);
    }
  }, [id, dispatch]);

  let content;

  if (status === 'loading') {
    content = (
      <div className="flex justify-center flex-col items-center h-[60vh] bg-black">
        <Loader />
      </div>
    );
  } else if (status === 'succeeded' && show) {
    content = (
      <div className="w-full bg-black">
        <ShowDetails show={show} />
        {cast && cast.length > 0 && <CastList cast={cast} source="tvmaze" />}
        <EpisodeList episodes={episodes} />
      </div>
    );
  } else if (status === 'failed') {
    content = (
      <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 m-8 max-w-4xl mx-auto" role="alert">
        <p className="font-bold">Error loading show details</p>
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

export default ShowView;
