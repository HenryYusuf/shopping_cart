import { ReactNode, forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import Cart from "./Cart";
import { Product } from "../store/shopping-cart-context";

interface CartModalProps {
  cartItems: Product[];
  onUpdateCartItemQuantity: (producId: string, amount: number) => void;
  title: string;
  actions: ReactNode;
}

export type RefCartModal = {
  open: () => void;
};

const CartModal = forwardRef(function Modal(
  { cartItems, onUpdateCartItemQuantity, title, actions }: CartModalProps,
  ref
) {
  const dialog = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        dialog.current?.showModal();
      },
    };
  });

  return createPortal(
    <dialog id="modal" ref={dialog}>
      <h2>{title}</h2>
      <Cart items={cartItems} onUpdateItemQuantity={onUpdateCartItemQuantity} />
      <form method="dialog" id="modal-actions">
        {actions}
      </form>
    </dialog>,
    document.getElementById("modal")!
  );
});

export default CartModal;
