import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/AdminLayout';

import ProductsView from './pages/admin_views/ProductsView';
import InventoryView from './pages/admin_views/InventoryView';
import CustomersView from './pages/admin_views/CustomersView';
import OrdersView from './pages/admin_views/OrdersView';
import PaymentsView from './pages/admin_views/PaymentsView';
import AnalyticsView from './pages/admin_views/AnalyticsView';
import EmployeesView from './pages/admin_views/EmployeesView';
import ReviewsView from './pages/admin_views/ReviewsView';
import SettingsView from './pages/admin_views/SettingsView';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Consumer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductsView />} />
            <Route path="inventory" element={<InventoryView />} />
            <Route path="customers" element={<CustomersView />} />
            <Route path="orders" element={<OrdersView />} />
            <Route path="payments" element={<PaymentsView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="employees" element={<EmployeesView />} />
            <Route path="reviews" element={<ReviewsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
