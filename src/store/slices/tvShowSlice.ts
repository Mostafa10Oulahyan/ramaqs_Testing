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

export interface CastMember {
  person: {
    id: number;
    name: string;
    image: { medium: string; original: string } | null;
  };
  character: {
    id: number;
    name: string;
    image: { medium: string; original: string } | null;
  };
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
  isMovie?: boolean; // Used to identify TMDB movies
  _embedded?: {
    episodes?: Episode[];
    cast?: CastMember[];
  };
}

interface TVShowState {
  show: Show | null;
  episodes: Episode[];
  cast: CastMember[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TVShowState = {
  show: null,
  episodes: [],
  cast: [],
  status: 'idle',
  error: null,
};

export const fetchShowDetails = createAsyncThunk(
  'tvShow/fetchShowDetails',
  async (id: string) => {
    // Note: If we use this thunk for TMDB movies in the future we'll need branching logic here, 
    // but right now TMDB logic will likely be locally handled in MovieView or branched.
    const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed[]=episodes&embed[]=cast`);
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
        if (action.payload._embedded) {
          if (action.payload._embedded.episodes) {
            state.episodes = action.payload._embedded.episodes;
          }
          if (action.payload._embedded.cast) {
            state.cast = action.payload._embedded.cast;
          } else {
            state.cast = [];
          }
        }
      })
      .addCase(fetchShowDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default tvShowSlice.reducer;
