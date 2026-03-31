import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Typings for our TV Show data
export interface Episode {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string;
  airdate: string;
  airtime: string;
  airstamp: string;
  runtime: number;
  rating: { average: number | null };
  image: { medium: string; original: string } | null;
  summary: string;
  _links: { self: { href: string } };
}

export interface Show {
  id: number;
  url: string;
  name: string;
  type: string;
  language: string;
  genres: string[];
  status: string;
  runtime: number;
  premiered: string;
  ended: string;
  officialSite: string | null;
  schedule: { time: string; days: string[] };
  rating: { average: number | null };
  weight: number;
  network: {
    id: number;
    name: string;
    country: { name: string; code: string; timezone: string };
    officialSite: string | null;
  } | null;
  webChannel: any;
  externals: { tvrage: number; thetvdb: number; powerpuffgirls: string };
  image: { medium: string; original: string } | null;
  summary: string;
  updated: number;
  _links: { self: { href: string }; previousepisode: { href: string } };
  _embedded?: {
    episodes: Episode[];
  };
}

interface TVShowState {
  show: Show | null;
  episodes: Episode[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TVShowState = {
  show: null,
  episodes: [],
  status: 'idle',
  error: null,
};

export const fetchShowDetails = createAsyncThunk(
  'tvShow/fetchShowDetails',
  async (id: string) => {
    const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed=episodes`);
    if (!response.ok) {
      throw new Error('Failed to fetch show data');
    }
    const data = await response.json();
    return data;
  }
);

const tvShowSlice = createSlice({
  name: 'tvShow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShowDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShowDetails.fulfilled, (state, action: PayloadAction<Show>) => {
        state.status = 'succeeded';
        state.show = action.payload;
        if (action.payload._embedded && action.payload._embedded.episodes) {
          state.episodes = action.payload._embedded.episodes;
        }
      })
      .addCase(fetchShowDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default tvShowSlice.reducer;
