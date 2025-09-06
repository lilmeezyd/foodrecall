// app/store.js
import { configureStore } from '@reduxjs/toolkit'
import { recallApi } from './slices/recallApi'

export const store = configureStore({
  reducer: {
    [recallApi.reducerPath]: recallApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recallApi.middleware)
})
