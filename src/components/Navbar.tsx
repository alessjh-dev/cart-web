import { AppBar, Toolbar, Button, Box, IconButton, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import { ShoppingCart, Person, DarkMode, LightMode, Spa } from "@mui/icons-material";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { toggleTheme, darkMode } = useTheme();
  const { totalItems } = useCart();

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { user, logout } = authContext;

  return (
    <AppBar position="sticky" elevation={0} sx={navBarStyle}>
      <Toolbar sx={toolbarStyle}>
        <Box>
          <IconButton component={Link} to="/" sx={categoryIconStyle(darkMode)}>
            <Spa fontSize="large" />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              <IconButton component={Link} to="/profile" sx={iconStyle(darkMode)}>
                <Person />
              </IconButton>
              <Button onClick={logout} sx={navButtonStyle(darkMode)}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={navButtonStyle(darkMode)}>
                Iniciar Sesión
              </Button>
              <Button component={Link} to="/register" sx={navButtonStyle(darkMode)}>
                Registrarse
              </Button>
            </>
          )}

          <IconButton onClick={toggleTheme} sx={iconStyle(darkMode)}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          <IconButton component={Link} to="/cart" sx={iconStyle(darkMode)}>
            <Badge badgeContent={totalItems} color="error" sx={badgeStyle}>
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const navBarStyle = {
  background: "transparent",
  boxShadow: "none",
  backdropFilter: "blur(10px)",
  padding: "10px 20px",
};

const toolbarStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const categoryIconStyle = (darkMode: boolean) => ({
  color: darkMode ? "#ffffff" : "#000000",
  fontSize: "32px",
  transition: "0.3s",
  "&:hover": { color: "#ff4081" },
});

const navButtonStyle = (darkMode: boolean) => ({
  color: darkMode ? "#ffffff" : "#000000",
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "none",
  padding: "8px 16px",
  transition: "0.3s",
  "&:hover": { color: "#ff4081" },
});

const iconStyle = (darkMode: boolean) => ({
  color: darkMode ? "#ffffff" : "#000000",
  fontSize: "24px",
  transition: "0.3s",
  "&:hover": { color: "#ff4081" },
});

const badgeStyle = {
  "& .MuiBadge-badge": {
    fontSize: "0.75rem",
    minWidth: "20px",
    height: "20px",
    borderRadius: "10px",
  },
};

export default Navbar;
