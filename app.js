/** @format */

const express = require("express");
const https = require("https");
const ejs = require("ejs");

let temp;
let desc;
let imageURL;
let icon;
let query;

const app = express();
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/response", (req, res) => {
  res.render("response", {
    city: query,
    temp: temp,
    desc: desc,
    imageURL: imageURL,
  });
});

app.post("/", (req, res) => {
  query = req.body.cityName;
  const apiKey = "4bd9d40d30258d8d3f687c0811146b8d";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;
  https.get(url, (response) => {
    console.log(response.statusCode);
    response.on("data", (data) => {
      const weatherData = JSON.parse(data);
      temp = weatherData.main.temp;
      desc = weatherData.weather[0].description;
      icon = weatherData.weather[0].icon;
      imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.redirect("/response");
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
