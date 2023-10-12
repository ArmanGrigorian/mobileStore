import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice.ts";
import adminReducer from "./slices/adminSlice.ts";


export const store = configureStore({
	reducer: {
		products: productsReducer,
		admin: adminReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>