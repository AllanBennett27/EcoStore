import { createContext, useContext, useState } from 'react';
import { carritoService } from '../services/api';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product) => {
    // Calcula la nueva cantidad antes de llamar al endpoint
    const existing = cartItems.find((item) => item.product.id === product.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    try {
      await carritoService.agregar(product.id, newQuantity, product.price);
    } catch (err) {
      console.error('Error al agregar al carrito:', err);
      // Si falla el servidor, no actualizamos el estado local
      return;
    }

    setCartItems((prev) => {
      const ex = prev.find((item) => item.product.id === product.id);
      if (ex) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId) => {
    try {
      await carritoService.eliminar(productId);
    } catch (err) {
      console.error('Error al eliminar del carrito:', err);
      return;
    }
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const item = cartItems.find((i) => i.product.id === productId);
    if (!item) return;

    try {
      await carritoService.agregar(productId, quantity, item.product.price);
    } catch (err) {
      console.error('Error al actualizar cantidad:', err);
      return;
    }

    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = async () => {
    for (const item of cartItems) {
      try {
        await carritoService.eliminar(item.product.id);
      } catch (err) {
        console.error('Error al vaciar carrito:', err);
      }
    }
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
