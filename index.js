/* eslint-env node */

const http = require("http"),
  express = require("express"),
  cors = require("cors"),
  colyseus = require("colyseus"),
  monitor = require("@colyseus/monitor").monitor,
  socialRoutes = require("@colyseus/social/express").default,
  ImageViewerRoom = require("./lib/rooms/ImageViewerRoom.js"),
  Logger = require("./lib/utils/Logger.js"),
  ServerConfiguration = require("./lib/config/ServerConfig.js");

Logger.disable();

var app = express(),
  server = http.createServer(app),
  imageServer;

// Logger.enable();

app.use(cors());
app.use(express.json());

imageServer = new colyseus.Server({
  server: server,
  express: app,
});

imageServer.define(ServerConfiguration.getViewerRoomName(), ImageViewerRoom);
// Must be set after game server is created
app.use(ServerConfiguration.getSocialRoute(), socialRoutes);
app.use(ServerConfiguration.getMonitorRoute(), monitor(imageServer));
// Prrobably shoud be set after game server is created
app.use(ServerConfiguration.getViewerRoute(), express.static(ServerConfiguration.getViewerPath(), {
  maxAge: 100,
}));

imageServer.listen(ServerConfiguration.getPort()); 
Logger.log(`Listening on ws://localhost:${ ServerConfiguration.getPort() }`, "Server");