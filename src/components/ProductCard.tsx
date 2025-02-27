import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import { Product } from "../types/Product";
import { useTheme } from "../context/ThemeContext";

interface ProductProps {
  product: Product;
  addToCart: (id: number) => void;
}

const ProductCard = ({ product, addToCart }: ProductProps) => {
  const { darkMode } = useTheme();

  return (
    <Card sx={cardStyle(darkMode)}>
      <CardMedia component="img" height="200" image={product.imageUrl} alt={product.name} sx={cardMediaStyle} />

      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={titleStyle(darkMode)}>
          {product.name}
        </Typography>
        <Typography variant="body2" sx={descriptionStyle(darkMode)}>
          {product.description}
        </Typography>
        <Typography variant="h6" sx={priceStyle(darkMode)}>
          Q.{product.price.toFixed(2)}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <Button variant="contained" sx={buttonStyle} onClick={() => addToCart(product.id)}>
            Agregar al Carrito
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const cardStyle = (darkMode: boolean) => ({
  maxWidth: 350,
  borderRadius: "12px",
  boxShadow: darkMode ? "0px 5px 15px rgba(255, 105, 180, 0.3)" : "0px 5px 15px rgba(0, 170, 255, 0.2)",
  transition: "0.3s",
  backgroundColor: darkMode ? "#222" : "#fff",
  color: darkMode ? "#fff" : "#000",
  "&:hover": { transform: "scale(1.03)" },
});

const cardMediaStyle = {
  borderRadius: "12px 12px 0 0",
  objectFit: "cover",
};

const titleStyle = (darkMode: boolean) => ({
  fontWeight: "bold",
  color: darkMode ? "#ff80ab" : "#d32f2f",
});

const descriptionStyle = (darkMode: boolean) => ({
  color: darkMode ? "#ccc" : "#555",
  marginBottom: "10px",
});

const priceStyle = (darkMode: boolean) => ({
  fontWeight: "bold",
  color: darkMode ? "#80d8ff" : "#00aaff",
});

const buttonStyle = {
  background: "#ff4081",
  "&:hover": { background: "#d32f2f" },
  borderRadius: "8px",
  padding: "8px 16px",
};

export default ProductCard;
