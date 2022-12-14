import { showContainer, showFirstUse } from './hideUtil.js';

let username = localStorage.getItem("username");
if (!username) {
  showFirstUse();
} else {
  showContainer(username);
}

let usernameInput = document.querySelector("#usernameInput");
usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    username = usernameInput.value;
    localStorage.setItem("username", username);
    showFirstUse(false);
    showContainer(username);
  }
});

// 시간, 날씨 정보 가져오기
setInterval(function () {
  let date = new Date();
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");

  document.querySelector("#hours").innerHTML = hours;
  document.querySelector("#minutes").innerHTML = minutes;
}, 1000);


function getLocationWeather() {
  if (navigator.geolocation) {
    // GPS를 지원하면
    navigator.geolocation.getCurrentPosition(
      function (position) { //success
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeather(latitude, longitude);
      },
      function (error) { //error
        console.error(error);
      },
      { //options
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity,
      }
    );
  } else {
    alert("GPS를 지원하지 않습니다");
  }
}

function getWeather(lat, lon){
  let key = `1eef797b323a1e22bb5dfee486c644f8`;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;


  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    document.querySelector("#temperature").innerHTML = data.main.temp;
    document.querySelector("#location").innerHTML = data.name;
  });
}

getLocationWeather();