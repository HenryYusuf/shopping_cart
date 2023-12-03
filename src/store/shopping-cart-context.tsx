// Import statement untuk mengimpor modul yang diperlukan dari React
import { createContext, ReactNode, useReducer } from "react";

// Import statement untuk mengimpor data produk palsu
import { DUMMY_PRODUCTS } from "../dummy-products";

// Interface untuk merepresentasikan struktur data keranjang belanja
interface ShoppingCart {
  items: Product[];
  addItemToCart?: (id: string) => void;
  updateItemQuantity?: (productId: string, amount: number) => void;
}

// Interface untuk merepresentasikan struktur data produk
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Membuat konteks CartContext menggunakan createContext dari React
export const CartContext = createContext<ShoppingCart>({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

// Tipe data untuk action yang akan digunakan dalam reducer
type ActionType =
  | {
      type: "ADD_ITEM";
      payload: {
        id: string;
      };
    }
  | {
      type: "UPDATE_ITEM";
      payload: {
        productId: string;
        amount: number;
      };
    };

// State awal untuk keranjang belanja
const initialState: ShoppingCart = {
  items: [],
};

// Reducer untuk mengelola state keranjang belanja
const shoppingCartReducer = (
  state: ShoppingCart = initialState,
  action: ActionType
) => {
  // Handler untuk aksi penambahan item ke keranjang
  if (action.type === "ADD_ITEM") {
    // Membuat salinan array item untuk menghindari mutasi langsung pada state
    const updatedItems = [...state.items];

    // Mencari indeks item yang sudah ada dalam keranjang
    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload.id
    );

    // Mengambil item yang sudah ada, jika ada
    const existingCartItem = updatedItems[existingCartItemIndex];

    // Memperbarui kuantitas item jika sudah ada, jika tidak, menambahkannya ke keranjang
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // Mencari produk berdasarkan ID dalam produk palsu
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload.id
      );
      // Menambahkan item baru ke keranjang
      updatedItems.push({
        id: action.payload.id,
        name: product!.title,
        price: product!.price,
        quantity: 1,
      });
    }

    // Mengembalikan state baru setelah pembaruan
    return {
      items: updatedItems,
    };
  }

  // Handler untuk aksi pembaruan kuantitas item dalam keranjang
  if (action.type === "UPDATE_ITEM") {
    // Membuat salinan array item untuk menghindari mutasi langsung pada state
    const updatedItems = [...state.items];
    // Mencari indeks item yang akan diperbarui
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    // Membuat salinan item yang akan diperbarui
    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    // Menambah atau mengurangi kuantitas item sesuai dengan jumlah yang diberikan
    updatedItem.quantity += action.payload.amount;

    // Menghapus item jika kuantitasnya nol atau kurang
    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      // Memperbarui item dalam array jika kuantitasnya lebih dari nol
      updatedItems[updatedItemIndex] = updatedItem;
    }

    // Mengembalikan state baru setelah pembaruan
    return {
      items: updatedItems,
    };
  }
};

// Tipe data properti yang diperlukan oleh komponen penyedia konteks
type CartContextProviderProps = {
  children: ReactNode;
};

// Komponen penyedia konteks untuk menyediakan konteks ke aplikasi
const CartContextProvider = ({ children }: CartContextProviderProps) => {
  // Menggunakan useReducer untuk mengelola state keranjang belanja
  const [stateShoppingCart, dispatchShoppingCart] = useReducer(
    shoppingCartReducer,
    initialState
  );

  // Handler untuk menambahkan item ke keranjang
  function handleAddItemToCart(id: string) {
    dispatchShoppingCart({
      type: "ADD_ITEM",
      payload: {
        id,
      },
    });
  }

  // Handler untuk memperbarui kuantitas item dalam keranjang
  function handleUpdateCartItemQuantity(productId: string, amount: number) {
    dispatchShoppingCart({
      type: "UPDATE_ITEM",
      payload: {
        productId,
        amount,
      },
    });
  }

  // Nilai konteks yang akan disediakan ke komponen-komponen turunan
  const ctxValue = {
    items: stateShoppingCart!.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  // Menyediakan konteks ke komponen-komponen turunan menggunakan CartContext.Provider
  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
};

// Ekspor komponen penyedia konteks agar dapat digunakan dalam aplikasi
export default CartContextProvider;
