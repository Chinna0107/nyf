import React from 'react'
import Header from './components/Header'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { CartProvider } from './context/CartContext'
import UserDashboard from './pages/user/Dashboard'
import UserProfile from './pages/user/Profile'
import OrderTracking from './pages/user/OrderTracking'
import MyOrders from './pages/user/MyOrders'
import './App.css'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import RefundPolicy from './pages/RefundPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import TShirts from './pages/TShirts'
import Sweatshirts from './pages/Sweatshirts'
import Hoodies from './pages/Hoodies'
import Shirts from './pages/Shirts'
import TrackPants from './pages/TrackPants'
import Pants from './pages/Pants'
import CustomEmbroidery from './pages/CustomEmbroidery'
import OurStory from './pages/OurStory'
import Contact from './pages/Contact'
import About from './pages/About'
import Footer from './components/Footer'
import AdminDashboard from './pages/admin/Dashboard'
import AdminBanners from './pages/admin/Banners'
import AdminBannerForm from './pages/admin/BannerForm'
import AdminProducts from './pages/admin/Products'
import AdminProductForm from './pages/admin/ProductForm'
import AdminUsers from './pages/admin/Users'
import AdminOrders from './pages/admin/Orders'
import AdminReports from './pages/admin/Reports'
import AdminCustomers from './pages/admin/Customers'

function App() {
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const isUserRoute = window.location.pathname.startsWith('/user');

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        {!isAdminRoute && !isUserRoute && <Header />}
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product/:name' element={<Products />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path='/refund-policy' element={<RefundPolicy />} />
        <Route path='/shipping-policy' element={<ShippingPolicy />} />
        <Route path='/tshirts' element={<TShirts />} />
        <Route path='/shirts' element={<Shirts />} />
        <Route path='/trackpants' element={<TrackPants />} />
        <Route path='/pants' element={<Pants />} />
        <Route path='/sweatshirts' element={<Sweatshirts />} />
        <Route path='/hoodies' element={<Hoodies />} />
        <Route path='/custom' element={<CustomEmbroidery />} />
        <Route path='/our-story' element={<OurStory />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
      <Route path='/admin' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/banners' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminBanners /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/banners/add' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminBannerForm /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/banners/edit/:id' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminBannerForm /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/products' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/products/add' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminProductForm /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/products/edit/:id' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminProductForm /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/users' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/customers' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminCustomers /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/orders' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
      <Route path='/admin/reports' element={<ProtectedRoute requiredRole='admin'><AdminLayout><AdminReports /></AdminLayout></ProtectedRoute>} />
      <Route path='/user/dashboard' element={<ProtectedRoute requiredRole='user'><UserDashboard /></ProtectedRoute>} />
      <Route path='/my-orders' element={<ProtectedRoute requiredRole='user'><MyOrders /></ProtectedRoute>} />
      <Route path='/order-tracking' element={<ProtectedRoute requiredRole='user'><OrderTracking /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute requiredRole='user'><UserProfile /></ProtectedRoute>} />
        </Routes>
        {!isAdminRoute && !isUserRoute && <Footer />}
      </Router>
    </CartProvider>
  )
}
export default App
