import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { carritoService } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}

function mapItem(dto) {
  return {
    product: {
      id:          dto.idProducto,
      name:        dto.nombreProducto,
      price:       dto.precioUnitario,
      imageUrl:    dto.imagenUrl,
      category:    dto.nombreCategoria,
    },
    quantity: dto.cantidad,
  };
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartNotification, setCartNotification] = useState(null);
  const cartItemsRef = useRef(cartItems);

  // Mantener ref actualizada
  useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

  // Cargar carrito desde BD al iniciar sesión
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!user) { setCartItems([]); return; }
    carritoService.get()
      .then((res) => setCartItems((res.data ?? []).map(mapItem)))
      .catch(() => {});
  }, [user]);

  // SignalR global — notifica si un producto del carrito fue ocultado o su precio cambió
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user || !token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/cartHub', { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    connection.on('ProductoOcultado', ({ idProducto }) => {
      const enCarrito = cartItemsRef.current.some(({ product }) => product.id === idProducto);
      if (enCarrito) {
        carritoService.eliminar(idProducto).catch(() => {});
        setCartItems((prev) => prev.filter((item) => item.product.id !== idProducto));
        setCartNotification({
          message: 'Un producto de tu carrito ya no está disponible y fue eliminado.',
          severity: 'error',
        });
      }
    });

    connection.on('ProductoActualizado', ({ idProducto, nombre, precio, imagenUrl }) => {
      const enCarrito = cartItemsRef.current.some(({ product }) => product.id === idProducto);
      if (enCarrito) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.product.id === idProducto
              ? {
                  ...item,
                  product: {
                    ...item.product,
                    ...(nombre    != null && { name:     nombre }),
                    ...(precio    != null && { price:    precio }),
                    ...(imagenUrl != null && { imageUrl: imagenUrl }),
                  },
                }
              : item
          )
        );
        setCartNotification({
          message: 'Un producto de tu carrito fue actualizado por el administrador.',
          severity: 'info',
        });
      }
    });

    connection.on('StockActualizado', ({ stocks }) => {
      if (!stocks?.length) return;
      const current = cartItemsRef.current;
      stocks.forEach(({ idProducto, stockActual }) => {
        const item = current.find(({ product }) => product.id === idProducto);
        if (item && item.quantity > stockActual) {
          setCartNotification({
            message: `El stock de "${item.product.name}" bajó a ${stockActual}. Revisa tu carrito.`,
            severity: 'warning',
          });
        }
      });
    });

    connection.start().catch(() => {});
    return () => { connection.stop(); };
  }, [user]);

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

  const clearCartNotification = () => setCartNotification(null);
  const showCartNotification = (message, severity = 'warning') =>
    setCartNotification({ message, severity });

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
        cartNotification,
        clearCartNotification,
        showCartNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
