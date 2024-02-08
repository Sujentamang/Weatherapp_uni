/**
 Student name: Sujen Tamang
 Student id: 2407704
 */
function getWeather() {
  const APIkey = "64fad0569c784e6fd2f00d51382ed513";
  let cityname = document.getElementById("inputCity").value || "Balurghat";

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      updateWeather(data);
    })
    .catch((error) => {
      console.log("Error fetching weather data", error.message);
      alert("Error fetching weather data, please try again.");
    });

  fetch(
    `http://localhost/Weather%20app/app/Sujen_Tamang_2407704.php?cityname=${cityname}`,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((res) => res.json())
    .then((previousdata) => {
      previousdata = previousdata.reverse();
      console.log(previousdata);
      pastData(previousdata);
    })
    .catch((error) => {
      console.log("Error fetching past seven days data", error.message);
      alert("Error fetching past seven days data, please try again.");
    });

  function updateWeather(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById("weatherIcon").src = iconUrl;

    // //to change date and time to readable form
    const newdate = data.dt;
    const date = new Date(newdate * 1000);
    const month = date.getMonth();
    const lastestDate = date.getUTCDate();
    const day = date.getDay();
    const hour = date.getUTCHours();
    const hoursIn12hrFormat = hour >= 13 ? "PM" : "AM";
    const minutes = date.getUTCMinutes();

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Api",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const newsunrise = data.sys.sunrise;
    const sunrisedate = new Date(newsunrise * 1000);
    const sunrisehour = sunrisedate.getHours();
    const sunrisehoursIn12hrFormat =
      sunrisehour >= 13 ? sunrisehour % 12 : sunrisehour;
    const sunrisehoursAMPM = sunrisehour >= 13 ? "PM" : "AM";
    const sunriseminutes = sunrisedate.getMinutes();

    const newsunset = data.sys.sunset;
    const sunsetdate = new Date(newsunset * 1000);
    const sunsethour = sunsetdate.getHours();
    const sunsethoursIn12hrFormat =
      sunsethour >= 13 ? sunsethour % 12 : sunsethour;
    const sunsethoursAMPM = sunsethour >= 13 ? "PM" : "AM";
    const sunsetminutes = sunsetdate.getMinutes();

    document.getElementById("date").innerHTML =
      days[day] +
      "," +
      lastestDate +
      " " +
      months[month] +
      " " +
      date.getFullYear();

    document.getElementById("city").innerText = cityname;
    document.getElementById("status").innerText = data.weather[0].description;
    document.getElementById("temp").innerText =
      Math.round(data.main.temp) + " °C";
    document.getElementById("humidity").innerText = data.main.humidity + " %";
    document.getElementById("feelslike").innerText =
      Math.round(data.main.feels_like) + " °C";
    document.getElementById("wind").innerText = data.wind.speed + " Km/hr";
    document.getElementById("visuality").innerText =
      data.visibility / 1000 + " Km";
    document.getElementById("sunrise").innerText =
      sunrisehoursIn12hrFormat + ":" + sunriseminutes + " " + sunrisehoursAMPM;
    document.getElementById("sunset").innerText =
      sunsethoursIn12hrFormat + ":" + sunsetminutes + " " + sunsethoursAMPM;
    document.getElementById("time").innerText =
      hour + ":" + minutes + " " + hoursIn12hrFormat;
  }

  function pastData(previousdata) {
    const pastdata = document.querySelector(".weekdays");
    while (pastdata.lastChild) {
      pastdata.removeChild(pastdata.firstChild);
    }
    document.getElementById("7DaysForecast").innerHTML =
      "7 Days Past weather of " + cityname;
    for (let i = 0; i < previousdata.length; i++) {
      const iconCode = previousdata[i].imgcode;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
      const datacontainer = document.createElement("div");
      datacontainer.classList.add("week");

      datacontainer.innerHTML = `
            <img class="weekImg" src="${iconUrl}" height="100">
            <span class="cityDays"> ${previousdata[i].Day_of_Week}</span> <br>
            <span> <i class="fa-solid fa-temperature-half"></i> &nbsp; ${previousdata[i].temperature} &#176;C</span><br>
            <span> <i class="fa-solid fa-droplet"></i> &nbsp; ${previousdata[i].humidity} %</span><br>
            <span><i class="fa-solid fa-wind"></i> &nbsp; ${previousdata[i].windspeed} km/hr</span><br>
        `;
      pastdata.appendChild(datacontainer);
    }
  }
}
getWeather();
