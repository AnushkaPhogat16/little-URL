import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { Link2, Download, Copy, CheckCircle, ExternalLink, Sparkles, BarChart3 } from 'lucide-react';

const Home = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shortenUrl = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/urls/shorten', {
        originalUrl: url,
        userId: localStorage.getItem('token') || 'anonymous'
      });
      
      const qrCode = await QRCode.toDataURL(res.data.shortUrl);
      setResult({...res.data, qrCode});
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = result.qrCode;
    link.click();
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-header">
          <div className="sparkle-icon">
            <Sparkles size={32} />
          </div>
          <h1 className="hero-title">
            Shorten Your URLs
            <span className="title-accent">Instantly</span>
          </h1>
          <p className="hero-subtitle">
            Transform long, complex URLs into short, shareable links with beautiful QR codes
          </p>
        </div>
        
        <div className="url-container">
          <form onSubmit={shortenUrl} className="url-form">
            <div className="input-group">
              <div className="input-wrapper">
                <Link2 size={20} className="input-icon" />
                <input
                  type="url"
                  placeholder="Enter your long URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="url-input"
                />
              </div>
              <button type="submit" disabled={loading} className="shorten-btn">
                <div className="btn-content">
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Shortening...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={18} />
                      <span>Shorten URL</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {result && (
            <div className="result-container">
              <div className="result-header">
                <h3 className="result-title">Your shortened URL is ready!</h3>
              </div>
              
              <div className="short-url-card">
                <div className="url-display">
                  <Link2 size={20} className="url-icon" />
                  <span className="short-url-text">{result.shortUrl}</span>
                  <button 
                    onClick={() => copyToClipboard(result.shortUrl)} 
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
              
              <div className="qr-section">
                <div className="qr-header">
                  <h4 className="qr-title">QR Code</h4>
                  <p className="qr-subtitle">Scan to open the link</p>
                </div>
                <div className="qr-card">
                  <div className="qr-image-wrapper">
                    <img src={result.qrCode} alt="QR Code" className="qr-image" />
                  </div>
                  <button onClick={downloadQR} className="download-btn">
                    <Download size={16} />
                    <span>Download QR Code</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Link2 size={24} />
            </div>
            <h3>Instant Shortening</h3>
            <p>Generate short URLs in milliseconds</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Download size={24} />
            </div>
            <h3>QR Codes</h3>
            <p>Automatic QR code generation for every link</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={24} />
            </div>
            <h3>Analytics</h3>
            <p>Track clicks and monitor performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;