/* eslint-env node */

const TASKS = [{
    imageUrl: "images/Brueghel-The_Dutch_Proverbs.jpg",
    taskDescription: "Suchen Sie nach bildlichen Darstellungen niederländischer Sprichwörter des 16. Jahrhunderts.",
    taskSource: "Pieter Bruegel the Elder, Netherlandish Proverbs (Oil on oak wood, 1599), Gemäldegalerie, Berlin",
    duration: 30000,
  }],
  MAX_GAZE_POINT_AGE = 2000,
  GAZE_POINT_UPDATE_DELAY = 250;

const colyseus = require("colyseus"),
  Logger = require("../utils/Logger.js"),
  ServerConfiguration = require("../config/ServerConfig.js"),
  GazePoint = require("../logic/GazePoint.js"),
  Task = require("../logic/Task.js"),
  ImageViewerState = require("../logic/ImageViewerState.js");

var availableTasks,
  currentTask,
  currentTaskIndex,
  gazePoints,
  gazeSubscribers,
  lastGazePointUpdate = 0;

class ImageViewerRoom extends colyseus.Room {

  onCreate() {
    Logger.log("Creating ImageViewer room", "ImageViewer Room");
    gazePoints = [];
    gazeSubscribers = [];
    this.createTasks();
    this.setState(new ImageViewerState());
    this.setSimulationInterval(this.update.bind(this), ServerConfiguration.getUpdateInterval());
    this.setTask();
  }

  createTasks() {
    availableTasks = [];
    for (let i = 0; i < TASKS.length; i++) {
      availableTasks.push(new Task(TASKS[i].imageUrl, TASKS[i].taskDescription,
        TASKS[i].taskSource, TASKS[i].duration));
    }
    currentTaskIndex = 0;
  }

  onJoin(client, options) {
    Logger.log(`Viewer ${client.sessionId} joined ImageViewer room`,
      "ImageViewer Room");
  }

  onMessage(client, message) {
    if (message.type === "gaze") {
      message.data.source = client.id;
      let point = GazePoint.fromClientData(message.data);
      gazePoints.push(point);
      Logger.log(`Adding new gaze point (${gazePoints.length} points stored)`, "ImageViewer Room");
    }
    if (message.type === "subscribeToGazeData") {
      Logger.log("Gaze observer subsribed", "ImageViewer Room");
      gazeSubscribers.push(client);
    }
  }

  onLeave(client, consented) {
    Logger.log(`Viewer ${client.sessionId} left ImageViewer room`,
      "ImageViewer Room");
  }

  onDispose() {
    Logger.log("Disposing ImageViewer room", "ImageViewer Room");
  }

  onTaskFinished() {
    Logger.log(`Switching to next task`, "ImageViewer Room");
    this.setTask();
  }

  update() {
    let now = Date.now();
    this.updateGazePoints(now);
    if(now - lastGazePointUpdate < GAZE_POINT_UPDATE_DELAY) {
      return;
    }
    for (let i = 0; i < gazeSubscribers.length; i++) {
      let client = gazeSubscribers[i];
      Logger.log(`${gazePoints.length} gaze points available`);
      if (client && gazePoints.length > 0) {
        Logger.log(`Sending ${gazePoints.length} gaze points to subsriber`, "ImageViewer Room");
        this.send(client,{
          type: "gazelist",
          data: gazePoints,
        });
      }
    }
    lastGazePointUpdate = now;
  }

  updateGazePoints(now) {
    for (let i = gazePoints.length - 1; i >= 0; i--) {
      let age = now - gazePoints[i].createdAt;
      if (age > MAX_GAZE_POINT_AGE) {
        gazePoints.splice(i, 1);
      } else {
        gazePoints[i].relativeAge = age / MAX_GAZE_POINT_AGE;
      }
    }
  }

  setTask() {
    Logger.log("Sending current task to state", "ImageViewrRoom");
    currentTaskIndex += 1;
    if (currentTaskIndex >= availableTasks.length) {
      currentTaskIndex = 0;
    }
    currentTask = availableTasks[currentTaskIndex];
    this.state.setTask(currentTask, this.onTaskFinished.bind(this));
  }
}

module.exports = ImageViewerRoom;