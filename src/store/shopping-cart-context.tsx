import { createContext } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShoppingCart {
  items: Product[];
  addItemToCart?: (id: string) => void;
  updateItemQuantity?: (productId: string, amount: number) => void;
}

export const CartContext = createContext<ShoppingCart>({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});
