import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Order from "./pages/Order";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
     <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Order />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
