# GeoGuessr Clone

A web-based geography game where players guess locations based on Street View images.

## Setup

1. Clone the repository
2. Copy `config.template.js` to `config.js`
3. Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
4. Add your API key to `config.js`

## Features

- Street View integration for location exploration
- Interactive map for making guesses
- Score calculation based on distance
- Compass overlay for navigation
- Limited to reasonable latitude ranges (-55° to 70°)

## How to Play

1. You'll be shown a random location in Street View
2. Explore the area using Street View controls
3. Make your guess by clicking on the map
4. See how close your guess was to the actual location
5. Play multiple rounds to improve your score

## Technologies Used

- Google Maps API for Street View
- Leaflet.js for the interactive map
- HTML5/CSS3/JavaScript

## Live Demo

Play the game at: [GeoGuessr Clone](https://yourusername.github.io/geoguessr-clone)

## Local Development

Simply open `index.html` in your web browser. No build process or server required!

## License

MIT License - feel free to use and modify as you like! 