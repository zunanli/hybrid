import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PackageMeta, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3008';

// 异步actions
export const fetchPackages = createAsyncThunk(
  'packages/fetchPackages',
  async () => {
    const response = await axios.get<ApiResponse<PackageMeta[]>>(`${API_BASE_URL}/api/packages`);
    return response.data.data;
  }
);

export const uploadPackage = createAsyncThunk(
  'packages/uploadPackage',
  async (formData: FormData) => {
    const response = await axios.post<ApiResponse<PackageMeta>>(
      `${API_BASE_URL}/api/packages/upload`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  }
);

interface PackagesState {
  items: PackageMeta[];
  loading: boolean;
  error: string | null;
}

const initialState: PackagesState = {
  items: [],
  loading: false,
  error: null,
};

const packagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取离线包列表失败';
      })
      .addCase(uploadPackage.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default packagesSlice.reducer; 