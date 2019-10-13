/* eslint-env browser */

import Renderer from "./Renderer.js";

const FRAME_RATE = 60,
  MAX_GAZE_POINT_AGE = 500;

var gazePoints = [],
observedGazePoints = [];

class ImageViewer {

  constructor(dataProvider, netClient, stage, isObserver) {
    this.observerMode = isObserver;
    this.initNetClient(netClient, isObserver);
    if(this.observerMode === false) {
      this.initDataProvider(dataProvider); 
    } else {
      this.netClient.addEventListener("gazeupdate", this.onGazePointsAvailable);
    }
    setInterval(this.onTick.bind(this), 1000 / FRAME_RATE);
    this.initStage(stage);
  }

  initNetClient(netClient, isObserver) {
    this.netClient = netClient;
    this.netClient.addEventListener("stateupdate", this.onStateUpdate.bind(
      this));
    this.netClient.connect(isObserver);
  }

  initDataProvider(dataProvider) {
    this.dataProvider = dataProvider;
    this.dataProvider.addEventListener("dataavailable", this.onInputDataAvailable
      .bind(this));
  }

  initStage(stage) {
    this.stage = stage;
    this.backgroundCanvas = this.stage.querySelector(".background");
    this.gazeCanvas = this.stage.querySelector(".gaze");
    this.stage.style.width = this.backgroundCanvas.style.width = this.gazeCanvas
      .style.width = `${screen.width}px`;
    this.stage.style.height = this.backgroundCanvas.style.height = this.gazeCanvas
      .style.height = `${screen.height}px`;
    this.backgroundCanvas.width = this.gazeCanvas.width = screen.width;
    this.backgroundCanvas.height = this.gazeCanvas.height = screen.height;
    this.backgroundContext = this.backgroundCanvas.getContext("2d", { alpha: false });
    this.gazeContext = this.gazeCanvas.getContext("2d", { alpha: true });
    Renderer.setContext(this.gazeContext);
  }

  initTask(task) {
    this.setTaskImage(task.imageUrl);
    this.setTaskData(task.taskDescription, task.taskSource);
  }

  setTaskImage(imageUrl) {
    let that = this,
      image = new Image();
    image.src = imageUrl;
    image.onload = function() {
      that.backgroundContext.drawImage(image, 0, 0);
    };
  }

  setTaskData(description, source) {
    this.stage.querySelector(".task-description").innerHTML = description;
    this.stage.querySelector(".task-source").innerHTML = source;
  }

  onTick() {
    let now = Date.now();
    if(this.observerMode === false) {
      this.updateGazePoints(now);
      Renderer.drawGazePoints(gazePoints);
    } else {
      Renderer.drawGazePoints(observedGazePoints);
    }
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

  onInputDataAvailable(event) {
    gazePoints.push(event.data);
    this.netClient.sendGazeData(event.data);
  }

  onStateUpdate(event) {
    this.initTask(event.state.task);
  }

  onGazePointsAvailable(event) {
    observedGazePoints = event.gazepoints;
  }

}

export default ImageViewer;