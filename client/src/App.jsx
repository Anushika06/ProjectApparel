import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import CustomizationPage from './pages/CustomizationPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import PastOrdersPage from './pages/PastOrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import OrderNowPage from './pages/OrderNowPage'; // --- NEW IMPORT ---

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<CustomizationPage />} />
          {/* --- NEW ROUTE --- */}
          <Route path="/order-now/:id" element={<OrderNowPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route 
            path="/cart" 
            element={<ProtectedRoute><CartPage /></ProtectedRoute>} 
          />
          <Route 
            path="/orders" 
            element={<ProtectedRoute><PastOrdersPage /></ProtectedRoute>} 
          />
          <Route 
            path="/checkout" 
            element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} 
          />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
