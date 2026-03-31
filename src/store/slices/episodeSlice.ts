import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Episode } from './tvShowSlice';

interface EpisodeState {
  episode: Episode | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EpisodeState = {
  episode: null,
  status: 'idle',
  error: null,
};

export const fetchEpisodeById = createAsyncThunk(
  'episode/fetchEpisodeById',
  async (episodeId: string) => {
    const response = await fetch(`https://api.tvmaze.com/episodes/${episodeId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch episode data');
    }
    const data = await response.json();
    return data;
  }
);

const episodeSlice = createSlice({
  name: 'episode',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodeById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEpisodeById.fulfilled, (state, action: PayloadAction<Episode>) => {
        state.status = 'succeeded';
        state.episode = action.payload;
      })
      .addCase(fetchEpisodeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default episodeSlice.reducer;
