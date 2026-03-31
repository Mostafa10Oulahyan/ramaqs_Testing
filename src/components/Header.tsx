import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { searchShows, setSearchQuery } from '../store/slices/showsListSlice';
import customLogo from '../assets/logo.png';

const Header: React.FC = () => {
  const [localSearch, setLocalSearch] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const watchlistCount = useAppSelector(state => state.watchlist.items.length);

  useEffect(() => {
    // Skip if just mounted empty
    const handler = setTimeout(() => {
      if (localSearch.trim()) {
        dispatch(setSearchQuery(localSearch));
        dispatch(searchShows(localSearch));
        
        // Only force redirect to Home if we are deep in a secondary page (like Celebs/About/Watchlist/Details)
        // If we are already on Home (/) or Movies (/movies), stay there and let the local view render results.
        if (location.pathname !== '/' && location.pathname !== '/movies') {
          navigate('/');
        }
      } else {
        dispatch(setSearchQuery(''));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, dispatch, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="bg-[#121212] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center w-full gap-4 lg:gap-8">

          {/* Logo & Links Left Side */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0 rounded-lg" >
            <Link
              to="/"
              onClick={() => { dispatch(setSearchQuery('')); setLocalSearch(''); }}
              className="bg-[#121212] rounded-[4px] px-1.5 py-0.5 flex items-center justify-center min-w-[64px] h-[32px] md:min-w-[70px] md:h-[35px] hover:brightness-110 transition-all shrink-0"
            >
              <img src={customLogo} alt="Logo" className="h-full w-full object-contain" />
            </Link>

            <nav className="hidden md:flex space-x-6 text-sm font-bold text-white">
              <span
                onClick={() => { dispatch(setSearchQuery('')); navigate('/movies'); }}
                className="cursor-pointer hover:bg-zinc-800 px-3 py-1.5 rounded-sm transition-colors"
              >
                Movies
              </span>
              <span
                onClick={() => { dispatch(setSearchQuery('')); navigate('/'); }}
                className="cursor-pointer hover:bg-zinc-800 px-3 py-1.5 rounded-sm transition-colors"
              >
                TV shows
              </span>
              <span
                onClick={() => navigate('/celebs')}
                className="cursor-pointer hover:bg-zinc-800 px-3 py-1.5 rounded-sm transition-colors"
              >
                Celebs
              </span>
            </nav>
          </div>

          {/* Search Bar - Flex Grow Middle (Hidden on Mobile) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-grow justify-center w-full min-w-0 max-w-2xl px-4">
            <div className="relative w-full text-black flex items-center bg-white rounded-[4px] overflow-hidden focus-within:ring-2 focus-within:ring-[#f5c518] focus-within:ring-inset h-[34px]">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-zinc-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search PowerpuffGirls"
                className="w-full bg-transparent font-medium pl-10 pr-4 focus:outline-none placeholder:text-zinc-500"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </form>

          {/* Right Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-sm font-bold shrink-0 ml-auto">
            {/* Mobile Only Search Trigger Box */}
            <button
              className="md:hidden w-8 h-8 rounded-[4px] bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-200 transition-colors"
              onClick={() => alert('Search interaction triggered!')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[18px] h-[18px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <Link to="/about" className="hover:bg-zinc-800 px-2 sm:px-3 py-1.5 rounded-sm cursor-pointer transition-colors text-white whitespace-nowrap">
              <span>About</span>
            </Link>

            <div className="hidden sm:block w-[1px] h-6 bg-zinc-700 mx-0 sm:mx-1"></div>

            <Link to="/watchlist" className="flex items-center gap-2 hover:bg-zinc-800 px-2 sm:px-3 py-1.5 rounded-sm cursor-pointer transition-colors text-white">
              <div className="relative flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[20px] h-[20px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                {watchlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#f5c518] text-black text-[10px] sm:text-[11px] font-extrabold px-[5px] py-[1px] rounded-[4px] leading-tight">
                    {watchlistCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline">Watchlist</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
