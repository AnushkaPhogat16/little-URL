import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Eye, Calendar, Link2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ urls: [], totalClicks: 0, totalUrls: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/urls/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <Link2 size={24} />
          <div>
            <h3>{stats.totalUrls}</h3>
            <p>Total URLs</p>
          </div>
        </div>
        
        <div className="stat-card">
          <Eye size={24} />
          <div>
            <h3>{stats.totalClicks}</h3>
            <p>Total Clicks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <BarChart3 size={24} />
          <div>
            <h3>{(stats.totalClicks / stats.totalUrls || 0).toFixed(1)}</h3>
            <p>Avg Clicks</p>
          </div>
        </div>
      </div>

      <div className="urls-list">
        <h2>Your URLs</h2>
        {stats.urls.map(url => (
          <div key={url._id} className="url-item">
            <div className="url-info">
              <h3>{url.originalUrl}</h3>
              <p>{url.shortUrl}</p>
            </div>
            <div className="url-stats">
              <span><Eye size={16} /> {url.clicks}</span>
              <span><Calendar size={16} /> {new Date(url.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;