
require("dotenv").config();
// Require keys from keys.js, node-spotify-api, axios, and moment npms to be installed
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// Grab command line arguements from Node
var cmd = process.argv[3];
var option = process.argv[2];
// Store all arguements
var query = process.argv;

var spotify = new Spotify(keys.spotify);

var userSubject = process.argv.slice(3).join(" ");
console.log(userSubject)

// Switch cases that tests for user input and will know which function to call based on user input
switch (option) {
    case "movie-this":
        movieThis(userSubject);
        break;
    case "spotify-this-song":
        spotifyCall(userSubject);
        break;
    case "concert-this":
        concertThis(userSubject);
        break;
    case "do-what-it-says":
        readFile(userSubject);
        break;
    default:
        console.log(
            "Only 'movie-this', 'concert-this', 'spotify-this-song', or 'do-what-it-says' pls, I don't speak any other languages. Thx. "
        );
}

// Function for the Bands In Town API
function concertThis(artist) {
    var bandsQueryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    // Creating an axios request to the queryUrl for Bands In Town API
    // Which then console logs upcoming events and the artist name, venue, location, and date of upcoming concert
    axios.get(bandsQueryUrl).then(
        function (response) {
            console.log("Upcoming Events!");
            console.log("Artist: " + artist + "\nVenue: " + response.data[0].venue.name + "\nLocation: " + response.data[0].venue.country + "\nDate: " + response.data[0].datetime);
        });
}
// Function to get song from Spotify API
// If error return error; otherwise, console log the Artist name, song name, Spotify preview link, and album name
function spotifyCall(songName) {
    spotify.search({ type: 'artist,track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview link of the song from Spotify: " + data.tracks.items[0].external_urls.spotify);
        console.log("The album that the song is from: " + data.tracks.items[0].album.name);
    });
}

// Function for OMDB API

function movieThis(movieName) {
    // If movie name is not entered by user, then by default the information for Mr. Nobody will be pulled
    // Otherwise, by way of an axios request, it will console.log the Title, Release Year, Rating, Rating, Release Country, Plot, Language, and Actors
    if (!movieName) {
        movieName = "Mr. Nobody";
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // Creating an axios request to the queryUrl for OMDB API
    axios.get(queryUrl).then(
        function (response) {
            if (!movieName) {
                movieName = "Mr. Nobody";
            }
            console.log("\n_Movie Info_" + "\nTitle: " + response.data.Title + "\nRelease Year: " + response.data.Year + "\nRating: " + response.data.Rated + "\nRelease Country: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors);
        }
    );
}

// Function to call "random.txt for 'do-what-it-says'
// Need to complete this function so that it calls on whatever is typed into text and runs that function to either show Spotify, Bands In Town, or OMDB results
function readFile() {
    fs.readFile("./random.txt", "utf-8", function (error, data) {
        if (error) {
            return console.log("error");
        }
    });
}