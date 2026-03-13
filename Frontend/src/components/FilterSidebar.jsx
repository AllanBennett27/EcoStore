import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Divider,
  Button,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";

const categories = [
  "Alimentos Organicos",
  "Cuidado Personal",
  "Hogar Ecologico",
  "Bebidas Naturales",
  "Ropa Sostenible",
  "Jardineria",
];

function FilterSidebar({ filters, onFilterChange }) {
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
    onFilterChange({ categories: [], priceRange: [0, 500] });
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

      {/* Categories */}
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Categorias
      </Typography>
      <FormGroup sx={{ mb: 3 }}>
        {categories.map((cat) => (
          <FormControlLabel
            key={cat}
            control={
              <Checkbox
                size="small"
                color="primary"
                checked={(filters.categories || []).includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
              />
            }
            label={<Typography variant="body2">{cat}</Typography>}
          />
        ))}
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
