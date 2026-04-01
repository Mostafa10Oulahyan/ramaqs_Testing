import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchShowsPage, setPage, setSelectedGenre } from '../store/slices/showsListSlice';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import ShowCard from '../components/ShowCard';
import Loader from '../components/Loader';

const TvShowsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { shows, searchResults, status, error, currentPage, searchQuery, selectedGenre } = useAppSelector((state) => state.showsList);

  useEffect(() => {
    // Only fetch pages if we aren't searching
    if (!searchQuery) {
      dispatch(fetchShowsPage(currentPage));
    }
  }, [currentPage, searchQuery, dispatch]);

  const rawShows = searchQuery ? searchResults : shows;
  // Strictly filter out any Movies so this page displays only TV Shows
  const activeShows = rawShows.filter(show => !show.isMovie);

  // Derive genres
  const allGenresStr = activeShows.map(s => s.genres || []).flat();
  const uniqueGenres = ['All', ...Array.from(new Set(allGenresStr))].slice(0, 10);

  const filteredShows = selectedGenre === 'All' 
    ? activeShows 
    : activeShows.filter(show => show.genres?.includes(selectedGenre));

  return (
    <div className="flex-grow flex flex-col min-h-screen bg-black text-white">
      <Header />
      
      <main className="flex-grow px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 pt-16 md:pt-20 max-w-7xl mx-auto w-full">
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
            {searchQuery ? `Search TV Shows: "${searchQuery}"` : 'TV Shows'}
          </h1>
          {!searchQuery && (
            <h2 className="text-zinc-400 text-sm md:text-base mt-2">
              Explore your favorite television series and episodes.
            </h2>
          )}
        </div>

        {status === 'loading' ? (
          <div className="flex justify-center items-center h-[50vh] bg-black">
            <Loader />
          </div>
        ) : status === 'failed' ? (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 m-8 max-w-4xl mx-auto">
            <p className="font-bold">Error loading shows</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-black py-4">
            {/* Genre Filters */}
            <div className="flex gap-4 text-sm font-semibold text-zinc-400 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {uniqueGenres.map(genre => (
                <button 
                  key={genre}
                  onClick={() => dispatch(setSelectedGenre(genre))}
                  className={`whitespace-nowrap pb-1 border-b-2 transition-colors ${
                    selectedGenre === genre ? 'text-white border-white' : 'border-transparent hover:text-zinc-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Shows Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
              {filteredShows.length > 0 ? (
                filteredShows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))
              ) : (
                <div className="col-span-full text-zinc-500 py-10">
                  No TV shows found for your query.
                </div>
              )}
            </div>

            {/* Pagination */}
            {!searchQuery && (
              <div className="mt-16 flex justify-between items-center bg-[#1A1A1A] p-4 rounded-xl border border-zinc-800">
                <button 
                  disabled={currentPage === 0}
                  onClick={() => { dispatch(setPage(currentPage - 1)); window.scrollTo(0,0); }}
                  className={`px-6 py-2 rounded font-bold transition-all ${
                    currentPage === 0 
                      ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                      : 'bg-[#f5c518] text-black hover:bg-yellow-400'
                  }`}
                >
                  Previous
                </button>
                
                <span className="text-zinc-400 font-semibold">Page {currentPage + 1}</span>
                
                <button 
                  onClick={() => { dispatch(setPage(currentPage + 1)); window.scrollTo(0,0); }}
                  className="px-6 py-2 bg-[#f5c518] text-black rounded font-bold hover:bg-yellow-400 transition-all"
                >
                  Next Page
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TvShowsView;
