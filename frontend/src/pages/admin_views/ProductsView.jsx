import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import './AdminViews.css'; // Shared CSS for all admin views

const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', category: '', image_url: '', description: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name, price: product.price, stock: product.stock,
        category: product.category, image_url: product.image_url || '', description: product.description || ''
      });
    } else {
      setFormData({name: '', price: '', stock: '', category: '', image_url: '', description: ''});
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const payload = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock, 10) };

    try {
      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/api/products/${editingProduct.id}`, payload, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, payload, { headers });
      }
      fetchProducts();
      handleCloseModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header flex-between">
        <div>
          <h2>Product Inventory</h2>
          <p className="text-muted">Manage your catalog, stock, and pricing.</p>
        </div>
        <button className="btn btn-primary flex-center" onClick={() => handleOpenModal()} style={{gap: '0.5rem'}}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className="table-responsive glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="flex-center" style={{gap: '1rem', justifyContent: 'flex-start'}}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px'}} />
                      ) : (
                        <div style={{width: '40px', height: '40px', background: 'var(--glass-border)', borderRadius: '4px'}}></div>
                      )}
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${p.stock < 10 ? 'status-failed' : 'status-completed'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn text-primary" onClick={() => handleOpenModal(p)}><Edit2 size={18} /></button>
                      <button className="icon-btn text-danger" onClick={() => handleDelete(p.id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay flex-center">
          <div className="modal-content glass animate-fade-in" style={{maxWidth: '500px', width: '100%'}}>
            <div className="modal-header flex-between" style={{marginBottom: '1.5rem'}}>
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="icon-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="flex-between" style={{gap: '1rem'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Price (₹)</label>
                  <input type="number" step="0.01" className="input-field" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Stock</label>
                  <input type="number" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input type="text" className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" className="input-field" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary w-full" style={{marginTop: '1rem'}}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsView;