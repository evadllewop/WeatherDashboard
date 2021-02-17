$(document).ready(function () {
  $("#citySearch").on("click", function () {
    const cityName = $("#cityName").val().trim();
    $("#cityName").val("");
    currentWeather(cityName);
  });

  function currentWeather(cityName) {
    const APIKey = "d3d059dd73667f9df01c09fb652df11b";

    $.ajax(
      {
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey,
      })
      .then(function (data) {

        if (history.indexOf(cityName) === -1) {
          history.push(cityName);
          window.localStorage.setItem("history", JSON.stringify(history));
          searchHistory(cityName);
        }

        $("#current").empty();

        const windEl = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        const humidityEl = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        const tempEl = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        const iconEl = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        const titleEl = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        const cardBody = $("<div>").addClass("card-body");
        const cardEl = $("<div>").addClass("card");

        titleEl.append(iconEl);
        cardBody.append(titleEl, tempEl, humidityEl, windEl);
        cardEl.append(cardBody);
        $("#current").append(cardEl);
      });
  };

  //  HISTORY AND LOCAL STORAGE
  $(".history").on("click", "li", function () {
    currentWeather($(this).text());
  });

  function searchHistory(str) {
    const li = $("<li>").addClass("list-group-item list-group-item-action").text(str);
    $(".history").append(li);
  }

  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    currentWeather(history[history.length - 1]);
  }

  for (var i = 0; i < history.length; i++) {
    searchHistory(history[i]);
  }
});
