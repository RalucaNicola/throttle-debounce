import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loadingReducer from './services/app-loading/loadingSlice';
import recordingInfoReducer from './services/recordingInfo';

const rootReducer = combineReducers({
  loading: loadingReducer,
  recordingInfo: recordingInfoReducer
});

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
