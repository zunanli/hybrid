import { configureStore } from '@reduxjs/toolkit';
import packagesReducer from './packagesSlice';
import versionsReducer from './versionsSlice';
import mappingsReducer from './mappingsSlice';

export const store = configureStore({
  reducer: {
    packages: packagesReducer,
    versions: versionsReducer,
    mappings: mappingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 