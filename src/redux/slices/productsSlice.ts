import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productsAPI } from "../../api/api";

const initialState = {
	storeItems: [],
	cartItems: [],
	isLoading: true,
};

export const storeItemsFetch = createAsyncThunk("products/storeItemsFetch", async () => {
	try {
		const response = await productsAPI.getProducts();
		return response.data;
	} catch (err) {
		const data = [{ brand: err.message, model: err.request.status }];
		return data;
	}
});

const productsSlice = createSlice({
	name: "products",

	initialState: initialState,

	reducers: {
		addToCart: (state, action) => {
			const currentItem = state.cartItems.find((item) => {
				return item.id === action.payload.id;
			});

			if (currentItem) {
				currentItem.count += 1;
			} else {
				state.cartItems = [...state.cartItems, { ...action.payload, count: 1 }];
			}
		},

		removeFromCart: (state, action) => {
			const currentItem = state.cartItems.find((item) => {
				return item.id === action.payload.id;
			});

			if (currentItem.count > 0) {
				currentItem.count -= 1;
			} else {
				state.cartItems = state.cartItems.filter((item) => {
					return item.id !== action.payload.id;
				});
			}
		},

		deleteFromCart: (state, action) => {
			state.cartItems = state.cartItems.filter((item) => {
				return item.id !== action.payload.id;
			});
		},

		addToStore: (state, action) => {
			state.storeItems = [...state.storeItems, action.payload];
		},

		deleteFromStore: (state, action) => {
			state.storeItems = state.storeItems.filter((item) => {
				return item.id !== action.payload.id;
			});
		},
	},

	extraReducers: (builder) => {
		builder.addCase(storeItemsFetch.pending, (state, action) => {
			state.isLoading = true;
		}),
			builder.addCase(storeItemsFetch.fulfilled, (state, action) => {
				state.isLoading = false;
				state.storeItems = action.payload;
			}),
			builder.addCase(storeItemsFetch.rejected, (state, action) => {
				state.isLoading = false;
				state.storeItems = action.payload;
			});
	},
});

export const { addToCart, removeFromCart, deleteFromCart, addToStore, deleteFromStore } =
	productsSlice.actions;

export default productsSlice.reducer;