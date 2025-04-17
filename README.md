# 🌆 CoolCity – Urban Heat Island Tracker & Mitigation Guide

CoolCity is a full-stack web application focused on **tracking Urban Heat Islands (UHIs)** and promoting awareness about **climate resilience strategies**. It features real-time UHI visualizations, informative content on heat mitigation techniques, and a feedback system to encourage citizen engagement.

## 🔥 Features

- 🗺️ **Interactive Heatmaps**
- 🧠 **Educational Content** on urban cooling strategies like:
  - Green Roofs
  - Reflective Pavements
  - Urban Tree Canopy
  - Urban Ventilation Corridors
- 📍 **Geolocation support** for real-time urban heat data
- 💬 **User Feedback** system (MongoDB + Express backend)
- 🌐 **Responsive UI** built with HTML, Tailwind CSS, and JavaScript

## 🚀 Tech Stack

### Frontend
- HTML5, Tailwind CSS
- CSS
- JavaScript

### Backend
- Node.js + Express.js
### Tools & APIs
- OpenStreetMap / Map tiles
- Geolocation API (Browser)
- OpenWeatherMap (optional for temperature overlays)


## 🛠️ Installation & Running Locally
```
# Clone the repository
git clone https://github.com/sheikhwasimuddin/CoolCity.git
cd CoolCity



# Open frontend (static HTML/JS/CSS)
# Just open index.html in your browser or serve with a local server like Live Server
```
📂 Project Structure

```
CoolCity/
├── assets/                  # Images and icons
├── components/              # Reusable JS components
├── pages/                   # Informational HTML pages (Green Roofs, Tree Canopy, etc.)
├── script.js                # Main logic for interaction and weather data
├── index.html               # Homepage (map + search)
├── styles/                  # Tailwind CSS files
├── server/                  # Express.js backend
│   ├── models/              # Mongoose models (Feedback, Users)
│   ├── routes/              # API routes
│   ├── controllers/         # Logic for endpoints
│   └── .env                 # Environment variables
```
✨ Upcoming Features
User accounts with saved locations

Admin dashboard to manage feedback

Heat trend analytics and charts (via Chart.js / Recharts)

🙌 Contributing
Pull requests are welcome! If you have suggestions, open an issue or fork the project and create a PR.


👨‍💻 Author
Sheikh Wasimuddin
Portfolio • GitHub


