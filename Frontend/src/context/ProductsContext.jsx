import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { productosService } from '../services/api';

const ProductsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  return useContext(ProductsContext);
}

function mapProducto(producto) {
  return {
    id: producto.idProducto,
    name: producto.nombre,
    description: producto.descripcion || '',
    price: producto.precio,
    category: producto.nombreCategoria || 'Sin categoria',
    categoryId: producto.idCategoria,
    imageUrl: producto.imagenUrl || '',
    status: producto.estado || 'Activo',
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const connectionRef = useRef(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productosService.getActive();
      setProducts(res.data.map(mapProducto));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminProducts = async () => {
    setAdminLoading(true);
    try {
      const res = await productosService.getAll();
      setAdminProducts(res.data.map(mapProducto));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // SignalR — reacciona a cambios de productos en tiempo real
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/cartHub', { accessTokenFactory: () => token })
      .withAutomaticReconnect()
      .build();

    // Admin editó precio u otros campos
    connection.on('ProductoActualizado', ({ idProducto, nombre, precio, descripcion, imagenUrl }) => {
      const patch = (p) =>
        p.id === idProducto
          ? {
              ...p,
              ...(nombre      != null && { name:        nombre }),
              ...(precio      != null && { price:       precio }),
              ...(descripcion != null && { description: descripcion }),
              ...(imagenUrl   != null && { imageUrl:    imagenUrl }),
            }
          : p;
      setProducts((prev) => prev.map(patch));
      setAdminProducts((prev) => prev.map(patch));
    });

    // Admin ocultó el producto — desaparece de la lista activa
    connection.on('ProductoOcultado', ({ idProducto }) => {
      setProducts((prev) => prev.filter((p) => p.id !== idProducto));
      setAdminProducts((prev) =>
        prev.map((p) => (p.id === idProducto ? { ...p, status: 'Inactivo' } : p)),
      );
    });

    // Admin reactivó el producto — recarga para obtener sus datos completos
    connection.on('ProductoActivado', () => {
      loadProducts();
    });

    connection.start().catch(() => {});
    connectionRef.current = connection;
    return () => { connection.stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProducts = async () => {
    const promises = [loadProducts()];
    if (adminProducts.length > 0) promises.push(loadAdminProducts());
    await Promise.all(promises);
  };

  const getProductById = async (id) => {
    const res = await productosService.getById(id);
    return mapProducto(res.data);
  };

  const addProduct = async (data) => {
    setSaving(true);
    try {
      const res = await productosService.create(data);
      await refreshProducts();
      return mapProducto(res.data);
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async (id, data) => {
    setSaving(true);
    try {
      await productosService.update(id, data);
      await refreshProducts();
    } finally {
      setSaving(false);
    }
  };

  const hideProduct = async (id) => {
    setSaving(true);
    try {
      await productosService.hide(id);
      await refreshProducts();
    } finally {
      setSaving(false);
    }
  };

  const activateProduct = async (id) => {
    setSaving(true);
    try {
      await productosService.activate(id);
      await refreshProducts();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        adminProducts,
        loading,
        adminLoading,
        saving,
        error,
        loadProducts,
        loadAdminProducts,
        getProductById,
        addProduct,
        updateProduct,
        hideProduct,
        activateProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
