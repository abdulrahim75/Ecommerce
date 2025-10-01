import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken"); // Fixed the missing quotes
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/checkout`,
        checkoutData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dispatching createCheckout with data:", checkoutData);
      return response.data;
    } catch (error) {
      // Defensive error handling to ensure we always return a consistent shape
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred during checkout.";
      return rejectWithValue({ message });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error?.message ||
          "Something went wrong during checkout.";
      });
  },
});

export default checkoutSlice.reducer;
