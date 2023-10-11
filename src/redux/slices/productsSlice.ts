import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { productsAPI } from "../../api/api";

const initialState = {
	categories: ["All", "Apple", "Samsung", "Xiaomi", "Nokia"],
	params: {
		param1: "1",
		param2: "sortBy",
		param3: "release",
		param4: "desc",
	},
	allItems: [],
	storeItems: [],
	cartItems: [],
	isLoading: true,
};

export const allItemsFetch = createAsyncThunk("products/allItemsFetch", async () => {
	try {
		const response = await productsAPI.getAllProducts();
		return response.data;
	} catch (err) {
		const data = [{ brand: err.message, model: err.request.status }];
		return data;
	}
});

export const pageItemsFetch = createAsyncThunk("products/pageItemsFetch", async () => {
	try {
		const response = await productsAPI.getPageProducts();
		return response.data;
	} catch (err) {
		const data = [{ brand: err.message, model: err.request.status }];
		return data;
	}
});

export const separateFetch = createAsyncThunk("products/separateFetch", async (params) => {
	try {
		const response = await productsAPI.getProductsBy(params);
		return response.data;
	} catch (err) {
		const data = [{ brand: err.message, model: err.request.status }];
		return data;
	}
});

export const deleteFetch = createAsyncThunk("products/deleteFetch", async (id) => {
	try {
		const response = await productsAPI.deleteItem(id);
		return response.data;
	} catch (err) {
		console.log(err)
	}
});

const productsSlice = createSlice({
	name: "products",

	initialState: initialState,

	reducers: {
		setParams: (state, action) => {
			state.params = action.payload;
		},

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
	},

	extraReducers: (builder) => {
		// ALL
		builder.addCase(allItemsFetch.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(allItemsFetch.fulfilled, (state, action) => {
			state.isLoading = false;
			state.allItems = action.payload;
		});
		builder.addCase(allItemsFetch.rejected, (state, action) => {
			state.isLoading = false;
			state.allItems = action.payload;
		});
		// PAGE
		builder.addCase(pageItemsFetch.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(pageItemsFetch.fulfilled, (state, action) => {
			state.isLoading = false;
			state.storeItems = action.payload;
		});
		builder.addCase(pageItemsFetch.rejected, (state, action) => {
			state.isLoading = false;
			state.storeItems = action.payload;
		});
		// SORT
		builder.addCase(separateFetch.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(separateFetch.fulfilled, (state, action) => {
			state.isLoading = false;
			state.storeItems = action.payload;
		});
		builder.addCase(separateFetch.rejected, (state, action) => {
			state.isLoading = false;
			state.storeItems = action.payload;
		});
	},
});

export const { setParams, addToCart, removeFromCart, deleteFromCart } = productsSlice.actions;

export default productsSlice.reducer;
