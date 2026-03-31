import { configureStore } from '@reduxjs/toolkit';
import tvShowReducer from './slices/tvShowSlice';
import episodeReducer from './slices/episodeSlice';
import showsListReducer from './slices/showsListSlice';
import watchlistReducer from './slices/watchlistSlice';
import celebsReducer from './slices/celebsSlice';

export const store = configureStore({
  reducer: {
    tvShow: tvShowReducer,
    episode: episodeReducer,
    showsList: showsListReducer,
    watchlist: watchlistReducer,
    celebs: celebsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
