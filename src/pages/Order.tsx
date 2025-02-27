import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, checkout } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { 
  Container, Typography, Button, List, ListItem, ListItemText, ListItemAvatar, Avatar, 
  Box, Paper, Divider, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { toast } from "react-toastify";

const SHIPPING_COST = 25.00;

const Checkout = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { cart, clearCartLocal } = useCart();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user) {
      getUser(user)
        .then((response) => {
          setUserData(response.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error al obtener la información del usuario.");
          setLoading(false);
        });
    }
    setTotal(
      cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    );
  }, [user, cart]);

  const handleCheckout = async () => {
    if (!userData) {
      toast.error("No se pudo obtener la información del usuario.");
      return;
    }

    if (cart.length === 0) {
      toast.warn("Tu carrito está vacío.");
      return;
    }

    try {
      const orderData = {
        userEmail: userData.email,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: Number(item.quantity),
          price: Number(item.product.price.toFixed(2)), 
        })),
      };

      const response = await checkout(orderData);
      toast.success(`¡Orden #${response.data.id} completada con éxito!`);
      clearCartLocal();
      navigate("/");
    } catch (error) {
      toast.error("Error al procesar el pedido.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
          🛒 Checkout
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Cargando datos del usuario...</Typography>
          </Box>
        ) : userData ? (
          <>
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="h6">Información del Usuario</Typography>
              <Typography><strong>📛 Nombre:</strong> {userData.firstName} {userData.lastName}</Typography>
              <Typography><strong>📩 Correo:</strong> {userData.email}</Typography>
              <Typography><strong>📍 Dirección:</strong> {userData.shippingAddress}</Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
              Resumen del Pedido
            </Typography>

            {cart.length === 0 ? (
              <Box sx={{ textAlign: "center", mt: 5 }}>
                <ShoppingCart sx={{ fontSize: 80, color: "gray" }} />
                <Typography sx={{ mt: 2, fontSize: 18, fontWeight: "bold" }}>
                  Tu carrito está vacío
                </Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>
                  Ver Productos
                </Button>
              </Box>
            ) : (
              <>
                <List>
                  {cart.map(({ product, quantity }) => (
                    <ListItem key={product.id}>
                      <ListItemAvatar>
                        <Avatar src={product.imageUrl} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={product.name} 
                        secondary={`Cantidad: ${quantity} - Q${(product.price * quantity).toFixed(2)}`} 
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6">
                  Subtotal: <strong>Q{total.toFixed(2)}</strong>
                </Typography>
                <Typography variant="h6">
                  Envío: <strong>Q{SHIPPING_COST.toFixed(2)}</strong>
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
                  Total a Pagar: <strong>Q{(total + SHIPPING_COST).toFixed(2)}</strong>
                </Typography>

                <Button 
                  onClick={() => setOpenDialog(true)} 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  sx={{ mt: 3 }}
                >
                  Confirmar Pedido - Pago Contra Entrega
                </Button>
              </>
            )}
          </>
        ) : (
          <Typography variant="h6" color="error" textAlign="center">
            No se pudo cargar la información del usuario.
          </Typography>
        )}
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            padding: "16px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Confirmar Pedido
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontSize: "16px", color: "#555" }}>
            ¿Estás seguro de que deseas confirmar tu pedido?
            Se enviará a la dirección registrada.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-between", padding: "16px" }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            sx={{ color: "#d32f2f", fontWeight: "bold" }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCheckout} 
            variant="contained" 
            sx={{ background: "#4CAF50", color: "#fff", fontWeight: "bold", "&:hover": { background: "#388E3C" } }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Checkout;
