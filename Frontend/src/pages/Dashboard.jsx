import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({ skinIssues: '', image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [disease, setDisease] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [routineChecklist, setRoutineChecklist] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [weatherTip, setWeatherTip] = useState('');
  const [weatherProducts, setWeatherProducts] = useState([]);
  const [manualClimate, setManualClimate] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [productForm, setProductForm] = useState({ concern: '', skin_type: '' });
  const [productRecommendation, setProductRecommendation] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/dashboard/data', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        const data = await res.json();
        setRoutineChecklist(data.routineChecklist || []);
        setAnalysisHistory(data.analysisHistory || []);
        setUserInfo(data.user || {});
      } catch (err) {
        console.error('Error loading dashboard data:', err.message);
      }
    };

    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5004/options');
        setConcerns(response.data.concerns);
        setSkinTypes(response.data.skin_types);
      } catch (err) {
        console.error('Failed to fetch product form options:', err.message);
      }
    };

    if (token) fetchDashboardData();
    fetchOptions();
    fetchWeather();
  }, [token]);

  const fetchWeather = async () => {
    try {
      if (!navigator.geolocation) {
        setWeatherTip('Geolocation not supported. Please select climate manually.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const { latitude, longitude } = coords;
          const apiKey = '23bfad4463c848daa6ef9b170f98efa0';
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          );
          if (!res.ok) throw new Error('Failed to fetch weather data');
          const data = await res.json();
          const { temp, humidity } = data.main;
          const condition = data.weather[0].main.toLowerCase();
          generateWeatherTips(condition, temp, humidity);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setWeatherTip('Unable to fetch location. Please select climate manually.');
        }
      );
    } catch (err) {
      console.error('Weather fetch error:', err);
      setWeatherTip('Weather data unavailable. Please select climate manually.');
    }
  };

  const generateWeatherTips = (condition, temp = 25, humidity = 50) => {
    let tip = '';
    let products = [];

    if (condition.includes('rain') || condition.includes('humid') || humidity > 75) {
      tip = 'It’s humid! Use lightweight, non-comedogenic products.';
      products = ['Oil-Free Moisturizer by NeutroCare', 'Mattifying Sunscreen by ClearSkin'];
    } else if (condition.includes('clear') || condition.includes('sunny') || temp > 30) {
      tip = 'It’s sunny! Don’t skip broad-spectrum sunscreen and hydration.';
      products = ['SPF 50 Sunscreen by SunSafe', 'Hydrating Mist by AquaDerm'];
    } else if (condition.includes('cold') || temp < 15) {
      tip = 'It’s cold! Use thick moisturizers and lip balms.';
      products = ['Deep Nourish Cream by DermaCozy', 'SPF Lip Balm by GlowFix'];
    } else {
      tip = 'Mild weather today. Maintain a balanced skincare routine.';
      products = ['Gentle Cleanser by PureGlow', 'Daily Moisturizer by DermaBalance'];
    }

    setWeatherTip(tip);
    setWeatherProducts(products);
  };

  const handleManualClimate = (e) => {
    e.preventDefault();
    if (manualClimate.trim()) {
      generateWeatherTips(manualClimate.toLowerCase());
    }
  };

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (file) => {
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleProductInputChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const toggleChecklist = async (index) => {
    const updated = [...routineChecklist];
    updated[index].done = !updated[index].done;
    setRoutineChecklist(updated);
    try {
      await fetch('http://localhost:5000/api/dashboard/update-checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ checklist: updated }),
      });
    } catch (err) {
      console.error('Checklist update failed:', err.message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(disease).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
skinIssues, image } = form;
    if (!skinIssues || !image) {
      alert('Please fill in skin issues and upload an image.');
      return;
    }

    if (!token) {
      alert('You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('skinIssues', skinIssues);
    formData.append('image', image);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5003/api/submit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setResponseMsg(data.message || 'Analysis complete.');

      if (res.ok) {
        setDisease(data.disease || 'No disease identified');
        const newEntry = {
          skinIssues,
          result: data.disease || 'No disease identified',
        };
        setAnalysisHistory((prev) => [...prev, newEntry]);

        await fetch('http://localhost:5000/api/dashboard/add-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ entry: newEntry }),
        });
      } else {
        setDisease('');
      }
    } catch (err) {
      console.error('Submit error:', err.message);
      setResponseMsg('An error occurred during submission.');
      setDisease('');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const { concern, skin_type } = productForm;
    if (!concern || !skin_type) {
      alert('Please select both a skin concern and skin type.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5004/', productForm, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setProductRecommendation(response.data);
    } catch (err) {
      console.error('Product recommendation error:', err.message);
      alert('Failed to get product recommendation. Please try again.');
      setProductRecommendation(null);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {userInfo?.username || 'User'}!</h1>
      <p>Get customized skincare insights and tools.</p>

      {/* Skin Analysis Form */}
      <form onSubmit={handleSubmit} className="dashboard-form">
        <label>
          Skin Issues:
          <input
            type="text"
            name="skinIssues"
            value={form.skinIssues}
            onChange={handleInputChange}
            placeholder="e.g., acne, redness"
            required
          />
        </label>

        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e.target.files[0])} required />
        </label>

        {preview && (
          <div className="image-preview-zoom">
            <img src={preview} alt="Skin Preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze My Skin'}
        </button>
      </form>

      {/* Result & Disease */}
      {responseMsg && (
        <div className="result-section">
          <h2>Analysis Result</h2>
          <p>{responseMsg}</p>
          {disease && (
            <div className="disease">
              <h3>Disease:</h3>
              <p>{disease}</p>
              <button onClick={copyToClipboard}>Copy</button>
              {copySuccess && <span className="copy-success">{copySuccess}</span>}
            </div>
          )}
        </div>
      )}

      {/* Product Recommendation Form */}
      <div className="product-recommendation-section">
        <h2>Get Product Recommendation</h2>
        <form onSubmit={handleProductSubmit} className="dashboard-form">
          <label>
            Skin Concern:
            <select
              name="concern"
              value={productForm.concern}
              onChange={handleProductInputChange}
              required
            >
              <option value="">Select</option>
              {concerns.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            Skin Type:
            <select
              name="skin_type"
              value={productForm.skin_type}
              onChange={handleProductInputChange}
              required
            >
              <option value="">Select</option>
              {skinTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <button type="submit">Get Recommendation</button>
        </form>

        {productRecommendation && (
          <div className="product-recommendation-result">
            <h3>Recommended Product</h3>
            <p><strong>Product:</strong> {productRecommendation.product_name}</p>
            <p><strong>Ingredients:</strong> {productRecommendation.ingredients}</p>
            <p><strong>How to Use:</strong> {productRecommendation.how_to_use}</p>
            <p><strong>Tips:</strong> {productRecommendation.tips}</p>
          </div>
        )}
      </div>

      {/* Dashboard Extras */}
      <div className="extra-sections">
        <div className="manual-climate-input">
          <h3>Choose Climate Manually</h3>
          <form onSubmit={handleManualClimate}>
            <select value={manualClimate} onChange={(e) => setManualClimate(e.target.value)} required>
              <option value="">Select climate</option>
              <option value="sunny">Sunny</option>
              <option value="rainy">Rainy</option>
              <option value="humid">Humid</option>
              <option value="cold">Cold</option>
              <option value="mild">Mild</option>
            </select>
            <button type="submit">Apply</button>
          </form>
        </div>

        <div className="products-suggest">
          <h3>Weather-Based Products</h3>
          <ul>
            {weatherProducts.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="weather-tip">
          <h3>Weather-Based Tip</h3>
          <p>{weatherTip}</p>
        </div>

        <div className="routine-checklist">
          <h3>Your Routine</h3>
          <ul>
            {routineChecklist.map((item, index) => (
              <li key={index}>
                <input type="checkbox" checked={item.done} onChange={() => toggleChecklist(index)} />
                {item.step}
              </li>
            ))}
          </ul>
        </div>

        <div className="analysis-history">
          <h3>AI Analysis History</h3>
          <ul>
            {analysisHistory.map((entry, index) => (
              <li key={index}>
                {entry.skinIssues} ➜ {entry.result}
              </li>
            ))}
          </ul>
        </div>

        <div className="profile-actions">
          <h3>Account Settings</h3>
          <button onClick={() => navigate('/Profile')}>Go to Profile & Settings</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;