import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Paper, Box } from "@mui/material";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  firstName: yup.string().required("El nombre es obligatorio"),
  lastName: yup.string().required("El apellido es obligatorio"),
  shippingAddress: yup.string().required("La dirección es obligatoria"),
  birthDate: yup.date().max(new Date(), "La fecha no puede estar en el futuro").required("La fecha de nacimiento es obligatoria"),
  email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
  password: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        shippingAddress: data.shippingAddress,
        birthDate: data.birthDate,
        email: data.email,
        password: data.password
      });
      toast.success("¡Registro exitoso! Inicia sesión.");
      navigate("/login");
    } catch (error) {
      toast.error("Error al registrarse");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, textAlign: "center", marginTop: 5 }}>
        <Typography variant="h4" gutterBottom>
          Registro de Cuenta
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Nombre" {...register("firstName")} error={!!errors.firstName} helperText={errors.firstName?.message} margin="normal" required />
          <TextField fullWidth label="Apellido" {...register("lastName")} error={!!errors.lastName} helperText={errors.lastName?.message} margin="normal" required />
          <TextField fullWidth label="Dirección" {...register("shippingAddress")} error={!!errors.shippingAddress} helperText={errors.shippingAddress?.message} margin="normal" required />
          <TextField fullWidth label="Fecha de Nacimiento" type="date" {...register("birthDate")} error={!!errors.birthDate} helperText={errors.birthDate?.message} margin="normal" InputLabelProps={{ shrink: true }} required />
          <TextField fullWidth label="Correo Electrónico" {...register("email")} error={!!errors.email} helperText={errors.email?.message} margin="normal" required />
          <TextField fullWidth label="Contraseña" type="password" {...register("password")} error={!!errors.password} helperText={errors.password?.message} margin="normal" required />
          <TextField fullWidth label="Confirmar Contraseña" type="password" {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} margin="normal" required />
          
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Registrarse
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
