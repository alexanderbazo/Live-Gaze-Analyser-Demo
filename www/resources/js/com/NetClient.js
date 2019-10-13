/* eslint-env browser */
/* global Colyseus */

import Logger from "../utils/Logger.js";
import Observable from "../utils/Observable.js";

const DEFAULT_GAME_ROOM = "image_viewer";

class NetClient extends Observable {

  constructor(url) {
    super();
    this.url = url;
  }

  connect(asObserver) {
    this.isObserver = asObserver;
    this.client = new Colyseus.Client(this.url);
    this.client.joinOrCreate(DEFAULT_GAME_ROOM).then(this.onConnect.bind(this))
      .catch(this.onError.bind(this));
  }

  sendGazeData(gazeData) {
    if (this.room === undefined) {
      return;
    }
    this.room.send({
      type: "gaze",
      data: gazeData,
    });
  }

  onConnect(room) {
    Logger.log(`Viewer ${room.sessionId} joined ${room.name}`, "NetClient");
    this.room = room;
    this.room.onStateChange(this.onUpdate.bind(this));
    this.room.onMessage(this.onMessage.bind(this));
    this.room.onError(this.onError.bind(this));
    this.room.onLeave(this.onLeave.bind(this));
    if (this.isObserver === true) {
      this.room.send({
        type: "subscribeToGazeData",
      });
    }
    this.notifyAll({
      type: "connect",
      ownID: this.room.sessionId,
    });

  }

  onUpdate(state) {
    this.notifyAll({
      type: "stateupdate",
      state: state,
    });
  }

  onMessage(message) {
    Logger.log("Received new message from server", "NetClient");
    if (message.type === "gazelist") {
      this.notifyAll({
        type: "gazeupdate",
        gazepoints: message.data,
      });
    }
  }

  onError(error) {
    Logger.log(error, "NetClient");
  }

  onLeave() {
    Logger.log("Local client left room", "NetClient");
  }
}

export default NetClient;