import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { VersionMapping, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3008';

export const fetchMappings = createAsyncThunk(
  'mappings/fetchMappings',
  async () => {
    const response = await axios.get<ApiResponse<VersionMapping[]>>(`${API_BASE_URL}/api/mappings`);
    return response.data.data;
  }
);

export const createMapping = createAsyncThunk(
  'mappings/createMapping',
  async (mapping: Partial<VersionMapping>) => {
    const response = await axios.post<ApiResponse<VersionMapping>>(`${API_BASE_URL}/api/mappings`, mapping);
    return response.data.data;
  }
);

export const updateMapping = createAsyncThunk(
  'mappings/updateMapping',
  async (mapping: VersionMapping) => {
    const response = await axios.put<ApiResponse<VersionMapping>>(`${API_BASE_URL}/api/mappings/${mapping.id}`, mapping);
    return response.data.data;
  }
);

interface MappingsState {
  items: VersionMapping[];
  loading: boolean;
  error: string | null;
}

const initialState: MappingsState = {
  items: [],
  loading: false,
  error: null,
};

const mappingsSlice = createSlice({
  name: 'mappings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取映射列表失败';
      })
      .addCase(createMapping.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateMapping.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default mappingsSlice.reducer; 