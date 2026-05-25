import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertTriangle } from 'lucide-react';

const InventoryView = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:5000/api/admin/inventory', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInventory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header">
        <h2>Inventory Control</h2>
        <p className="text-muted">Supplier management and stock expiry tracking.</p>
      </div>
      <div className="table-responsive glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Supplier</th>
              <th>Last Restocked</th>
              <th>Expiry Alert</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5">Loading inventory...</td></tr>
            ) : inventory.length === 0 ? (
              <tr><td colSpan="5">No inventory found.</td></tr>
            ) : (
              inventory.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.supplier}</td>
                  <td>{item.lastRestocked}</td>
                  <td>{item.expiry}</td>
                  <td>
                    <span className={`status-badge ${item.status === 'Low Stock' ? 'status-failed' : 'status-completed'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default InventoryView;
