async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Vui lòng nhập tên thành phố!");
    return;
  }

  try {
    const res = await fetch(`/weather?city=${city}`);
    const data = await res.json();

    if (data.error) {
      document.getElementById("weather").innerHTML =
        `<p style="color:red">${data.error}</p>`;
      return;
    }

    // Hiển thị thông tin thời tiết + icon
    document.getElementById("weather").innerHTML = `
      <h2>${data.city}</h2>
      <p><b>Nhiệt độ:</b> ${data.temperature}</p>
      <p><b>Thời tiết:</b> ${data.description}</p>
      <p><b>Độ ẩm:</b> ${data.humidity}</p>
      <p><b>Gió:</b> ${data.wind}</p>
      <img src="${data.icon}" alt="Weather icon" style="width:80px;height:80px;"/>
    `;

    // --- Vẽ bản đồ ---
    // Xóa map cũ nếu có
    if (window.myMap) {
      window.myMap.remove();
    }

    window.myMap = L.map("map").setView([data.lat, data.lon], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(window.myMap);

    L.marker([data.lat, data.lon]).addTo(window.myMap)
      .bindPopup(`<b>${data.city}</b><br>${data.description}`)
      .openPopup();

  } catch (err) {
    document.getElementById("weather").innerHTML =
      `<p style="color:red">Lỗi khi gọi API</p>`;
    console.error(error.response ? error.response.data : error.message);

  }
}
