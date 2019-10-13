# Star Gazer Server

StarGazer is a multiplayer game using gaze data as an input source. This demo showcases the eye tracking classroom's abilities to utilize gaze based real time collaboration.

## Dependencies

StarGazer is based on the colyseus game server framework. To install all dependencies, run `npm install`.

## Requirements

To play the game using gaze data for input a local [gaze-server](https://lab.las3.de/gitlab/eye-tracking-classroom/gaze-server.cs) must be running at `ws://localhost:8001`.

## Building and Testing

- Run `npm install` to install dependencies and build game to `build/`
- Run `npm start` to run the game server
- See [this repository]() for client code