import { useEffect, useState, useContext } from "react";
import { getProducts } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Box, Container, Typography, CircularProgress, Grid } from "@mui/material";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/Product";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const { addToCartLocal } = useCart();

  useEffect(() => {
    getProducts()
      .then((response) => setProducts(response.data))
      .catch(() => toast.error("❌ Error al cargar los productos"))
      .finally(() => setLoading(false));
  }, []);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const handleAddToCart = async (product: Product) => {
    addToCartLocal(product, 1);
    toast.success(`🛒 ${product.name} agregado al carrito`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          textAlign: "center",
          py: 5,
          px: 2,
          mb: 4,
          background: "linear-gradient(to right, #43cea2, #185a9d)",
          borderRadius: 3,
          color: "#fff",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
          🌿 Descubre la Belleza de la Naturaleza 🌿
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Explora nuestra colección de flores y plantas.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Cargando productos...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} addToCart={() => handleAddToCart(product)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;
