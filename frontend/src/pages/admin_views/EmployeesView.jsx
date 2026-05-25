import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { Shield, ShieldAlert, Plus, X } from 'lucide-react';

const EmployeesView = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({ username: '', email: '', password: '' });
  const [addStatus, setAddStatus] = useState('');

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out regular customers so we only see staff/admins
      const staffMembers = res.data.filter(u => u.role === 'admin' || u.role === 'staff');
      setEmployees(staffMembers);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this employee's role to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating role');
    }
  };

  const handleUpdateShift = async (userId, newShift) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/shift`, 
        { shift: newShift },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating shift');
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setAddStatus('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/admin/employees`, newStaff, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewStaff({ username: '', email: '', password: '' });
      setShowAddForm(false);
      fetchEmployees();
    } catch (err) {
      setAddStatus(err.response?.data?.message || 'Error creating staff account');
    }
  };

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header flex-between">
        <div>
          <h2>Employee Directory</h2>
          <p className="text-muted">Manage staff roles, permissions, and shifts.</p>
        </div>
        <button className="btn btn-primary flex-center" style={{gap: '0.5rem'}} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add Staff</>}
        </button>
      </div>

      {showAddForm && (
        <div className="glass" style={{padding: '2rem', borderRadius: '16px', marginBottom: '2rem', animation: 'fadeIn 0.3s ease'}}>
          <h3 style={{marginBottom: '1rem'}}>Register New Staff Member</h3>
          {addStatus && <div className="auth-error" style={{marginBottom: '1rem'}}>{addStatus}</div>}
          <form onSubmit={handleAddStaff} style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end'}}>
            <div className="form-group" style={{marginBottom: '0'}}>
              <label>Username</label>
              <input 
                type="text" 
                className="input-field" 
                value={newStaff.username}
                onChange={e => setNewStaff({...newStaff, username: e.target.value})}
                required 
              />
            </div>
            <div className="form-group" style={{marginBottom: '0'}}>
              <label>Email</label>
              <input 
                type="email" 
                className="input-field" 
                value={newStaff.email}
                onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                required 
              />
            </div>
            <div className="form-group" style={{marginBottom: '0'}}>
              <label>Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={newStaff.password}
                onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                required 
              />
            </div>
            <button type="submit" className="btn btn-secondary">Create Account</button>
          </form>
        </div>
      )}
      <div className="table-responsive glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>System Role</th>
              <th>Shift</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="5">Loading employees...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="5">No staff members found.</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id}>
                  <td><strong>{emp.username}</strong></td>
                  <td>{emp.email}</td>
                  <td>
                    <div className="flex-center" style={{justifyContent: 'flex-start', gap: '0.5rem'}}>
                      {emp.role === 'admin' ? <ShieldAlert size={16} className="text-secondary" /> : <Shield size={16} className="text-primary" />}
                      <select 
                        className="input-field"
                        style={{padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto'}}
                        value={emp.role}
                        onChange={(e) => handleUpdateRole(emp.id, e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="customer">Revoke Access (Make Customer)</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <select 
                      className="input-field"
                      style={{padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto'}}
                      value={emp.shift || 'Morning'}
                      onChange={(e) => handleUpdateShift(emp.id, e.target.value)}
                    >
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${emp.is_blocked ? 'status-failed' : 'status-completed'}`}>
                      {emp.is_blocked ? 'Blocked' : 'Active'}
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
export default EmployeesView;