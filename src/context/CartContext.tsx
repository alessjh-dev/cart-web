import { createContext, useState, useEffect, ReactNode, useContext, useRef } from "react";
import { Product } from "../types/Product";
import { getCart, addToCart, removeFromCart, clearCart, getProduct } from "../api/api";
import { AuthContext } from "./AuthContext";
import { CartItem } from "../types/CartItem";

interface CartContextType {
  cart: CartItem[];
  addToCartLocal: (product: Product, quantity: number) => void;
  removeFromCartLocal: (productId: number) => void;
  clearCartLocal: () => void;
  syncCartWithServer: () => Promise<void>;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const isSyncing = useRef(false);
  const isCartLoaded = useRef(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    isCartLoaded.current = true;
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (user && isCartLoaded.current && !isSyncing.current) {
        isSyncing.current = true;
        await syncCartWithServer();
        isSyncing.current = false;
      }
    };

    fetchCart();
  }, [user]);

  const syncCartWithServer = async () => {
    if (!user) return;

    try {
      const { data: serverCart } = await getCart(user);
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

      const serverCartWithProducts = await Promise.all(
        serverCart.items.map(async (item: { productId: number; quantity: number }) => {
          const { data: product } = await getProduct(item.productId);
          return { product, quantity: item.quantity };
        })
      );

      const mergedCart = mergeCarts(localCart, serverCartWithProducts);
      setCart(mergedCart);
      localStorage.removeItem("cart");

      for (const item of mergedCart) {
        const existsInServer = serverCart.items.some((serverItem: any) => serverItem.productId === item.product.id);
        if (!existsInServer) {
          await addToCart(user, item.product.id, item.quantity);
        }
      }
    } catch (error) {
      console.error("Error sincronizando carrito:", error);
    }
  };

  const mergeCarts = (localCart: CartItem[], serverCart: CartItem[]) => {
    const mergedMap = new Map();

    localCart.forEach(item => {
      mergedMap.set(item.product.id, item);
    });

    serverCart.forEach(item => {
      if (mergedMap.has(item.product.id)) {
        mergedMap.get(item.product.id).quantity += item.quantity;
      } else {
        mergedMap.set(item.product.id, item);
      }
    });

    return Array.from(mergedMap.values());
  };

  const addToCartLocal = async (product: Product, quantity: number) => {
    if (user) {
      await addToCart(user, product.id, quantity);
      await syncCartWithServer();
    } else {
      setCart(prevCart => {
        const updatedCart = prevCart.map(item =>
          item.product.id === product.id ? { ...item, quantity: Math.max(item.quantity + quantity, 0) } : item
        );
        const exists = prevCart.some(item => item.product.id === product.id);
        const newCart = exists ? updatedCart : [...prevCart, { product, quantity }];
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const removeFromCartLocal = async (productId: number) => {
    if (user) {
      try {
        await removeFromCart(user, productId); 
        const updatedCart = cart.filter(item => item.product.id !== productId);
        setCart(updatedCart);
        await syncCartWithServer();
      } catch (error) {
        console.error("Error eliminando producto del carrito:", error);
      }
    } else {
      setCart(prevCart => {
        const newCart = prevCart.filter(item => item.product.id !== productId);
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };
  

  const clearCartLocal = async () => {
    if (user) {
      try {
        await clearCart(user);
        setCart([]); 
        await syncCartWithServer();
      } catch (error) {
        console.error("Error vaciando el carrito:", error);
      }
    } else {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };
  

  return (
    <CartContext.Provider value={{ cart, addToCartLocal, removeFromCartLocal, clearCartLocal, syncCartWithServer, totalItems: cart.reduce((acc, item) => acc + item.quantity, 0) }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
