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
}

const initialState: ShowsListState = {
  shows: [],
  searchResults: [],
  status: 'idle',
  error: null,
  currentPage: 0,
  searchQuery: '',
  selectedGenre: 'All',
};

// Fetches a generic page of ~250 shows
export const fetchShowsPage = createAsyncThunk(
  'showsList/fetchShowsPage',
  async (page: number) => {
    const response = await fetch(`https://api.tvmaze.com/shows?page=${page}`);
    if (!response.ok) {
      if (response.status === 404) {
        return []; // No more pages
      }
      throw new Error('Failed to fetch shows');
    }
    const data = await response.json();
    return data as Show[];
  }
);

// Fetches a specific search string
export const searchShows = createAsyncThunk(
  'showsList/searchShows',
  async (query: string) => {
    if (!query.trim()) return [];
    
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search shows');
    }
    const data = await response.json();
    // TV Maze /search/shows returns an array of { score: number, show: Show }
    // We map it to just return the Show array to match our standard list.
    return data.map((item: any) => item.show) as Show[];
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

export const { setPage, setSearchQuery, setSelectedGenre } = showsListSlice.actions;

export default showsListSlice.reducer;
