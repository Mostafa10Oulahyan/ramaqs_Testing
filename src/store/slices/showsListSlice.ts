import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Show } from './tvShowSlice';

interface ShowsListState {
  shows: Show[];
  searchResults: Show[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  searchQuery: string;
  selectedGenre: string;
  selectedType: string;
}

const initialState: ShowsListState = {
  shows: [],
  searchResults: [],
  status: 'idle',
  error: null,
  currentPage: 0,
  searchQuery: '',
  selectedGenre: 'All',
  selectedType: 'All',
};

// Fetches mixed content: TV shows from TVMaze and Movies from TMDB
export const fetchShowsPage = createAsyncThunk(
  'showsList/fetchShowsPage',
  async (page: number) => {
    try {
      // 1. Fetch TV Shows from TVMaze (returns ~250 per page)
      const tvMazeRes = await fetch(`https://api.tvmaze.com/shows?page=${page}`);
      let tvShows: Show[] = [];
      if (tvMazeRes.ok) {
        const tvData = await tvMazeRes.json();
        tvShows = (tvData as Show[]).filter(show => show.rating && show.rating.average && show.rating.average > 0);
      }

      // 2. Fetch Movies from TMDB (returns 20 per page)
      // To get a comparable amount of movies, we fetch a few pages of TMDB or just use the current logic
      // Mapping the TMDB page to our requested 'page' (batch)
      const tmdbPage = page + 1; 
      const tmdbRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=${tmdbPage}`);
      let tmdbMovies: Show[] = [];
      if (tmdbRes.ok) {
        const tmdbData = await tmdbRes.json();
        if (tmdbData.results) {
          tmdbMovies = tmdbData.results
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
            }));
        }
      }

      // Interleave results to provide a mixed feel
      const maxLen = Math.max(tvShows.length, tmdbMovies.length);
      const combined: Show[] = [];
      for (let i = 0; i < maxLen; i++) {
        if (i < tvShows.length) combined.push(tvShows[i]);
        if (i < tmdbMovies.length) combined.push(tmdbMovies[i]);
      }

      return combined;
    } catch (err) {
      throw new Error('Failed to fetch mixed shows');
    }
  }
);

// Fetches a specific search string
export const searchShows = createAsyncThunk(
  'showsList/searchShows',
  async (query: string) => {
    if (!query.trim()) return [];
    
    try {
      // Fetch from TVMaze
      const tvMazeRes = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      const tvMazeData = await tvMazeRes.json();
      const tvShows = tvMazeData
        .map((item: any) => item.show)
        .filter((show: Show) => show.rating && show.rating.average && show.rating.average > 0) as Show[];

      // Fetch from TMDB
      let tmdbMovies: Show[] = [];
      try {
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=${encodeURIComponent(query)}`);
        const tmdbData = await tmdbRes.json();
        if (tmdbData.results) {
          tmdbMovies = tmdbData.results
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
            }));
        }
      } catch (err) {
        console.error('Failed to fetch from TMDB:', err);
      }

      // Combine results
      return [...tvShows, ...tmdbMovies];
    } catch (err) {
      throw new Error('Failed to search shows');
    }
  }
);

const showsListSlice = createSlice({
  name: 'showsList',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.searchResults = []; // Clear search when query is empty
      }
    },
    setSelectedGenre: (state, action: PayloadAction<string>) => {
      state.selectedGenre = action.payload;
      state.currentPage = 0;
    },
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;
      state.currentPage = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Page Cases
      .addCase(fetchShowsPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShowsPage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shows = action.payload;
      })
      .addCase(fetchShowsPage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error loading page';
      })
      // Search Cases
      .addCase(searchShows.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchShows.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload;
      })
      .addCase(searchShows.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error searching';
      });
  },
});

export const { setPage, setSearchQuery, setSelectedGenre, setSelectedType } = showsListSlice.actions;

export default showsListSlice.reducer;
