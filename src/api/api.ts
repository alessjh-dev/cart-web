import axios from "axios";

const API_USER = import.meta.env.VITE_API_USER;
const API_PRODUCT = import.meta.env.VITE_API_PRODUCT;
const API_CART = import.meta.env.VITE_API_CART;
const API_ORDER = import.meta.env.VITE_API_ORDER;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { 
    Authorization: `Bearer ${token}`
 } : {};
};

export const registerUser = async (userData: { 
  firstName: string;
  lastName: string;
  shippingAddress: string;
  birthDate: string;
  email: string;
  password: string;
}) => axios.post(`${API_USER}/api/auth/register`, userData);

export const loginUser = (credentials: { email: string; password: string }) =>
  axios.post(`${API_USER}/api/auth/login`, credentials);

export const getUser = (email: string) =>
  axios.get(`${API_USER}/api/users/email/${email}`, { headers: { ...getAuthHeaders() } });

export const getProducts = () => axios.get(`${API_PRODUCT}/api/products`);

export const addToCart = (userEmail: string, productId: number, quantity: number) =>
  axios.post(
    `${API_CART}/api/cart/add?userEmail=${userEmail}&productId=${productId}&quantity=${quantity}`,
    {},
    { headers: { ...getAuthHeaders() } }
  );

export const getCart = (userEmail: string) =>
  axios.get(
    `${API_CART}/api/cart?userEmail=${userEmail}`,
    { headers: { ...getAuthHeaders() } }
  );

  export const removeFromCart = (userEmail: string, productId: number) =>
  axios.delete(
    `${API_CART}/api/cart/remove?userEmail=${userEmail}&productId=${productId}`,
    { headers: { ...getAuthHeaders() } }
  );

  export const clearCart = (userEmail: string) =>
  axios.delete(
    `${API_CART}/api/cart/clear?userEmail=${userEmail}`,
    { headers: { ...getAuthHeaders() } }
  );

  export const checkout = (orderData: { userEmail: string; items: { productId: number; quantity: number; price: number; }[] }) =>
    axios.post(
      `${API_ORDER}/api/orders/checkout`,
      orderData,
      { headers: { ...getAuthHeaders() } }
    );