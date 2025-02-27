import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProviderWrapper } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ThemeProviderWrapper>
          <App />
        </ThemeProviderWrapper>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
