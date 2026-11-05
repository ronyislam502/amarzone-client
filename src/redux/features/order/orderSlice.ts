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

      const canonicalId = item._id || item.productId || item.id;
      const variantId = item.variantId || item.variant?._id || "";
      const compositeKey = `${canonicalId}__${variantId}`;

      const existing = state.products.find(
        (p) => `${p._id || p.productId || p.id}__${p.variantId || ""}` === compositeKey
      );

      const title = item.title || item.name || "";
      const image = item.image || item.thumbnail || item.images?.[0] || "";
      const thumbnail = item.thumbnail || item.image || item.images?.[0] || "";
      const price = item.price !== undefined ? Number(item.price) : 0;
      const originalPrice = item.originalPrice !== undefined ? Number(item.originalPrice) : price;
      const vendorId = item.vendorId || item.vendor?._id || item.seller?.vendor?._id || item.seller?.vendor || "";
      const vendor = item.vendor || item.vendorName || item.seller?.vendor?.name || item.sellerName || "";

      if (existing) {
        // Increment quantity if already in cart
        existing.quantity = (existing.quantity || 0) + (item.quantity || 1);

        // Update title, image, thumbnail, and price if previously missing
        if (!existing.title && title) existing.title = title;
        if (!existing.thumbnail && thumbnail) existing.thumbnail = thumbnail;
        if (!existing.image && image) existing.image = image;
        if ((!existing.price || existing.price === 0) && price > 0) existing.price = price;
        if (!existing.originalPrice && originalPrice > 0) existing.originalPrice = originalPrice;
        if (!existing.vendor && vendor) existing.vendor = vendor;
        if (!existing.vendorId && vendorId) existing.vendorId = vendorId;
      } else {
        state.products.push({
          ...item,
          _id: canonicalId,
          productId: item.productId || canonicalId,
          variantId,
          vendorId,
          quantity: item.quantity || 1,
          title,
          thumbnail,
          image,
          price,
          originalPrice,
          vendor,
          brand: item.brand || "",
          seller: item.seller || "",
          inStock: item.inStock !== false,
          attributes: item.attributes || item.variant?.attributes || [],
          category: item.category || "",
        });

      }

      calculateTotals(state);
    },

    updateCartItemDetails: (
      state,
      action: PayloadAction<{
        _id: string;
        variantId?: string;
        title?: string;
        thumbnail?: string;
        image?: string;
        price?: number;
        originalPrice?: number;
        vendor?: any;
        vendorId?: string;
        [key: string]: any;
      }>
    ) => {
      if (!state.products) return;
      const { _id, variantId, ...details } = action.payload;

      state.products = state.products.map((item) => {
        const matchId =
          (item._id || item.productId || item.id) === _id ||
          item.variantId === _id;
        const matchVariant = variantId ? item.variantId === variantId : true;

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
      action: PayloadAction<{ type: "increment" | "decrement"; _id: string; variantId?: string }>
    ) => {
      if (!state.products) {
        state.products = [];
      }
      state.products = state.products.map((item) => {
        const matchById =
          (item._id || item.productId || item.id) === action.payload._id ||
          item.variantId === action.payload._id;
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
        const matchById =
          (item._id || item.productId || item.id) === action.payload._id ||
          item.variantId === action.payload._id;
        const matchByVariant = action.payload.variantId
          ? item.variantId === action.payload.variantId
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
