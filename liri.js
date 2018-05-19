// Load package request requiremnets.
var dotenv = require("dotenv").config();
var fs = require("fs");
var twitter = require("twitter")
var request = require("request");
var Spotify = require("node-spotify-api"); //adjusted to "S" for node error.
//pull the information from the cmd prompt based on what was pressed.
var input = process.argv;
var action = input[2];
var action2 = input[3];
//the following variables allow access to the keys.
var keys = require("./keys.js");
var client = new twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var omdb = (keys.omdbApiKey.omdb_key);

RunAction();

function RunAction(act, act2) {
    //A switch command so that it takes commands
    switch (action) {
        case "my-tweets":
            myTweets(action2); //If the user enters in text after my-tweets then look up that account.
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-This":
            movieThis();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}

/*Show upto the last 20 tweets and when they were created at in your terminal/bash window.*/
function myTweets(action) {
    if (action == undefined) { action = ""; } //setting action to be to be a defualt account, but the user can also pass in any other account
    var params = { screen_name: action };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at + " " + tweets[i].text);
            }
        }
    });
}

/*node liri.js spotify-this-song '<song name here>':
    This will show the following information about the song in your terminal/bash window: 
        ~Artist(s) / ~song's name / ~Preview link of the song from Spotify /
        ~The album that the song is from
    If no song is provided then your program will default to "The Sign" by Ace of Base.*/
function spotifyThisSong() {
    var songName = "";

    //move over all of the entered words to 
    for (var i = 3; i < input.length; i++) {
        if (i > 3 && i < input.length) {
            songName = songName + "+" + input[i];
        } else {
            songName += input[i];
        }
    }
    if (songName === "") {
        songName = "The Sign Ace of Base";
    }

    // console.log(keys.spotify);
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // console.log(data);
        var track = data.tracks.items[0];
        console.log("Song Name: " + track.artists[0].name);
        console.log("Song Name: " + track.name);
        console.log("External Link: " + track.external_urls.spotify);
        console.log("Album Name: " + track.album.name);
    });
}

/*node liri.js movie-this '<movie name here>':
    This will output the following information to your terminal/bash window:
        * Title of the movie.
        * Year the movie came out.
        * IMDB Rating of the movie.
        * Rotten Tomatoes Rating of the movie.
        * Country where the movie was produced.
        * Language of the movie.
        * Plot of the movie.
        * Actors in the movie.
    If the user doesn't type a movie in, the program will output data 
        for the movie 'Mr. Nobody.'
        If you haven't watched "Mr. Nobody," then you 
        should: http://www.imdb.com/title/tt0485947/
        It's on Netflix!
    You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key.*/

function movieThis() {
    var movieName = "";

    //move over all of the entered words to 
    for (var i = 3; i < input.length; i++) {
        if (i > 3 && i < input.length) {
            movieName = movieName + "+" + input[i];
        } else {
            movieName += input[i];
        }
    }
    if (movieName === "") {
        movieName = "Mr. Nobody";
    }

    var movieQueryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=plot=short&apikey=trilogy" + omdb;

    //npm call and arrangement of data into information.
    request(movieQueryURL, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);
            console.log("Title: " + movieData.Title + "\nRelease Year: " + movieData.Year);

            for (var i = 0; i < movieData.Ratings.length; i++) {
                console.log("Rating: " + movieData.Ratings[i].Source + " " + movieData.Ratings[i].Value)
            }
            console.log("Country Produced: " + movieData.Country + "\nLanguage: " + movieData.Language +
                "\nActors: " + movieData.Actors + "\nPlot: " + movieData.Plot);
        } else {
            return console.log(error);
        }
    });
}

/*node liri.js do-what-it-says:
    Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.:
        * It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
        * Feel free to change the text in that document to test out the feature for other commands.
*/
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        //push the information into a variable holder and split the information on the ","
        var txtData = data.split(",");
        //push the information into a variable to be used.
        action = txtData[0];
        console.log(action);
        action2 = txtData[1]; //trying to get the secondary information pushed into the call action...
        console.log(action2);
    });
}