import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUser, getOrders, getProduct } from "../api/api";
import { useCart } from "../context/CartContext";
import {
  Container, Typography, Paper, Avatar, Grid, CircularProgress, Button, Divider, List, ListItem, ListItemText, Collapse, ListItemAvatar, Avatar as MuiAvatar
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../types/UserProfile";
import { Order } from "../types/Order";
import { Product } from "../types/Product";
import { OrderItem } from "../types/OrderItem";

const Profile = () => {
  const authContext = useContext(AuthContext);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [orderProducts, setOrderProducts] = useState<{ [key: number]: Product[] }>({});

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user, logout } = authContext;

  useEffect(() => {
    if (user) {
      getUser(user)
        .then((response) => setUserData(response.data))
        .catch(() => toast.error("Error al cargar el perfil"))
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getOrders(user)
        .then((response) => setOrders(response.data))
        .catch(() => toast.error("Error al cargar los pedidos"));
    }
  }, [user]);

  const toggleOrderDetails = async (orderId: number, items: OrderItem[]) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);

    if (!orderProducts[orderId]) {
      try {
        const productPromises = items.map(item => getProduct(item.productId));
        const productResponses = await Promise.all(productPromises);
        const products = productResponses.map(res => res.data);
        setOrderProducts(prev => ({ ...prev, [orderId]: products }));
      } catch {
        toast.error("Error al cargar detalles del pedido");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, textAlign: "center", marginTop: 5 }}>
        {loading ? (
          <CircularProgress />
        ) : userData ? (
          <>
            <Avatar sx={{ width: 90, height: 90, margin: "auto", bgcolor: "#1976d2", fontSize: "36px" }}>
              {userData.firstName[0]}
            </Avatar>
            <Typography variant="h4" gutterBottom sx={{ marginTop: 2 }}>
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="body1" color="textSecondary">{userData.email}</Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2} sx={{ textAlign: "left" }}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>📍 Dirección de Envío:</strong> {userData.shippingAddress}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>🎂 Fecha de Nacimiento:</strong> {format(new Date(userData.birthDate), "dd/MM/yyyy")}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>🆔 ID de Usuario:</strong> {userData.id}
                </Typography>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="secondary"
              sx={{ marginTop: 3, width: "100%" }}
              onClick={logout}
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <Typography variant="h6" color="error">
            No se pudo cargar el perfil.
          </Typography>
        )}
      </Paper>

      {totalItems > 0 && (
        <Paper elevation={3} sx={{ marginTop: 3, padding: 2, borderRadius: 3, textAlign: "center" }}>
          <Typography variant="h6">🛒 Tienes {totalItems} productos en tu carrito</Typography>
          <Button variant="contained" color="primary" sx={{ marginTop: 1 }} onClick={() => navigate("/cart")}>
            Ir al carrito
          </Button>
        </Paper>
      )}

      <Paper elevation={3} sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>📦 Tus pedidos</Typography>
        {orders.length === 0 ? (
          <Typography variant="body1" color="textSecondary">No tienes pedidos aún.</Typography>
        ) : (
          <List>
            {orders.map((order) => (
              <div key={order.id}>
                <ListItem
                  component="div"
                  sx={{ cursor: "pointer" }}
                  onClick={() => toggleOrderDetails(order.id, order.items)}
                >
                  <ListItemText
                    primary={`Pedido #${order.id} - ${format(new Date(order.createdAt), "dd/MM/yyyy")}`}
                    secondary={`Total: Q.${order.totalPrice.toFixed(2)}`}
                  />
                  {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={expandedOrder === order.id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {orderProducts[order.id] ? (
                      order.items.map(item => {
                        const product = orderProducts[order.id].find(p => p.id === item.productId);
                        return product ? (
                          <ListItem key={item.id} sx={{ pl: 4 }}>
                            <ListItemAvatar>
                              <MuiAvatar src={product.imageUrl} />
                            </ListItemAvatar>
                            <ListItemText
                              primary={product.name}
                              secondary={`Cantidad: ${item.quantity} - Precio Unitario: Q.${product.price.toFixed(2)}`}
                            />
                          </ListItem>
                        ) : null;
                      })
                    ) : (
                      <Typography sx={{ pl: 4, py: 2 }}>Cargando productos...</Typography>
                    )}
                  </List>
                </Collapse>
              </div>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
