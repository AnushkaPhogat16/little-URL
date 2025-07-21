import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Eye, Calendar, Link2, ExternalLink, Copy, CheckCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ urls: [], totalClicks: 0, totalUrls: 0 });
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-icon">
          <BarChart3 size={32} />
        </div>
        <h1 className="dashboard-title">
          Your Dashboard
          <span className="dashboard-subtitle">Track and manage your shortened URLs</span>
        </h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Link2 size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalUrls}</h3>
            <p className="stat-label">Total URLs</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Eye size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalClicks}</h3>
            <p className="stat-label">Total Clicks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{(stats.totalClicks / stats.totalUrls || 0).toFixed(1)}</h3>
            <p className="stat-label">Avg Clicks</p>
          </div>
        </div>
      </div>

      <div className="urls-section">
        <div className="section-header">
          <h2 className="section-title">Your URLs</h2>
          <p className="section-subtitle">Manage and track your shortened links</p>
        </div>
        
        {stats.urls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Link2 size={48} />
            </div>
            <h3 className="empty-title">No URLs yet</h3>
            <p className="empty-description">
              Start by creating your first shortened URL on the home page
            </p>
          </div>
        ) : (
          <div className="urls-list">
            {stats.urls.map(url => (
              <div key={url._id} className="url-card">
                <div className="url-main">
                  <div className="url-icon">
                    <Link2 size={20} />
                  </div>
                  <div className="url-content">
                    <div className="url-original">
                      <h3 className="url-title">{url.originalUrl}</h3>
                    </div>
                    <div className="url-short-display">
                      <span className="url-short">{url.shortUrl}</span>
                      <button 
                        onClick={() => copyToClipboard(url.shortUrl, url._id)} 
                        className={`url-copy-btn ${copiedId === url._id ? 'copied' : ''}`}
                      >
                        {copiedId === url._id ? <CheckCircle size={14} /> : <Copy size={14} />}
                        <span>{copiedId === url._id ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="url-stats">
                  <div className="url-stat">
                    <Eye size={16} />
                    <span>{url.clicks} clicks</span>
                  </div>
                  <div className="url-stat">
                    <Calendar size={16} />
                    <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                  </div>
                  <button 
                    className="url-visit-btn"
                    onClick={() => window.open(url.shortUrl, '_blank')}
                  >
                    <ExternalLink size={14} />
                    <span>Visit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;