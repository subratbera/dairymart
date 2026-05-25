import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserX, UserCheck, Shield, Mail, Phone, Calendar } from 'lucide-react';

const CustomersView = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5000/api/admin/users/${userId}/block`, 
        { is_blocked: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status');
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:5000/api/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header">
        <h2>Customer Management</h2>
        <p className="text-muted">View all registered users and manage their access to DairyMart.</p>
      </div>

      {isLoading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="table-responsive glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{fontWeight: 'bold', color: 'var(--text-main)'}}>{u.username}</div>
                  </td>
                  <td>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                      <div className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem'}}><Mail size={12}/> {u.email}</div>
                      {u.phone_number && <div className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', marginTop: '4px'}}><Phone size={12}/> {u.phone_number}</div>}
                    </div>
                  </td>
                  <td>
                    <span className="flex-center" style={{justifyContent: 'flex-start', gap: '0.25rem'}}>
                      {u.role === 'admin' ? <Shield size={14} className="text-secondary" /> : null}
                      <select 
                        className="input-field"
                        style={{padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto'}}
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </span>
                  </td>
                  <td>
                    <div className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem', fontSize: '0.9rem'}}>
                      <Calendar size={14} /> {u.created_at.split(' ')[0]}
                    </div>
                  </td>
                  <td>
                    {u.is_blocked ? (
                      <span className="status-badge status-failed">Blocked</span>
                    ) : (
                      <span className="status-badge status-completed">Active</span>
                    )}
                  </td>
                  <td>
                    {u.role !== 'admin' && (
                      <button 
                        className={`btn ${u.is_blocked ? 'btn-outline' : 'btn-danger'} flex-center`} 
                        style={{padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.25rem'}}
                        onClick={() => handleToggleBlock(u.id, u.is_blocked)}
                      >
                        {u.is_blocked ? <><UserCheck size={14}/> Unblock</> : <><UserX size={14}/> Block</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomersView;
