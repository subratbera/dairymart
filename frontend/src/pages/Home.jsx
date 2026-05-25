import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Home.css';

const fallbackRecommendations = [
  { id: 1, name: 'Fresh Whole Milk (1L)', price: 68.00, image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80', category: 'Milk' },
  { id: 2, name: 'Artisan Cheddar Cheese (200g)', price: 250.00, image_url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&q=80', category: 'Cheese' },
  { id: 3, name: 'Organic Greek Yogurt (500g)', price: 180.00, image_url: 'https://images.unsplash.com/photo-1488477181946-8968c7634416?w=500&q=80', category: 'Yogurt' },
  { id: 8, name: 'Desi Ghee (1L)', price: 650.00, image_url: 'https://images.unsplash.com/photo-1614282367448-f68746c82092?w=500&q=80', category: 'Butter' }
];

const Home = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch recommendations from our Flask API
    axios.get('http://127.0.0.1:5000/api/ai/recommendations')
      .then(res => {
        if (res.data && res.data.recommendations && res.data.recommendations.length > 0) {
          setRecommendations(res.data.recommendations);
        } else {
          setRecommendations(fallbackRecommendations);
        }
      })
      .catch(err => {
        console.warn('AI recommendations service offline. Running in demo mode with local recommendations.');
        setRecommendations(fallbackRecommendations);
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

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Fresh Dairy, <br/><span className="text-gradient">Smart Choices.</span></h1>
            <p className="hero-subtitle">
              Experience the future of dairy shopping with our AI-powered recommendations and fresh farm-to-table products.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={20} />
              </Link>
              <button className="btn btn-secondary" onClick={() => document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' })}>
                Our Story
              </button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="blob-bg"></div>
            {/* Placeholder for hero image */}
            <div className="glass hero-card">
              <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Fresh Milk" className="hero-img" />
              <div className="floating-badge glass">
                <Star size={16} fill="var(--accent)" color="var(--accent)" />
                <span>AI Recommended</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="container" style={{padding: '5rem 0'}}>
        <div className="glass" style={{padding: '4rem', borderRadius: '24px', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap'}}>
          <div style={{flex: '1 1 400px'}}>
            <img 
              src="/our-story.png" 
              alt="Dairy Mart Interior" 
              style={{width: '100%', borderRadius: '16px', objectFit: 'cover', height: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}} 
            />
          </div>
          <div style={{flex: '1 1 400px'}}>
            <h2 className="section-title" style={{marginBottom: '1.5rem', textAlign: 'left'}}>Real Milk, <span className="text-gradient">Real People</span></h2>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.1rem'}}>
              It all started with a simple belief: milk should taste like milk. Not watered down, not sitting on a shelf for weeks, but fresh, creamy, and wholesome. At DairyMart, we work directly with local, family-owned farms who care as deeply about their cows as we do about our customers.
            </p>
            <p style={{color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem'}}>
              We don't use fancy jargon—just good old-fashioned hard work paired with modern technology to make sure your groceries are delivered fast and fresh. From our rich, hand-churned butter to our daily fresh milk, every product we sell is something we proudly feed our own families.
            </p>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="recommendations container">
        <h2 className="section-title">Recommended For You</h2>
        <p className="section-subtitle">Curated by our smart AI based on your preferences</p>
        
        <div className="product-grid">
          {recommendations.length > 0 ? (
            recommendations.map(product => (
              <div key={product.id} className="product-card glass">
                <div className="card-img-wrapper">
                  <img src={product.image_url || 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'} alt={product.name} />
                </div>
                <div className="card-body">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                  <button className="btn btn-primary w-full" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                </div>
              </div>
            ))
          ) : (
            // Dummy loading skeleton
            Array.from({length: 4}).map((_, idx) => (
              <div key={idx} className="product-card glass skeleton">
                <div className="skeleton-img"></div>
                <div className="skeleton-text title"></div>
                <div className="skeleton-text price"></div>
              </div>
            ))
          )}
        </div>
      </section>

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

export default Home;
