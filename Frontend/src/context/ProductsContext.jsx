import { createContext, useContext, useEffect, useState } from 'react';
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

  const refreshProducts = async () => {
    await Promise.all([loadProducts(), loadAdminProducts()]);
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
