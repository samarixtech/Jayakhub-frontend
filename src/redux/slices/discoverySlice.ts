import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedRestaurantMeta {
  id: string;
  deliveryFee: number;
  distance?: number;
}

interface DiscoveryState {
  selectedRestaurantMeta: SelectedRestaurantMeta | null;
}

const initialState: DiscoveryState = {
  selectedRestaurantMeta: null,
};

const discoverySlice = createSlice({
  name: "discovery",
  initialState,
  reducers: {
    setSelectedRestaurantMeta(state, action: PayloadAction<SelectedRestaurantMeta>) {
      state.selectedRestaurantMeta = action.payload;
    },
    clearSelectedRestaurantMeta(state) {
      state.selectedRestaurantMeta = null;
    },
  },
});

export const { setSelectedRestaurantMeta, clearSelectedRestaurantMeta } = discoverySlice.actions;
export default discoverySlice.reducer;
