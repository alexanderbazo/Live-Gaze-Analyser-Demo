/* global GazeClient */

import Observable from "../utils/Observable.js";
import Event from "../utils/Event.js";
import Logger from "../utils/Logger.js";
import GazePoint from "../gaze/GazePoint.js";

class GazeDataProvider extends Observable {

  constructor() {
    super();
  }

  start(url) {
    this.gclient = new GazeClient();
    this.gclient.connect(url);
    this.gclient.addEventListener("connectionopened", this.onConnected.bind(this));
    this.gclient.addEventListener("dataavailable", this.onGazeDataAvailable.bind(
      this));
    this.gclient.addEventListener("connectionclosed", this.onDisconnected.bind(this));
  }

  onConnected(event) {
    Logger.log(event);
  }

  onGazeDataAvailable(event) {
    let eyeX = (event.data.leftEyeX + event.data.rightEyeX) / 2,
      eyeY = (event.data.leftEyeY + event.data.rightEyeY) / 2,
      gazeEvent = new Event("dataavailable", new GazePoint(eyeX, eyeY));
    this.notifyAll(gazeEvent);
  }

  onDisconnected(event) {
    Logger.log(event);
  }

}

export default GazeDataProvider;