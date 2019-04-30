require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var inquirer = require("inquirer");
var moment = require("moment");
var fs = require("fs");
const chalk = require('chalk');


function liri() {

  inquirer
    .prompt([
      {
        type: "list",
        message: "Tell Liri what you would you like to do!",
        choices: ["Liri look up concert!", "Liri look up song!", "Liri look up movie!", "Liri Spotify a random song!", "Goodbye Liri :)"],
        name: "actions"
      }

    ])
    .then(function (res) {
      if (res.actions === "Liri look up concert!") {
        inquirer.prompt([
          {
            type: "input",
            message: "Name an artist you'd like to see in concert :)",
            name: "name"
          }
        ]).then(function (artist) {
          if (!artist.name) {
            console.log(chalk.blue("=============================================="));
            console.log(chalk.cyan("You didn't type an artist :("))
            console.log(chalk.cyan("Try Again! From the beginning."))
            console.log(chalk.blue("=============================================="));
            liri()
          }
          else {
            concertSearch(artist.name);
          }
        });
      }

      if (res.actions === "Liri look up song!") {
        inquirer.prompt([
          {
            type: "input",
            message: "Give me a song :)",
            name: "name"
          }
        ]).then(function (song) {
          if (!song.name) {
            console.log(chalk.blue("=============================================="));
            console.log(chalk.cyan("You didn't pick a song, so I picked one for you! You're welcome."))
            spotifySearch("YMCA");
          }
          else {
            spotifySearch(song.name);
          }
        });
      }

      if (res.actions === "Liri look up movie!") {
        inquirer.prompt([
          {
            type: "input",
            message: "What Movie would you like to look up?",
            name: "name"
          }
        ]).then(function (movie) {
          if (!movie.name) {
            console.log(chalk.blue("=============================================="));
            console.log(chalk.cyan("You didn't type a movie :("))
            console.log(chalk.cyan("So one will be suggested to you: Mr. Nobody"))
            movieSearch("Mr. Nobody")
          }
          else {
            movieSearch(movie.name)
          }

        })
      }
      if (res.actions === "Liri Spotify a random song!") {
        fs.readFile("random.txt", "utf8", function (err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          var dataArr = data.split(",");
          var randomSong = dataArr[Math.floor(Math.random() * (dataArr.length - 1))]
          console.log(chalk.blue("=============================================="));
          console.log(chalk.cyan("You have been recommended a song at random! :)"))
          spotifySearch(randomSong)
        })
      }
      if (res.actions === "Goodbye Liri :)") {
        console.log(chalk.blue("=============================================="));
        console.log(chalk.cyan("Goodbye Human! Have a fantastic day :)"))
        console.log(chalk.blue("=============================================="));
      }
    });
}

liri()

function concertSearch(artist) {
  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  axios.get(queryUrl).then(
    function (response) {
      // console.log(response.data[0]);
      console.log(chalk.blue("=============================================="));
      console.log(chalk.magenta("Venue Name: " + response.data[0].venue.name + "\n" + "Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region + response.data[0].venue.country
        + "\n" + "Event Date: " + moment(response.data[0].datetime).format("MM/DD/YYYY")))
      console.log(chalk.blue("=============================================="));
      liri()
    })
}

function spotifySearch(song) {
  console.log("spotifySearch", song);
  spotify.search({ type: 'track', query: song }, function (err, data) {
    console.log(data.tracks);
    var info = data.tracks.items[0]
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log(chalk.blue("=============================================="));
    console.log(chalk.magenta(info.artists[0].name + "\n" + info.name + "\n" + "Check out a preview of the song: " +
      info.external_urls.spotify + "\n" + "Album Name: " + info.album.name));
    console.log(chalk.blue("=============================================="));
    liri()
  })
}

function movieSearch(movie) {
  var queryUrls = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  axios.get(queryUrls).then(
    function (response) {
      console.log(chalk.blue("=============================================="));
      console.log(chalk.magenta("Title: " + response.data.Title + "\n" + "Year: " + response.data.Year + "\n" + "Rating: " + response.data.Rated + "\n" +
        "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n" + "Country Movie was Produced: " + response.data.Country + "\n" +
        "Languages: " + response.data.Language + "\n" + "Plot: " + response.data.Plot + "\n" + "Actors: " + response.data.Actors))
      console.log(chalk.blue("=============================================="));
      liri()
    })
}