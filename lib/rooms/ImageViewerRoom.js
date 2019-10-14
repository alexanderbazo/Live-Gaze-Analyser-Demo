/* eslint-env node */

const MAX_GAZE_POINT_AGE = 2000,
  GAZE_POINT_UPDATE_DELAY = 250;

const colyseus = require("colyseus"),
  Logger = require("../utils/Logger.js"),
  ServerConfiguration = require("../config/ServerConfig.js"),
  GazePoint = require("../logic/GazePoint.js"),
  Task = require("../logic/Task.js"),
  ImageViewerState = require("../logic/ImageViewerState.js");

var tasks = Task.getTasks(), 
  availableTasks,
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
    for (let i = 0; i < tasks.length; i++) {
      availableTasks.push(new Task(tasks[i].imageUrl, tasks[i].taskDescription,
        tasks[i].taskSource, tasks[i].duration));
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

  // Run on each tick (~30FPS)
  update() {
    let now = Date.now();
    // Remove old gaze points
    this.updateGazePoints(now);
    // Sanity check to prevent empty updates to subscribers
    if(gazePoints.length === 0) {
      return;
    }
    // Sanity check to prevent high frequency gaze updates to subscribers
    if(now - lastGazePointUpdate < GAZE_POINT_UPDATE_DELAY) {
      return;
    }
    for (let i = 0; i < gazeSubscribers.length; i++) {
      Logger.log(`${gazePoints.length} gaze points available`);
      if (gazeSubscribers[i]) {
        Logger.log(`Sending ${gazePoints.length} gaze points to subscriber`, "ImageViewer Room");
        this.send(gazeSubscribers[i],{
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
    // Cycle through available tasks
    currentTaskIndex += 1;
    if (currentTaskIndex >= availableTasks.length) {
      currentTaskIndex = 0;
    }
    currentTask = availableTasks[currentTaskIndex];
    // Send task to state to auto update clients
    // Set listener for task change event (is based on task's duration property)
    this.state.setTask(currentTask, this.onTaskFinished.bind(this));
  }
}

module.exports = ImageViewerRoom;