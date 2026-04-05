import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchShowsPage, setPage, setSelectedGenre, setSelectedType } from '../store/slices/showsListSlice';
import Header from '../components/Header';
import ShowCard from '../components/ShowCard';
import Loader from '../components/Loader';
import HeroCarousel from '../components/HeroCarousel';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { shows, searchResults, status, error, currentPage, searchQuery, selectedGenre, selectedType } = useAppSelector((state) => state.showsList);

  useEffect(() => {
    // Determine whether to fetch page based on search logic
    if (!searchQuery) {
      // Calculate which API page we need based on our 50-item view pages
      // Since each API fetch returns ~250 shows, and we show 50 per page:
      const apiPage = Math.floor(currentPage / 5);
      dispatch(fetchShowsPage(apiPage));
    }
  }, [currentPage, searchQuery, dispatch]);

  const activeShows = searchQuery ? searchResults : shows;

  // Filter by Type first
  const typeFilteredShows = selectedType === 'All'
    ? activeShows
    : selectedType === 'Movie'
      ? activeShows.filter(s => s.isMovie)
      : activeShows.filter(s => !s.isMovie);

  // Derive genres for the filter bar (based on type filtered shows)
  const allGenresStr = typeFilteredShows.map(s => s.genres || []).flat();
  const uniqueGenres = ['All', ...Array.from(new Set(allGenresStr))].slice(0, 10); // Limit to top genres

  const filteredShows = selectedGenre === 'All' 
    ? typeFilteredShows 
    : typeFilteredShows.filter(show => show.genres?.includes(selectedGenre));

  // The grid display - Limit to 50 items per logical page
  const itemsPerPage = 50;
  // If we are searching, we show all search results as before (usually ~20-50 anyway)
  // If we are browsing, we slice the current buffer.
  const gridShows = searchQuery 
    ? filteredShows 
    : filteredShows.slice((currentPage % 5) * itemsPerPage, ((currentPage % 5) + 1) * itemsPerPage);

  return (
    <div className="min-h-screen bg-black w-full text-white">
      <Header isTransparent={!searchQuery} />
      
      {/* Hero Banner only when not searching */}
      {!searchQuery && (
        <HeroCarousel />
      )}

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
        <div className="bg-black py-12 px-4 sm:px-12 lg:px-24">
          <h2 className="text-3xl font-extrabold text-[#f5c518] flex items-center mb-1">
            {searchQuery ? `Search Results: "${searchQuery}"` : 'What to watch'}
          </h2>
          {!searchQuery && (
            <div className="flex items-center text-white mb-6 border-l-4 border-[#f5c518] pl-3">
              <span className="font-bold text-lg">Top picks just for you</span>
            </div>
          )}

          {/* Type and Genre Filters */}
          <div className="flex flex-col gap-6 mb-8">
            {/* Type Filter */}
            <div className="flex gap-6 text-base font-bold">
              {['All', 'Movie', 'TV Show'].map(type => (
                <button 
                  key={type}
                  onClick={() => {
                    dispatch(setSelectedType(type));
                    dispatch(setSelectedGenre('All')); // Reset genre when type changes
                  }}
                  className={`transition-all pb-2 px-1 border-b-2 ${
                    selectedType === type ? 'text-[#f5c518] border-[#f5c518]' : 'text-zinc-500 border-transparent hover:text-white'
                  }`}
                >
                  {type === 'All' ? 'All Content' : type === 'Movie' ? 'Movies' : 'TV Shows'}
                </button>
              ))}
            </div>

            {/* Genre Filters */}
            <div className="flex gap-4 text-sm font-semibold text-zinc-400 overflow-x-auto pb-2 scrollbar-hide border-t border-zinc-900 pt-4">
              {uniqueGenres.map(genre => (
                <button 
                  key={genre}
                  onClick={() => dispatch(setSelectedGenre(genre))}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full border transition-all ${
                    selectedGenre === genre 
                      ? 'bg-white text-black border-white' 
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Shows Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
            {gridShows.length > 0 ? (
              gridShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))
            ) : (
              <div className="col-span-full text-zinc-500 py-10">
                No shows found.
              </div>
            )}
          </div>

          {/* Pagination (Hidden during search since TV Maze search API is unpaginated single batch) */}
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
    </div>
  );
};

export default Home;
