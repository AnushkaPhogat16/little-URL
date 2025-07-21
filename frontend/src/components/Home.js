import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode';
import { Link2, Download, Copy } from 'lucide-react';

const Home = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const shortenUrl = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/urls/shorten', {
        originalUrl: url,
        userId: localStorage.getItem('token') ? 'user' : 'anonymous'
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
        <h1>Shorten Your URLs</h1>
        <p>Create short links and QR codes instantly</p>
        
        <form onSubmit={shortenUrl} className="url-form">
          <input
            type="url"
            placeholder="Enter your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>

        {result && (
          <div className="result">
            <div className="short-url">
              <Link2 size={20} />
              <span>{result.shortUrl}</span>
              <button onClick={() => copyToClipboard(result.shortUrl)}>
                <Copy size={16} />
              </button>
            </div>
            
            <div className="qr-section">
              <img src={result.qrCode} alt="QR Code" />
              <button onClick={downloadQR} className="download-btn">
                <Download size={16} /> Download QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;