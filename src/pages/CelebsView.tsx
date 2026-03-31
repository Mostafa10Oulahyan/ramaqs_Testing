import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCelebs } from '../store/slices/celebsSlice';
import PersonCard from '../components/PersonCard';
import Header from '../components/Header';
import Loader from '../components/Loader';

const ITEMS_PER_PAGE = 50;

const CelebsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, loading, error } = useAppSelector((state) => state.celebs);
  
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchCelebs(0)); 
    }
  }, [dispatch, items.length]);

  // Strip anyone without a valid profile picture
  const filteredItems = items.filter(person => !!person.image?.medium || !!person.image?.original);
  
  // Create pagination slice
  const maxPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

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
        <div className="mb-6 md:mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl md:text-4xl font-normal tracking-tight border-l-4 border-[#f5c518] pl-2 md:pl-3 ml-[-12px] md:ml-[-16px]">
              Celebs
            </h1>
            <h2 className="text-zinc-400 text-sm md:text-base mt-2">
              Explore popular actors, directors, writers and creators.
            </h2>
          </div>
          <div className="text-zinc-500 font-bold text-sm bg-zinc-900 border border-zinc-800 px-3 py-1 rounded">
            Found {filteredItems.length}
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-20 text-red-400 p-4 border border-red-900/30 rounded bg-red-900/10">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 pb-12">
              {currentItems.map((person) => (
                <div key={person.id} onClick={() => navigate(`/celebs/${person.id}`)}>
                  <PersonCard person={person} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {maxPages > 1 && (
              <div className="mt-8 mb-16 flex justify-between items-center bg-[#1A1A1A] p-4 rounded-xl border border-zinc-800">
                <button 
                  disabled={page === 0}
                  onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}
                  className={`px-6 py-2 rounded font-bold transition-all ${
                    page === 0 
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                      : 'bg-[#f5c518] text-black hover:bg-yellow-400'
                  }`}
                >
                  Previous
                </button>
                
                <span className="text-zinc-400 font-semibold flex items-center gap-2">
                  Page {page + 1} <span className="text-zinc-600">of {maxPages}</span>
                </span>
                
                <button 
                  disabled={page >= maxPages - 1}
                  onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}
                  className={`px-6 py-2 rounded font-bold transition-all ${
                    page >= maxPages - 1 
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                      : 'bg-[#f5c518] text-black hover:bg-yellow-400'
                  }`}
                >
                  Next Page
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CelebsView;
