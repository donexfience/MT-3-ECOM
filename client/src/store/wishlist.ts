import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



interface SubCategory {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
}
interface Variant {
  _id?: string;
  price: number;
  quantity: number;
  ram?: number;
  storage?: number;
  color?: string;
  size?: string;
  [key: string]: any;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  subcategory: SubCategory;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  subcategory: SubCategory;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface WishlistItem {
  product: Product;
}

interface Wishlist {
  _id?: string;
  user: string;
  items: WishlistItem[];
  createdAt?: string;
  updatedAt?: string;
}

interface WishlistStore {
  wishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;

  setWishlist: (wishlist: Wishlist) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getTotalItems: () => number;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: null,
      isLoading: false,
      error: null,

      setWishlist: (wishlist) => set({ wishlist, error: null }),

      addToWishlist: (product) => {
        const { wishlist } = get();

        if (!wishlist) {
          const newWishlist: Wishlist = {
            user: "",
            items: [{ product }],
          };
          set({ wishlist: newWishlist });
          return;
        }

        const alreadyInWishlist = wishlist.items.some(
          (item) => item.product._id === product._id
        );

        if (alreadyInWishlist) return;

        set({
          wishlist: {
            ...wishlist,
            items: [...wishlist.items, { product }],
          },
        });
      },

      removeFromWishlist: (productId) => {
        const { wishlist } = get();
        if (!wishlist) return;

        const updatedItems = wishlist.items.filter(
          (item) => item.product._id !== productId
        );

        set({
          wishlist: {
            ...wishlist,
            items: updatedItems,
          },
        });
      },

      clearWishlist: () => {
        set({ wishlist: null, error: null });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      getTotalItems: () => {
        const { wishlist } = get();
        return wishlist ? wishlist.items.length : 0;
      },

      isInWishlist: (productId) => {
        const { wishlist } = get();
        if (!wishlist) return false;

        return wishlist.items.some((item) => item.product._id === productId);
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        wishlist: state.wishlist,
      }),
    }
  )
);

// Helperss to become lazy
export const clearWishlistFn = () => useWishlistStore.getState().clearWishlist;
export const addToWishlistFn = (product: Product) =>
  useWishlistStore.getState().addToWishlist(product);
export const removeFromWishlistFn = (productId: string) =>
  useWishlistStore.getState().removeFromWishlist(productId);
export const getTotalItemsFn = () =>
  useWishlistStore.getState().getTotalItems();
export const isInWishlistFn = (productId: string) =>
  useWishlistStore.getState().isInWishlist(productId);
