import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch products from our backend
    axios.get('http://127.0.0.1:5000/api/products')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          // Fallback dummy data if backend is empty (INR Prices)
          setProducts([
            { id: 1, name: 'Fresh Whole Milk (1L)', price: 68.00, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', category: 'Milk' },
            { id: 2, name: 'Artisan Cheddar Cheese (200g)', price: 250.00, image_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&q=80', category: 'Cheese' },
            { id: 3, name: 'Organic Greek Yogurt (500g)', price: 180.00, image_url: 'https://images.unsplash.com/photo-1488477181946-8968c7634416?w=300&q=80', category: 'Yogurt' },
            { id: 4, name: 'Salted Butter (500g)', price: 280.00, image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&q=80', category: 'Butter' },
            { id: 5, name: 'Paneer Block (250g)', price: 120.00, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&q=80', category: 'Paneer' },
            { id: 6, name: 'Skimmed Milk (1L)', price: 60.00, image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80', category: 'Milk' },
            { id: 7, name: 'Mozzarella Cheese (200g)', price: 220.00, image_url: 'https://images.unsplash.com/photo-1533135091724-62ce79d05dce?w=300&q=80', category: 'Cheese' },
            { id: 8, name: 'Desi Ghee (1L)', price: 650.00, image_url: 'https://images.unsplash.com/photo-1614282367448-f68746c82092?w=300&q=80', category: 'Butter' },
            { id: 9, name: 'Flavored Milk - Chocolate (200ml)', price: 45.00, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80', category: 'Milk' },
            { id: 10, name: 'Low Fat Yogurt (400g)', price: 110.00, image_url: 'https://images.unsplash.com/photo-1488477181946-8968c7634416?w=300&q=80', category: 'Yogurt' }
          ]);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="shop-container container animate-fade-in">
      <div className="shop-header flex-between">
        <h1 className="page-title">Dairy Shop</h1>
        <div className="shop-controls flex-center">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="icon-btn filter-btn">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card glass">
            <div className="card-img-wrapper">
              <img src={product.image_url} alt={product.name} />
              <div className="category-badge">{product.category}</div>
            </div>
            <div className="card-body">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₹{product.price.toFixed(2)}</p>
              <button 
                className="btn btn-primary w-full add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
