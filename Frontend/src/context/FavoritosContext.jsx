import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { favoritosService } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritosContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useFavoritos() {
  return useContext(FavoritosContext);
}

export function FavoritosProvider({ children }) {
  const { user } = useAuth();
  // Set de idProducto para lookup O(1)
  const [favoritosIds, setFavoritosIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const userId = user?.email ?? null;

  // Cargar favoritos solo cuando cambia el id de usuario
  useEffect(() => {
    if (!userId) {
      setFavoritosIds(new Set());
      return;
    }
    setLoading(true);
    favoritosService.getAll()
      .then((res) => {
        const ids = new Set(res.data.map((f) => f.idProducto));
        setFavoritosIds(ids);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const isFavorito = useCallback(
    (idProducto) => favoritosIds.has(idProducto),
    [favoritosIds]
  );

  const toggleFavorito = useCallback(async (idProducto) => {
    if (!user) return;
    const esFav = favoritosIds.has(idProducto);
    // Optimistic update
    setFavoritosIds((prev) => {
      const next = new Set(prev);
      esFav ? next.delete(idProducto) : next.add(idProducto);
      return next;
    });
    try {
      if (esFav) {
        await favoritosService.remove(idProducto);
      } else {
        await favoritosService.add(idProducto);
      }
    } catch {
      // Revertir si falla
      setFavoritosIds((prev) => {
        const next = new Set(prev);
        esFav ? next.add(idProducto) : next.delete(idProducto);
        return next;
      });
    }
  }, [user, favoritosIds]);

  return (
    <FavoritosContext.Provider value={{ favoritosIds, isFavorito, toggleFavorito, loading }}>
      {children}
    </FavoritosContext.Provider>
  );
}
