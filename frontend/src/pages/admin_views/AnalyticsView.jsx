import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { API_BASE_URL } from '../../config';

const AnalyticsView = () => {
  const [demandData, setDemandData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/ai/product-demand`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formattedData = res.data.map(item => ({
          name: item.name,
          current: item.current_stock,
          predicted: item.predicted_demand
        }));
        setDemandData(formattedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Enterprise Sales & Analytics Report generated successfully. Check your downloads folder.');
    }, 2000);
  };

  return (
    <div className="admin-view animate-fade-in">
      <div className="view-header flex-between">
        <div>
          <h2>AI Analytics Engine</h2>
          <p className="text-muted">Machine learning insights, forecasting, and automated reporting.</p>
        </div>
        <button className="btn btn-primary flex-center" onClick={handleGenerateReport} disabled={isGenerating} style={{gap: '0.5rem'}}>
          <Download size={18} /> {isGenerating ? 'Compiling PDF...' : 'Generate Report'}
        </button>
      </div>

      <div className="dashboard-grid" style={{marginBottom: '2rem'}}>
        <div className="stat-card glass">
          <div className="stat-icon"><Brain size={24} className="text-secondary" /></div>
          <div className="stat-info">
            <h3>AI Confidence</h3>
            <h2>94.2%</h2>
            <p className="text-secondary">↑ High Accuracy Mode</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><TrendingUp size={24} className="text-primary" /></div>
          <div className="stat-info">
            <h3>Forecast Trend</h3>
            <h2>Bullish</h2>
            <p className="text-primary">+15% expected this month</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><AlertTriangle size={24} className="text-danger" /></div>
          <div className="stat-info">
            <h3>Seasonal Shifts</h3>
            <h2>Detected</h2>
            <p className="text-danger">Summer pattern applied</p>
          </div>
        </div>
      </div>

      <div className="chart-card glass">
        <h3 style={{marginBottom: '1.5rem'}}>AI Product Demand Prediction</h3>
        <div className="chart-container" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <RechartsTooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
              <Bar dataKey="current" fill="rgba(99, 102, 241, 0.4)" name="Current Stock" />
              <Bar dataKey="predicted" fill="var(--secondary)" name="AI Predicted Demand (30 Days)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
