import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Person {
  id: number;
  url: string;
  name: string;
  country?: {
    name: string;
    code: string;
    timezone: string;
  };
  birthday: string | null;
  deathday: string | null;
  gender: string | null;
  image?: {
    medium: string;
    original: string;
  };
}

interface CelebsState {
  items: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: CelebsState = {
  items: [],
  loading: false,
  error: null,
};

// TVMaze has a massive paginated database of people at /people?page=X
export const fetchCelebs = createAsyncThunk(
  'celebs/fetchCelebs',
  async (page: number = 0) => {
    const response = await fetch(`https://api.tvmaze.com/people?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch celebs');
    }
    const data = await response.json();
    return data as Person[];
  }
);

// We can also support search if needed
export const searchCelebs = createAsyncThunk(
  'celebs/searchCelebs',
  async (query: string) => {
    const response = await fetch(`https://api.tvmaze.com/search/people?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search celebs');
    }
    const data = await response.json();
    // Search returns { score: number, person: Person }
    return data.map((item: any) => item.person) as Person[];
  }
);

const celebsSlice = createSlice({
  name: 'celebs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCelebs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCelebs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCelebs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error occurred';
      })
      .addCase(searchCelebs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCelebs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchCelebs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error occurred';
      });
  },
});

export default celebsSlice.reducer;
