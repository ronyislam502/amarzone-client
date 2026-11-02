import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { TCartItem, TCartState } from "@/types/order";

const initialState: TCartState = {
  user: null,
  products: [],
  foods: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  grandTotal: 0,
};

// Re-compute derived totals.
// NOTE: totalPrice / grandTotal are best-effort estimates on the client
// because authoritative prices live in the inventory (server-side).
// The cart only stores IDs + quantities; CartData fetches live prices.
const calculateTotals = (state: TCartState) => {
  if (!state.products) {
    state.products = [];
  }

  // selectedItems = number of distinct product lines in the cart
  state.selectedItems = state.products.length;

  // Best-effort price from enrichment fields (may be 0 before CartData enriches)
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

    /**
     * Add a product to the cart.
     * Requires ONLY: { _id, variantId, vendorId, quantity? }
     * All other fields (title, price, thumbnail …) are optional enrichment
     * and will be fetched from the API in CartData.tsx.
     */
    addToCart: (state, action: PayloadAction<TCartItem | any>) => {
      if (!state.products) {
        state.products = [];
      }
      const item = action.payload;

      // Resolve the canonical identifier — must have at minimum _id (product._id)
      const canonicalId = item._id || item.productId || item.id;

      // Use (productId + variantId) as the composite key so the same product
      // in different variants counts as separate cart entries.
      const compositeKey = `${canonicalId}__${item.variantId || ""}`;

      const existing = state.products.find(
        (p) => `${p._id || p.productId || p.id}__${p.variantId || ""}` === compositeKey
      );

      if (existing) {
        // Increment quantity if already in cart
        existing.quantity = (existing.quantity || 0) + (item.quantity || 1);
      } else {
        // Store lean cart item — only IDs + quantity are required
        state.products.push({
          _id: canonicalId,
          variantId: item.variantId || "",
          vendorId: item.vendorId || "",
          quantity: item.quantity || 1,
          // Pass any extra display fields the caller may have provided
          // (these are optional / best-effort; not relied on for order creation)
          ...(item.title !== undefined && { title: item.title }),
          ...(item.price !== undefined && { price: item.price }),
          ...(item.thumbnail !== undefined && { thumbnail: item.thumbnail }),
          ...(item.brand !== undefined && { brand: item.brand }),
          ...(item.vendor !== undefined && { vendor: item.vendor }),
          ...(item.seller !== undefined && { seller: item.seller }),
          ...(item.originalPrice !== undefined && { originalPrice: item.originalPrice }),
          ...(item.maxQuantity !== undefined && { maxQuantity: item.maxQuantity }),
          ...(item.inStock !== undefined && { inStock: item.inStock }),
          ...(item.attributes !== undefined && { attributes: item.attributes }),
          ...(item.category !== undefined && { category: item.category }),
        });
      }

      calculateTotals(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ type: "increment" | "decrement"; _id: string; variantId?: string }>
    ) => {
      if (!state.products) {
        state.products = [];
      }
      state.products = state.products.map((item) => {
        const matchById = (item._id || item.productId || item.id) === action.payload._id;
        // If variantId is provided, also match on it (allows same product, different variants)
        const matchByVariant = action.payload.variantId
          ? item.variantId === action.payload.variantId
          : true;

        if (matchById && matchByVariant) {
          const currentQty = item.quantity || 1;
          const newQty =
            action.payload.type === "increment"
              ? currentQty + 1
              : Math.max(currentQty - 1, 1);
          return { ...item, quantity: newQty };
        }
        return item;
      });

      calculateTotals(state);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ _id: string; variantId?: string }>
    ) => {
      if (!state.products) {
        state.products = [];
      }
      state.products = state.products.filter((item) => {
        const matchById = (item._id || item.productId || item.id) === action.payload._id;
        const matchByVariant = action.payload.variantId
          ? item.variantId === action.payload.variantId
          : true;
        return !(matchById && matchByVariant);
      });
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
// selectedItems = number of distinct product lines (badge count on navbar icon)
export const selectCartCount = (state: RootState) => state.cart?.selectedItems || 0;
export const selectCartTotals = (state: RootState) => ({
  subtotal: state.cart?.totalPrice || 0,
  tax: state.cart?.tax || 0,
  grandTotal: state.cart?.grandTotal || 0,
});
