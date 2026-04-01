import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Show } from './tvShowSlice';

interface WatchlistState {
  items: Show[];
}

const loadWaitlist = (): Show[] => {
  const saved = localStorage.getItem('powerpuff_watchlist');
  return saved ? JSON.parse(saved) : [];
};

const initialState: WatchlistState = {
  items: loadWaitlist(),
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    toggleWatchlist: (state, action: PayloadAction<Show>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('powerpuff_watchlist', JSON.stringify(state.items));
    },
    removeFromWatchlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('powerpuff_watchlist', JSON.stringify(state.items));
    }
  },
});

export const { toggleWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
