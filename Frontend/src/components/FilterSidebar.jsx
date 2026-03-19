import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Divider,
  Button,
  Skeleton,
  Switch,
} from "@mui/material";
import { FilterList, Favorite } from "@mui/icons-material";
import { categoriasService } from "../services/api";
import { useAuth } from "../context/AuthContext";

function FilterSidebar({ filters, onFilterChange }) {
  const { user, isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    categoriasService.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setLoadingCats(false));
  }, []);

  const handleCategoryToggle = (category) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFilterChange({ ...filters, categories: updated });
  };

  const handlePriceChange = (_, newValue) => {
    onFilterChange({ ...filters, priceRange: newValue });
  };

  const handleClearFilters = () => {
    onFilterChange({ categories: [], priceRange: [0, 500], soloFavoritos: false });
  };

  return (
    <Box
      sx={{
        width: 260,
        minWidth: 260,
        bgcolor: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(8px)",
        borderRight: "1px solid",
        borderColor: "divider",
        p: 3,
        position: "sticky",
        top: 64,
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 64px)",
        overflowY: "auto",
        display: { xs: "none", md: "block" },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <FilterList color="primary" />
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Filtros
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Mis Favoritos — solo usuarios logueados no admin */}
      {user && !isAdmin && (
        <>
          <FormControlLabel
            control={
              <Switch
                checked={!!filters.soloFavoritos}
                onChange={(e) => onFilterChange({ ...filters, soloFavoritos: e.target.checked })}
                color="error"
                size="small"
              />
            }
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Favorite sx={{ fontSize: 16, color: "error.main" }} />
                <Typography variant="body2" fontWeight={filters.soloFavoritos ? 700 : 400}>
                  Mis favoritos
                </Typography>
              </Box>
            }
          />
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Categories */}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Categorias
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        {loadingCats
          ? [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={32} sx={{ mb: 0.5 }} />
            ))
          : categories.map((cat) => {
              const name = cat.nombreCategoria ?? cat.nombre ?? cat;
              return (
                <FormControlLabel
                  key={name}
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={(filters.categories || []).includes(name)}
                      onChange={() => handleCategoryToggle(name)}
                    />
                  }
                  label={<Typography variant="body2">{name}</Typography>}
                />
              );
            })}
      </FormGroup>

      <Divider sx={{ mb: 2 }} />

      {/* Price Range */}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Precio (L)
      </Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        <Slider
          value={filters.priceRange || [0, 500]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          color="primary"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">
            L.{(filters.priceRange || [0, 500])[0]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            L.{(filters.priceRange || [0, 500])[1]}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Clear Filters */}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleClearFilters}
        sx={{ borderRadius: 2 }}
      >
        Limpiar filtros
      </Button>
    </Box>
  );
}

export default FilterSidebar;
