import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { TCartItem, TCartState } from "@/types/order";

const initialState: TCartState = {
  user: null,
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  grandTotal: 0,
};

const calculateTotals = (state: TCartState) => {
  if (!state.products) {
    state.products = [];
  }

  // Count distinct items in cart
  state.selectedItems = state.products.length;

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

      const variant =
        (typeof item.variant === "string" ? item.variant : item.variant?._id) ||
        item.variantId ||
        item.variantid ||
        item._id ||
        "";

      const productId = item.productId || item._id || item.id || "";
      const canonicalId = item._id || variant || productId;

      const vendor =
        (typeof item.vendor === "string" ? item.vendor : item.vendor?._id) ||
        item.vendorId ||
        item.vendorName ||
        item.seller?.vendor?.name ||
        item.sellerName ||
        "";

      const title = item.title || item.name || "";
      const image = item.image || item.thumbnail || item.images?.[0] || "";
      const price = item.price !== undefined ? Number(item.price) : 0;

      const compositeKey = `${variant || canonicalId}__${vendor}`;

      const existing = state.products.find((p) => {
        const pVariant =
          (typeof p.variant === "string" ? p.variant : p.variant?._id) ||
          p.variantId ||
          p._id ||
          "";
        const pVendor =
          (typeof p.vendor === "string" ? p.vendor : p.vendor?._id) ||
          p.vendorId ||
          "";
        return `${pVariant}__${pVendor}` === compositeKey;
      });

      if (existing) {
        // Increment quantity if already in cart
        existing.quantity = (existing.quantity || 0) + (item.quantity || 1);

        // Update title, image, thumbnail, and price if previously missing
        if (!existing.title && title) existing.title = title;
        if (!existing.image && image) existing.image = image;
        if (!existing.thumbnail && image) existing.thumbnail = image;
        if ((!existing.price || existing.price === 0) && price > 0) existing.price = price;
        if (!existing.vendor && vendor) existing.vendor = vendor;
      } else {
        state.products.push({
          ...item,
          _id: canonicalId,
          productId,
          vendor,
          quantity: item.quantity || 1,
          title,
          image,
          thumbnail: item.thumbnail || image,
          price,
        });
      }

      calculateTotals(state);
    },

    updateCartItemDetails: (
      state,
      action: PayloadAction<{
        _id: string;
        variant?: string;
        variantId?: string;
        title?: string;
        thumbnail?: string;
        image?: string;
        price?: number;
        vendor?: any;
        [key: string]: any;
      }>
    ) => {
      if (!state.products) return;
      const { _id, variant, variantId, ...details } = action.payload;
      const targetVariant = variant || variantId;

      state.products = state.products.map((item) => {
        const matchId =
          (item._id || item.productId || item.id) === _id ||
          item.variant === _id ||
          item.productId === _id;
        const matchVariant = targetVariant ? item.variant === targetVariant : true;

        if (matchId && matchVariant) {
          const title = details.title || item.title || "";
          const thumbnail = details.thumbnail || details.image || item.thumbnail || item.image || "";
          const image = details.image || details.thumbnail || item.image || item.thumbnail || "";
          const price = details.price !== undefined ? Number(details.price) : item.price;
          return {
            ...item,
            ...details,
            title,
            thumbnail,
            image,
            price,
          };
        }
        return item;
      });

      calculateTotals(state);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ type: "increment" | "decrement"; _id: string; variantId?: string; variant?: string }>
    ) => {
      if (!state.products) {
        state.products = [];
      }
      const targetVariant = action.payload.variantId || action.payload.variant;
      state.products = state.products.map((item) => {
        const matchById =
          (item._id || item.productId || item.id) === action.payload._id ||
          item.variant === action.payload._id;
        const matchByVariant = targetVariant
          ? item.variant === targetVariant
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
      action: PayloadAction<{ _id: string; variant?: string; variantId?: string }>
    ) => {
      if (!state.products) {
        state.products = [];
      }
      const targetVariant = action.payload.variant || action.payload.variantId;
      state.products = state.products.filter((item) => {
        const matchById =
          (item._id || item.productId || item.id) === action.payload._id ||
          item.variant === action.payload._id;
        const matchByVariant = targetVariant
          ? item.variant === targetVariant
          : true;
        return !(matchById && matchByVariant);
      });
      calculateTotals(state);
    },

    clearCart: (state) => {
      state.products = [];
      calculateTotals(state);
    },
  },
});

export const {
  setCartUser,
  addToCart,
  updateCartItemDetails,
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
