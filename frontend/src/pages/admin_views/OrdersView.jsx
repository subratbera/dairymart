import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sort by newest first
      setOrders(res.data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <CheckCircle size={16} className="text-secondary" />;
      case 'shipped': return <Truck size={16} className="text-primary" />;
      case 'paid': return <Package size={16} style={{color: '#8b5cf6'}} />;
      default: return <Clock size={16} className="text-muted" />;
    }
  };

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header">
        <h2>Order Management</h2>
        <p className="text-muted">Track customer purchases and manage fulfillment.</p>
      </div>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="table-responsive glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Update Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{o.username}</td>
                  <td>
                    {o.items.map(item => (
                      <div key={item.id} style={{fontSize: '0.85rem'}}>
                        {item.quantity}x {item.product_name}
                      </div>
                    ))}
                  </td>
                  <td>₹{o.total_amount.toFixed(2)}</td>
                  <td>
                    <span className="status-badge" style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textTransform: 'capitalize'}}>
                      {getStatusIcon(o.status)} {o.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="input-field" 
                      style={{padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto'}}
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td>{o.created_at.split(' ')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersView;