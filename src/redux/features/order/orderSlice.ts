import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TCartState, TCartItem } from "@/types/order";
import { RootState } from "../../store";

const initialState: TCartState = {
  user: null,
  products: [],
  foods: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  grandTotal: 0,
};

// Helper to calculate totals safely
const calculateTotals = (state: TCartState) => {
  if (!state.products) {
    state.products = [];
  }

  state.selectedItems = state.products.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  state.totalPrice = Number(
    state.products
      .reduce(
        (total, item) => total + (item.quantity || 0) * (item.price || 0),
        0
      )
      .toFixed(2)
  );

  state.tax = state.products.length > 0 ? 0.88 : 0;
  state.grandTotal = Number((state.totalPrice + state.tax).toFixed(2));
  state.foods = state.products;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    addToCart: (state, action: PayloadAction<TCartItem | any>) => {
      if (!state.products) {
        state.products = [];
      }
      const item = action.payload;
      const itemId = item._id || item.variantId || item.id;
      const existing = state.products.find(
        (p) => (p._id || p.variantId || p.id) === itemId
      );

      if (existing) {
        existing.quantity = (existing.quantity || 0) + (item.quantity || 1);
      } else {
        state.products.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }

      calculateTotals(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ type: "increment" | "decrement"; _id: string }>
    ) => {
      if (!state.products) {
        state.products = [];
      }
      state.products = state.products.map((item) => {
        const itemId = item._id || item.variantId || item.id;
        if (itemId === action.payload._id) {
          const currentQty = item.quantity || 1;
          const newQty =
            action.payload.type === "increment"
              ? currentQty + 1
              : Math.max(currentQty - 1, 1);
          return {
            ...item,
            quantity: newQty,
          };
        }
        return item;
      });

      calculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<{ _id: string }>) => {
      if (!state.products) {
        state.products = [];
      }
      state.products = state.products.filter(
        (item) => (item._id || item.variantId || item.id) !== action.payload._id
      );
      calculateTotals(state);
    },

    clearCart: (state) => {
      state.products = [];
      state.foods = [];
      calculateTotals(state);
    },
  },
});

export const {
  setCartUser,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart;
export const selectCartProducts = (state: RootState) => state.cart?.products || [];
export const selectCartCount = (state: RootState) => state.cart?.selectedItems || 0;
export const selectCartTotals = (state: RootState) => ({
  subtotal: state.cart?.totalPrice || 0,
  tax: state.cart?.tax || 0,
  grandTotal: state.cart?.grandTotal || 0,
});
