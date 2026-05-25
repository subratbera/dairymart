import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, CreditCard, Activity, Star, Settings, UsersRound, Milk, LogOut, Menu, X } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Milk size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'AI Analytics', path: '/admin/analytics', icon: <Activity size={20} /> },
    { name: 'Employees', path: '/admin/employees', icon: <UsersRound size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header flex-between">
          <div className="flex-center" style={{gap: '0.75rem'}}>
            <Milk size={28} className="text-secondary" />
            {isSidebarOpen && <span className="logo-text">Admin Panel</span>}
          </div>
          <button className="icon-btn toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <span className="link-icon">{item.icon}</span>
                {isSidebarOpen && <span className="link-text">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link logout-link" onClick={handleLogout} style={{width: '100%', border: 'none', background: 'transparent', textAlign: 'left'}}>
            <span className="link-icon"><LogOut size={20} /></span>
            {isSidebarOpen && <span className="link-text">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-topbar flex-between glass">
          <h2 className="topbar-title">
            {navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Dashboard'}
          </h2>
          <div className="topbar-actions flex-center">
            <span className="admin-badge">Super Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-content animate-fade-in">
          {/* Renders the nested routes */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
