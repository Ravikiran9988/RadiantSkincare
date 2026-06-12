# 🌟 RadiantSkincare - AI-Powered Personalized Skincare Platform

## 📌 Overview

RadiantSkincare is a full-stack AI-powered skincare platform designed to help users identify skin concerns, receive personalized skincare recommendations, track skincare routines, and get weather-aware skincare guidance.

The platform combines Machine Learning, Computer Vision, React, Node.js, and personalized recommendation systems to provide a smart skincare experience.

---

## 🚀 Features

### 🔍 AI Skin Analysis

* Upload facial skin images
* Analyze skin conditions using Machine Learning
* Detect common skin concerns
* Generate personalized skincare insights

### 🧴 Product Recommendation Engine

* Recommendations based on:

  * Skin Type
  * Skin Concerns
* Suggested skincare products
* Ingredients information
* Usage instructions
* Personalized skincare tips

### 🌦 Weather-Aware Skincare Assistant

* Real-time weather detection
* Geolocation support
* Climate-specific skincare recommendations
* Weather-based product suggestions
* Manual climate selection option

### 📋 Daily Routine Tracker

* Personalized skincare checklist
* Daily routine monitoring
* Progress tracking

### 📊 Analysis History

* View previous analyses
* Track skincare improvements
* Store historical results

### 👤 User Authentication

* User Registration
* Secure Login
* Protected Dashboard
* Profile Management

---

## 🏗 System Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Node.js / Express Backend
 │
 ├── Authentication Service
 ├── Dashboard Service
 ├── Product Recommendation Service
 └── Skin Analysis Service
          │
          ▼
     ML Models
          │
          ▼
      MongoDB
```

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* CSS3
* Axios

### Backend

* Node.js
* Express.js

### Machine Learning

* Python
* Image Processing Models
* Skin Disease Detection Models

### Database

* MongoDB

### APIs

* OpenWeather API
* Geolocation API

### Deployment

* Vercel
* Render / Node Server

---

## 📸 Screenshots

### Login Page

<img width="800" alt="Login Page" src="screenshots/login.png">

### Dashboard

<img width="800" alt="Dashboard" src="screenshots/dashboard.png">

### Skin Analysis

<img width="800" alt="Skin Analysis" src="screenshots/analysis.png">

### Product Recommendations

<img width="800" alt="Product Recommendations" src="screenshots/recommendation.png">

---

## 🔄 Workflow

### Skin Analysis

1. User logs in
2. Uploads skin image
3. Enters skin concerns
4. AI model analyzes image
5. Results are generated
6. Analysis is saved to history

### Product Recommendation

1. Select skin concern
2. Select skin type
3. Recommendation engine processes input
4. Personalized products are suggested

### Weather Recommendation

1. User location detected
2. Weather data fetched
3. Climate analyzed
4. Personalized skincare tips displayed

---

## 📂 Project Structure

```text
RadiantSkincare/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── models/
│
├── model1/
├── model2/
│
└── README.md
```

---

## ⚙ Installation

### Clone Repository

```bash
git clone https://github.com/Ravikiran9988/RadiantSkincare.git
cd RadiantSkincare
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENWEATHER_API_KEY=your_api_key
```

---

## 🎯 Key Learning Outcomes

* Full Stack Development
* REST API Design
* Authentication & Authorization
* Machine Learning Integration
* Image Upload Handling
* MongoDB Database Design
* Geolocation APIs
* Weather API Integration
* User Dashboard Development

---

## 🔮 Future Enhancements

* Mobile Application
* Deep Learning-Based Skin Classification
* Dermatologist Consultation Booking
* Multi-language Support
* AI Chat Assistant
* Product Purchase Integration
* Advanced Skin Health Analytics

---

## 👨‍💻 Author

### Medicharla Ravi Kiran

* GitHub: https://github.com/Ravikiran9988
* Portfolio: https://ravikiran9988.github.io/portfolio
* LinkedIn: Add your LinkedIn profile

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.
