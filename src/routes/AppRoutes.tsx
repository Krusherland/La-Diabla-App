import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, AdminLayout } from '../components/layouts';
import {
  Home,
  Menu,
  Cart,
  Checkout,
  OrderSuccess,
  MyOrders,
  About,
  Contact,
  Locations,
  TrackOrder,
} from '../components/pages';
import { Login, Register } from '../components/auth';
import {
  AdminDashboard,
  AdminProducts,
  AdminOrders,
} from '../components/admin';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="locations" element={<Locations />} />
          <Route path="track" element={<TrackOrder />} />
        </Route>

        {/* Auth Routes (without layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
