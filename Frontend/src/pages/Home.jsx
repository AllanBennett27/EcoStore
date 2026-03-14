import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Button,
  Skeleton,
  Grid,
} from "@mui/material";
import {
  ArrowForward,
  EnergySavingsLeaf,
  Recycling,
  VolunteerActivism,
  Park,
  WaterDrop,
} from "@mui/icons-material";
import Header from "../components/Header";
import { useProducts } from "../context/ProductsContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const categoryMeta = {
  "Alimentos Organicos": {
    emoji: "🥗",
    description:
      "Descubre una seleccion de alimentos cultivados con amor por la tierra — sin pesticidas, sin quimicos, sin compromisos. Desde frutas y verduras frescas hasta granos y superalimentos, cada producto esta pensado para nutrir tu cuerpo y apoyar a productores responsables.",
  },
  "Cuidado Personal": {
    emoji: "🧴",
    description:
      "Tu piel merece lo mejor de la naturaleza. Explora cosmeticos, cremas, shampoos y jabones elaborados con ingredientes botanicos puros, libres de parabenos y sulfatos agresivos. Cuida de ti mismo sin hacerle dano al planeta.",
  },
  "Hogar Ecologico": {
    emoji: "🏡",
    description:
      "Transforma tu hogar en un espacio mas sostenible. Encuentra detergentes biodegradables, utensilios reutilizables y productos de limpieza naturales que protegen tu familia y reducen la huella ambiental de tu rutina diaria.",
  },
  "Bebidas Naturales": {
    emoji: "🍵",
    description:
      "Hidratate con conciencia. Desde infusiones de hierbas medicinales y jugos prensados en frio hasta aguas aromatizadas y tizanas relajantes — todas elaboradas sin conservantes, colorantes ni azucares anadidos. Puro sabor, pura naturaleza.",
  },
  "Ropa Sostenible": {
    emoji: "👕",
    description:
      "La moda puede ser etica y hermosa a la vez. Viste con prendas confeccionadas en algodon organico, lino natural y bambu bajo estandares de comercio justo. Cada prenda cuenta una historia de respeto: al trabajador, al ambiente y a ti.",
  },
  Jardineria: {
    emoji: "🌱",
    description:
      "Cultiva vida desde casa. Ya sea que tengas un gran jardin o solo un balcon, aqui encontraras semillas organicas certificadas, tierra compostal, fertilizantes naturales y todo lo necesario para hacer crecer tu propio rincon verde.",
  },
};

const benefits = [
  {
    icon: <EnergySavingsLeaf sx={{ fontSize: 36, color: "#2e7d32" }} />,
    title: "100% Natural",
    desc: "Ingredientes puros sin quimicos ni conservantes artificiales.",
    bg: "linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)",
  },
  {
    icon: <Recycling sx={{ fontSize: 36, color: "#00796b" }} />,
    title: "Cero Residuos",
    desc: "Empaques biodegradables y reciclables en todos nuestros productos.",
    bg: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)",
  },
  {
    icon: <VolunteerActivism sx={{ fontSize: 36, color: "#558b2f" }} />,
    title: "Comercio Justo",
    desc: "Apoyamos a productores locales con precios y condiciones justas.",
    bg: "linear-gradient(135deg, #f9fbe7 0%, #f0f4c3 100%)",
  },
  {
    icon: <WaterDrop sx={{ fontSize: 36, color: "#0277bd" }} />,
    title: "Ahorro Hidrico",
    desc: "Procesos de produccion responsables con el uso del agua.",
    bg: "linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)",
  },
  {
    icon: <Park sx={{ fontSize: 36, color: "#388e3c" }} />,
    title: "Reforestacion",
    desc: "Por cada compra plantamos un arbol junto a nuestros aliados.",
    bg: "linear-gradient(135deg, #f1f8e9 0%, #c8e6c9 100%)",
  },
];

function BenefitsBanner() {
  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #1b5e20 0%, #f9fbe7 100%)",
        pt: 5,
        pb: 6,
        px: 3,
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 0.5, color: "#fff" }}
        >
          ¿Por que elegir EcoStore?
        </Typography>
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mb: 3.5, color: "rgba(255,255,255,0.8)" }}
        >
          Cada producto que ofrecemos cumple con nuestros estandares de
          sostenibilidad y respeto por el planeta.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {benefits.map((b) => (
            <Grid key={b.title} size={{ xs: 12, sm: 6, md: 4, lg: "auto" }}>
              <Box
                sx={{
                  background: b.bg,
                  borderRadius: 3,
                  p: 2.5,
                  textAlign: "center",
                  minWidth: { lg: 190 },
                  height: "100%",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                {b.icon}
                <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 1 }}>
                  {b.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {b.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function ProductCard({ product, onClick }) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 28px rgba(46,125,50,0.2)",
        },
      }}
    >
      <CardActionArea onClick={onClick}>
        <Box
          sx={{
            bgcolor: product.color,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: 72 }}>{product.emoji}</Typography>
        </Box>
        <Box sx={{ p: 1.5, textAlign: "center" }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="primary.main" fontWeight={500}>
            L.{product.price?.toFixed(2)}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
}

function CategorySection({ categoryName, products, navigate }) {
  const meta = categoryMeta[categoryName] ?? {
    emoji: "📦",
    description: "Explora nuestra seleccion de productos de esta categoria.",
  };

  return (
    <Box sx={{ mb: 7 }}>
      {/* Category banner */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1b5e20 0%, #2e7d32 55%, #66bb6a 100%)",
          borderRadius: 3,
          px: { xs: 3, md: 4 },
          py: 3,
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 20px rgba(46,125,50,0.3)",
        }}
      >
        {/* Decorative large emoji background */}
        <Typography
          sx={{
            position: "absolute",
            right: { xs: 100, md: 200 },
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: { xs: 80, md: 110 },
            opacity: 0.12,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {meta.emoji}
        </Typography>

        {/* Text content */}
        <Box sx={{ zIndex: 1, maxWidth: 600 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Typography sx={{ fontSize: 30 }}>{meta.emoji}</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
              {categoryName}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 500 }}
          >
            {meta.description}
          </Typography>
        </Box>

        {/* CTA button */}
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() =>
            navigate(`/products?category=${encodeURIComponent(categoryName)}`)
          }
          sx={{
            zIndex: 1,
            bgcolor: "#fff",
            color: "primary.dark",
            fontWeight: 700,
            borderRadius: 3,
            whiteSpace: "nowrap",
            ml: 2,
            flexShrink: 0,
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          Ver mas
        </Button>
      </Box>

      {/* Swiper carousel */}
      <Box
        sx={{
          "& .swiper-pagination": {
            textAlign: "center",
            position: "relative",
            mt: 1.5,
          },
          "& .swiper-pagination-bullet": { bgcolor: "#a5d6a7", opacity: 1 },
          "& .swiper-pagination-bullet-active": { bgcolor: "#2e7d32" },
        }}
      >
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={700}
          slidesPerGroup={1}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            600: { slidesPerView: 3 },
            900: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          style={{ paddingBottom: "8px" }}
        >
          {products.slice(0, 12).map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}

function Home() {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();

  const grouped = products.reduce((acc, product) => {
    const cat = product.category || "Sin categoria";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />

      {/* Hero */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #4caf50 100%)",
          color: "#fff",
          py: { xs: 6, md: 8 },
          px: 3,
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 700, mx: "auto" }}>
          <EnergySavingsLeaf sx={{ fontSize: 56, mb: 1 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Bienvenido a EcoStore
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
            Productos sostenibles para un estilo de vida mas verde. Cada compra
            contribuye a un planeta mejor.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/products")}
            sx={{
              bgcolor: "#fff",
              color: "primary.dark",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            Ver todos los productos
          </Button>
        </Box>
      </Box>

      <BenefitsBanner />

      {/* Category sections */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 6 }}>
        {loading ? (
          [1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 7 }}>
              <Skeleton
                variant="rounded"
                height={90}
                sx={{ mb: 2.5, borderRadius: 3 }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton
                    key={j}
                    variant="rounded"
                    height={260}
                    sx={{ flex: 1, borderRadius: 3 }}
                  />
                ))}
              </Box>
            </Box>
          ))
        ) : error ? (
          <Typography textAlign="center" color="error" sx={{ py: 8 }}>
            No se pudo conectar con el servidor. Verifica que el backend este
            corriendo.
          </Typography>
        ) : Object.keys(grouped).length === 0 ? (
          <Typography textAlign="center" color="text.secondary" sx={{ py: 8 }}>
            No hay productos disponibles.
          </Typography>
        ) : (
          Object.entries(grouped).map(([categoryName, categoryProducts]) => (
            <CategorySection
              key={categoryName}
              categoryName={categoryName}
              products={categoryProducts}
              navigate={navigate}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

export default Home;
