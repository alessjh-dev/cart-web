import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Container, Typography, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Box } from "@mui/material";
import { Delete, Add, Remove, ShoppingCart } from "@mui/icons-material";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { Product } from "../types/Product";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, clearCartLocal, addToCartLocal, removeFromCartLocal, syncCartWithServer, totalItems } = useCart();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  useEffect(() => {
    if (user) {
      syncCartWithServer();
    }
  }, [user]);

  const handleIncrease = (product: Product) => {
    addToCartLocal(product, 1);
    toast.success(`Aumentaste la cantidad de ${product.name}`);
  };

  const handleDecrease = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    if (!cartItem || cartItem.quantity <= 1) {
      toast.warn("No puedes tener menos de 1 producto");
      return;
    }
    addToCartLocal(product, -1);
    toast.info(`Reduciste la cantidad de ${product.name}`);
  };

  const handleRemove = (productId: number) => {
    removeFromCartLocal(productId);
    toast.error("Producto eliminado del carrito");
  };

  const handleClearCart = () => {
    clearCartLocal();
    toast.error("Carrito vaciado");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        Carrito de Compras ({totalItems} productos)
      </Typography>

      {cart.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <ShoppingCart sx={{ fontSize: 80, color: "gray" }} />
          <Typography sx={{ mt: 2, fontSize: 18, fontWeight: "bold" }}>
            Tu carrito está vacío
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/")}>
            Ver Productos
          </Button>
        </Box>
      ) : (
        <>
          <List>
            {cart.map(({ product, quantity }) => (
              <ListItem key={product.id} sx={{ display: "flex", alignItems: "center" }}>
                <ListItemAvatar>
                  <Avatar src={product.imageUrl} />
                </ListItemAvatar>
                <ListItemText primary={product.name} secondary={`Cantidad: ${quantity} - Precio Total: Q.${product.price * quantity}`} />
                <IconButton onClick={() => handleDecrease(product)}><Remove /></IconButton>
                <IconButton onClick={() => handleIncrease(product)}><Add /></IconButton>
                <IconButton onClick={() => handleRemove(product.id)}><Delete /></IconButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleClearCart} 
              disabled={cart.length === 0}
            >
              Vaciar Carrito
            </Button>

            {user ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
            >
              Finalizar la orden
            </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                disabled={cart.length === 0}
              >
                Inicia sesión para finalizar la orden
              </Button>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Cart;
