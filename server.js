const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 3000;

// 🔑 API Key (thay bằng key của bạn)
const API_KEY = "da4eb804834ad33d926e05e6abdf7d31";

// ⚡ Cho phép phục vụ file tĩnh (index.html, style.css, index.js)
app.use(express.static(__dirname));

// Route API thời tiết
app.get("/weather", async (req, res) => {
  const city = req.query.city || "Hanoi";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    res.json({
      city: data.name,
      temperature: data.main.temp + "°C",
      description: data.weather[0].description,
      humidity: data.main.humidity + "%",
      wind: data.wind.speed + " m/s",
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      lat: data.coord.lat,
      lon: data.coord.lon,
    });
  } catch (error) {
    console.error("❌ Lỗi API:", error.response?.data || error.message);
    res.status(500).json({ error: "Không lấy được dữ liệu thời tiết" });
  }
});

// Route chính: trả về index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
