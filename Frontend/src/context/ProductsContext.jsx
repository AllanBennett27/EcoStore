import { createContext, useContext, useState, useEffect } from 'react';
import { productosService } from '../services/api';

const ProductsContext = createContext();

export function useProducts() {
  return useContext(ProductsContext);
}

function mapProducto(p) {
  return {
    id: p.idProducto,
    name: p.nombre,
    description: p.descripcion || '',
    price: p.precio,
    category: p.nombreCategoria || 'Sin categoría',
    imagenUrl: p.imagenUrl || null,
    emoji: '📦',
    color: '#e8f5e9',
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productosService
      .getAll()
      .then((res) => setProducts(res.data.map(mapProducto)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addProduct = (product) => {
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    const newProduct = { ...product, id: maxId + 1 };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, data) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
