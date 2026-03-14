import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import Header from "../components/Header";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";

function Products() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading, error } = useProducts();
  const { user } = useAuth();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addToCart(product);
  };
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    priceRange: [0, 500],
  });

  // Sync URL category param whenever it changes (e.g. clicking "Ver más" from Home)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: categoryFromUrl ? [categoryFromUrl] : [],
    }));
  }, [categoryFromUrl]);

  const filteredProducts = products.filter((product) => {
    if (
      search &&
      !product.name.toLowerCase().includes(search.toLowerCase()) &&
      !product.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }
    return true;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header showSearch searchValue={search} onSearchChange={setSearch} />

      <Box sx={{ display: "flex" }}>
        <FilterSidebar filters={filters} onFilterChange={setFilters} />

        {/* Products Grid */}
        <Box sx={{ flex: 1, p: 3 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error al cargar productos: {error}
            </Alert>
          )}
          {!loading && !error && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight={700} color="primary.dark">
                  Productos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredProducts.length} productos encontrados
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {filteredProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </Grid>
                ))}
              </Grid>

              {filteredProducts.length === 0 && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No se encontraron productos con los filtros seleccionados.
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Products;
