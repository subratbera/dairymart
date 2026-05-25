import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Package, IndianRupee } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [demandData, setDemandData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    orders_today: 0,
    units_sold: 0
  });

  const [salesData, setSalesData] = useState([
    { name: 'Jan', sales: 0 }, { name: 'Feb', sales: 0 }, { name: 'Mar', sales: 0 },
    { name: 'Apr', sales: 0 }, { name: 'May', sales: 0 }, { name: 'Jun', sales: 0 },
    { name: 'Jul', sales: 0 }, { name: 'Aug', sales: 0 }, { name: 'Sep', sales: 0 },
    { name: 'Oct', sales: 0 }, { name: 'Nov', sales: 0 }, { name: 'Dec', sales: 0 }
  ]);

  useEffect(() => {
    // 1. Fetch AI Demand Predictions
    const token = localStorage.getItem('token');
    
    axios.get('http://127.0.0.1:5000/api/ai/predict-demand', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setDemandData(res.data.predictions))
    .catch(err => {
      console.error(err);
      // Fallback dummy data if not authenticated / error
      setDemandData([
        { day: 'Mon', predicted_demand: 120 },
        { day: 'Tue', predicted_demand: 132 },
        { day: 'Wed', predicted_demand: 101 },
        { day: 'Thu', predicted_demand: 142 },
        { day: 'Fri', predicted_demand: 190 },
        { day: 'Sat', predicted_demand: 210 },
        { day: 'Sun', predicted_demand: 180 },
      ]);
    });

    // 2. Fetch Actual Orders Table
    if(token) {
      axios.get('http://127.0.0.1:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setOrders(res.data);
        
        // Calculate monthly sales overview dynamically
        const monthlyTotals = Array(12).fill(0);
        res.data.forEach(o => {
          if (o.status !== 'pending' && o.status !== 'refunded') {
            // Split date 'YYYY-MM-DD HH:MM:SS'
            if (o.created_at) {
              const monthStr = o.created_at.split('-')[1];
              if (monthStr) {
                const monthIdx = parseInt(monthStr, 10) - 1;
                if (monthIdx >= 0 && monthIdx < 12) {
                  monthlyTotals[monthIdx] += o.total_amount;
                }
              }
            }
          }
        });
        
        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        setSalesData(monthNames.map((name, idx) => ({ name, sales: monthlyTotals[idx] })));
      })
      .catch(err => console.error("Error fetching orders:", err));
    }
    // 3. Fetch Live Dashboard Stats
    if(token) {
      axios.get('http://127.0.0.1:5000/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
    }
  }, []);

  const navigate = useNavigate();

  const handleGenerateReport = () => {
    // Generate a simple CSV from orders
    if (!orders || orders.length === 0) {
      alert("No data available to generate a report.");
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,User ID,Total Amount,Status,Date\n";
    
    orders.forEach(order => {
      const row = `${order.id},${order.user_id},${order.total_amount},${order.status},${new Date(order.created_at).toLocaleDateString()}`;
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dairymart_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, icon: <IndianRupee size={24} />, trend: "Live from the last month" },
    { title: "Active Users", value: stats.users.toLocaleString(), icon: <Users size={24} />, trend: "Live" },
    { title: "Orders (Today)", value: stats.orders_today.toLocaleString(), icon: <Package size={24} />, trend: "Live" },
    { title: "Products Sold", value: `${stats.units_sold.toLocaleString()} Units`, icon: <TrendingUp size={24} />, trend: "Live" }
  ];

  return (
    <div className="admin-container container animate-fade-in">
      <div className="admin-header flex-between mb-lg">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-muted">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex-center" style={{gap: '1rem'}}>
          <button className="btn btn-secondary" onClick={handleGenerateReport}>Generate Report</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/products')}>Add Product</button>
        </div>
      </div>

      <div className="stats-grid mb-lg">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card glass">
            <div className="flex-between" style={{marginBottom: '1rem'}}>
              <h3 className="stat-title text-muted">{stat.title}</h3>
              <div className="stat-icon flex-center">{stat.icon}</div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-trend text-primary" style={{marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center'}}>
              {stat.trend && (
                <span style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '2px 8px', borderRadius: '12px', marginRight: '6px', fontSize: '0.75rem'}}>
                  Live
                </span>
              )}
              {stat.trend === "Live from the last month" ? "from the last month" : ""}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid mb-lg">
        {/* Sales Chart */}
        <div className="chart-card glass">
          <h3 className="chart-title">Monthly Sales Overview</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-hover)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Demand Prediction Chart */}
        <div className="chart-card glass">
          <div className="flex-between chart-header">
            <h3 className="chart-title">AI Demand Prediction (Next 7 Days)</h3>
            <span className="badge-ai">Powered by Scikit-Learn</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-hover)', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: 'var(--accent)' }}
                />
                <Line type="monotone" dataKey="predicted_demand" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="table-card glass mb-lg">
        <h3 className="chart-title" style={{padding: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)'}}>Recent Orders</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Date</th>
                <th>Total (₹)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No recent orders found.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.username}</td>
                    <td>{order.email}</td>
                    <td>{order.created_at}</td>
                    <td>₹{order.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
