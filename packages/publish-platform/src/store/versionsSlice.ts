import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppVersion, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3008';

export const fetchVersions = createAsyncThunk(
  'versions/fetchVersions',
  async () => {
    const response = await axios.get<ApiResponse<AppVersion[]>>(`${API_BASE_URL}/api/versions`);
    return response.data.data;
  }
);

interface VersionsState {
  items: AppVersion[];
  loading: boolean;
  error: string | null;
}

const initialState: VersionsState = {
  items: [],
  loading: false,
  error: null,
};

const versionsSlice = createSlice({
  name: 'versions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVersions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVersions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVersions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取版本列表失败';
      });
  },
});

export default versionsSlice.reducer; 