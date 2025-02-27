import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUser } from "../api/api";
import { 
  Container, Typography, Paper, Avatar, Grid, CircularProgress, Button, Divider 
} from "@mui/material";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  shippingAddress: string;
  birthDate: string;
}

const Profile = () => {
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user, logout } = authContext;

  useEffect(() => {
    if (user) {
      getUser(user)
        .then((response) => {
          setUserData(response.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error al cargar el perfil");
          setLoading(false);
        });
    }
  }, [user]);

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
    </Container>
  );
};

export default Profile;
