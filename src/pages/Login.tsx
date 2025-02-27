import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TextField, Button, Container, Typography, Paper, Box } from "@mui/material";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { login } = authContext;

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await loginUser(data);
      login(response.data.token, data.email);
      toast.success("Inicio de sesión exitoso");
      navigate("/");
    } catch (error) {
      toast.error("Error al iniciar sesión");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, textAlign: "center", marginTop: 5 }}>
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            fullWidth 
            label="Correo Electrónico" 
            {...register("email")} 
            error={!!errors.email} 
            helperText={errors.email?.message} 
            margin="normal" 
            required 
          />
          <TextField 
            fullWidth 
            label="Contraseña" 
            type="password" 
            {...register("password")} 
            error={!!errors.password} 
            helperText={errors.password?.message} 
            margin="normal" 
            required 
          />
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Iniciar Sesión
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
