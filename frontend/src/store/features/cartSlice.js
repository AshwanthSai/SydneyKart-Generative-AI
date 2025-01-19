
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  shippingData: localStorage.getItem("shippingData")
    ? JSON.parse(localStorage.getItem("shippingData"))
    : {},
};

export const cartSlice = createSlice({
  initialState,
  name: "cartSlice",
  reducers: {
    setCartItem: (state, action) => {
      const item = action.payload;
      
      const isItemExist = state.cartItems.find(
        // If product within cart. Swap the whole item with new product quantity.
        (i) => i.product === item.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state?.cartItems?.filter(
        // Remember item.product is the product ID.
        // action.payload is the product ID we pass from Cart Component.
        (i) => i.product !== action.payload
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    saveShippingData: (state, action) => {
      console.log(action.payload)
      state.shippingData = action.payload
      localStorage.setItem("shippingData", JSON.stringify(state.shippingData));
    },
  },
});

export default cartSlice.reducer;

export const { setCartItem, removeCartItem, saveShippingData} = cartSlice.actions;
