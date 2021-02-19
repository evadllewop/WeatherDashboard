$(document).ready(function () {
  $("#citySearch").on("click", function () {
    const cityName = $("#cityName").val().trim();
    $("#cityName").val("");
    currentWeather(cityName);
  });

  function searchHistory(city) {
    const li = $("<li>").addClass("list-group-item list-group-item-action").text(city);
    $(".cities").append(li);
  }

  // CURRENT WEATHER
  function currentWeather(cityName) {
    const APIKey = "d3d059dd73667f9df01c09fb652df11b";

    $.ajax(
      {
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey,
      })
      .then(function (data) {

        if (cities.indexOf(cityName) === -1) {
          cities.push(cityName);
          window.localStorage.setItem("cities", JSON.stringify(cities));
          searchHistory(cityName);
        }

        $("#current").empty();

        const tempF = (data.main.temp - 273.15) * 1.80 + 32;

        const windEl = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        const humidityEl = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        const tempEl = $("<p>").addClass("card-text").text("Temperature: " + tempF.toFixed(2) + " °F");
        const iconEl = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        const titleEl = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        const cardEl = $("<div>").addClass("card");
        const cardBody = $("<div>").addClass("card-body");


        titleEl.append(iconEl);
        cardEl.append(cardBody);
        cardBody.append(titleEl, tempEl, humidityEl, windEl);
        $("#current").append(cardEl);

        $("#clear").empty();

        const clearRow = $("<div>").addClass("row");
        const clearDiv = $("<div>").addClass("col-md-8");
        const clearBtn = $("<br><button>").text("Clear").addClass("btn btn-primary");

        clearBtn.append(clearDiv);
        clearDiv.append(clearRow);
        $("#clear").append(clearBtn);
        clearBtn.on("click", function () {
          console.log("hello");
          $(".cities").empty();
          $("#clear").empty();
          $("#current").empty();
          $("#week").empty();
          window.localStorage.clear();
        });

        weekForecast(cityName);

      });
  };

  // WEEK FORECAST
  function weekForecast(cityName) {
    const APIKey = "d3d059dd73667f9df01c09fb652df11b";

    $.ajax(
      {
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey,
      })
      .then(function (data) {
        $("#week").empty();

        const titleDiv = $("<div>").addClass("row");
        const weekTitle = $("<div>").html("<h4>5-Day Forecast:</h4>");
        weekTitle.append(titleDiv);
        $("#week").append(weekTitle);

        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            const tempF = (data.list[i].main.temp_max - 273.15) * 1.80 + 32;

            const iconEl = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            const tempEl = $("<p>").addClass("card-text").text("Temp: " + tempF.toFixed(2) + " °F");
            const humidityEl = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

            const titleEl = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            const colEl = $("<div>").addClass("col-md-2");
            const cardEl = $("<div>").addClass("card bg-primary text-white");
            const cardBody = $("<div>").addClass("card-body p-2");

            colEl.append(cardEl);
            cardEl.append(cardBody);
            cardBody.append(titleEl, iconEl, tempEl, humidityEl);
            $("#week .row").append(colEl);
          }
        }
      });
  }

  //  HISTORY AND LOCAL STORAGE
  $(".cities").on("click", "li", function () {
    currentWeather($(this).text());
  });

  var cities = JSON.parse(window.localStorage.getItem("cities")) || [];

  if (cities.length > 0) {
    currentWeather(cities[cities.length - 1]);


  }

  for (var i = 0; i < cities.length; i++) {
    searchHistory(cities[i]);
  }
});
