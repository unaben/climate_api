const PORT = process.env.PORT || 3030;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "metro",
    address: "https://metro.co.uk/tag/climate-change/",
    base: "",
  },
  {
    name: "cityam",
    address: "https://www.cityam.com/topic/climate-change/",
    base: "",
  },
  {
    name: "independence",
    address: "https://www.independent.co.uk/climate-change",
    base: "https://www.independent.co.uk",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/science-environment-56837908",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "dailymail",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
  {
    name: "euronews",
    address: "https://www.euronews.com/green/climate",
    base: "https://www.euronews.com",
  },
  {
    name: "cnn",
    address: "https://edition.cnn.com/specials/world/cnn-climate",
    base: "https://edition.cnn.com",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((res) => {
    const html = res.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const titleText = $(this).text();
      const url = $(this).attr("href");
      articles.push({
        titleText,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my climate cahnge news API");
});

app.get("/news", (request, response) => {
  response.json(articles);
  //   axios
  //     .get(
  //       "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html"
  //     )
  //     .then((res) => {
  //       const html = res.data;
  //       // console.log(html);
  //       const $ = cheerio.load(html);

  //       $('a:contains("climate")', html).each(function () {
  //         const title = $(this).text();
  //         const url = $(this).attr("href");
  //         articles.push({
  //           title,
  //           url,
  //         });
  //       });
  //       response.json(articles);
  //   })
  //   .catch((err) => console.log(err));
});

app.get("/news/:newspaperId", async (req, response) => {
  // => will log whatever end point that's passed =>localhost:3030/news/:(randomly selected endpiont)
  //   console.log("req: ", req.params.newspaperId);
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  // returns the address of the selected endpoint
  console.log("newspaperAddress: ", newspaperAddress);
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);

      const singleArticle = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        singleArticle.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      response.json(singleArticle);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
