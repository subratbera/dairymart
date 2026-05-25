import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, ShoppingCart, Info, Check, ArrowUpDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Shop.css';

const fallbackProducts = [
  { id: 1, name: 'Fresh Whole Milk (1L)', price: 68.00, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', category: 'Milk' },
  { id: 2, name: 'Artisan Cheddar Cheese (200g)', price: 250.00, image_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80', category: 'Cheese' },
  { id: 3, name: 'Organic Greek Yogurt (500g)', price: 180.00, image_url: 'https://images.unsplash.com/photo-1488477181946-8968c7634416?w=500&q=80', category: 'Yogurt' },
  { id: 4, name: 'Salted Butter (500g)', price: 280.00, image_url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&q=80', category: 'Butter' },
  { id: 5, name: 'Paneer Block (250g)', price: 120.00, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80', category: 'Paneer' },
  { id: 6, name: 'Skimmed Milk (1L)', price: 60.00, image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80', category: 'Milk' },
  { id: 7, name: 'Mozzarella Cheese (200g)', price: 220.00, image_url: 'https://images.unsplash.com/photo-1533135091724-62ce79d05dce?w=500&q=80', category: 'Cheese' },
  { id: 8, name: 'Desi Ghee (1L)', price: 650.00, image_url: 'https://images.unsplash.com/photo-1614282367448-f68746c82092?w=500&q=80', category: 'Butter' },
  { id: 9, name: 'Flavored Milk - Chocolate (200ml)', price: 45.00, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', category: 'Milk' },
  { id: 10, name: 'Low Fat Yogurt (400g)', price: 110.00, image_url: 'https://images.unsplash.com/photo-1488477181946-8968c7634416?w=500&q=80', category: 'Yogurt' }
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const [isOffline, setIsOffline] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch products from our backend
    axios.get('http://127.0.0.1:5000/api/products')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
          setIsOffline(false);
        } else {
          setProducts(fallbackProducts);
          setIsOffline(true);
        }
      })
      .catch(err => {
        console.warn('Backend connection failed. Running in demo mode with fallback data.');
        setProducts(fallbackProducts);
        setIsOffline(true);
      });
  }, []);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    triggerToast(`Added ${product.name} to cart!`);
  };

  // Filter and Sort Logic
  const categories = ['All', 'Milk', 'Cheese', 'Yogurt', 'Butter', 'Paneer'];

  let filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (sortOption === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortOption === 'name-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="shop-container container animate-fade-in">
      {isOffline && (
        <div className="offline-banner glass flex-center">
          <Info size={18} className="banner-icon" />
          <span>Currently operating in <strong>Interactive Demo Mode</strong> (Backend server offline). All features are fully functional offline!</span>
        </div>
      )}

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
          <div className="sort-wrapper flex-center">
            <ArrowUpDown size={16} className="sort-icon" />
            <select 
              className="input-field sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured Products</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Badges */}
      <div className="category-container">
        {categories.map(category => (
          <button 
            key={category} 
            className={`category-pill glass ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
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
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products glass flex-center">
          <h3>No products match your search or filter options.</h3>
          <button className="btn btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear Filters</button>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification glass flex-center animate-fade-in">
          <div className="toast-icon-wrapper flex-center">
            <Check size={16} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Shop;
