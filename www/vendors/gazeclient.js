// GazeClient Version 1.0 - [https://lab.las3.de/gitlab/eye-tracking-classroom/gaze-client.js]
(function () {
  'use strict';

  class Observable {

    constructor() {
      this.listeners = {};
    }

    addEventListener(type, callback) {
      if (this.listeners[type] === undefined) {
        this.listeners[type] = [];
      }
      this.listeners[type].push(callback);
    }

    notifyAll(event) {
      let listeners = this.listeners[event.type];
      if (listeners) {
        for (let i = 0; i < listeners.length; i++) {
          listeners[i](event);
        }
      }
    }

  }

  class Event {

    constructor(type, data) {
      this.type = type;
      this.data = data;
    }

  }

  class DataEvent extends Event {
    constructor(data) {
      super("dataavailable", data);
    }
  }

  class ConnectionOpenedEvent extends Event {
    constructor() {
      super("connectionopened");
    }
  }

  class ConnectionClosedEvent extends Event {
    constructor() {
      super("connectionclosed");
    }
  }

  class ConnectionErrorEvent extends Event {
    constructor() {
      super("erroroccurred");
    }
  }

  const DATA_SEPERATOR = ";";

  class GazeData {
    constructor(leftEyeX, leftEyeY, rightEyeX, rightEyeY, trackerTimeStamp,
      systemTimeStamp) {
      this.leftEyeX = leftEyeX;
      this.leftEyeY = leftEyeY;
      this.rightEyeX = rightEyeX;
      this.rightEyeY = rightEyeY;
      this.trackerTimeStamp = trackerTimeStamp;
      this.systemTimeStamp = systemTimeStamp;
    }

    static fromDataString(dataString) {
      let dataValues = dataString.split(DATA_SEPERATOR);
      return new GazeData(parseFloat(dataValues[0]), parseFloat(dataValues[1]), parseFloat(dataValues[2]),
        parseFloat(dataValues[3]), parseInt(dataValues[4]), parseInt(dataValues[5]));
    }
  }

  class WebSocketClient extends Observable {

    constructor() {
      super();
    }

    connect(url) {
      this.ws = new WebSocket(url);
      this.ws.onopen = onOpen.bind(this);
      this.ws.onclose = onClose.bind(this);
      this.ws.onerror = onError.bind(this);
      this.ws.onmessage = onMessage.bind(this);
    }

  }

  function onOpen() {
    let connectionEvent = new ConnectionOpenedEvent();
    this.notifyAll(connectionEvent);
  }

  function onClose() {
    let connectionEvent = new ConnectionClosedEvent();
    this.notifyAll(connectionEvent);
  }

  function onError() {
    let connectionEvent = new ConnectionErrorEvent();
    this.notifyAll(connectionEvent);
  }

  function onMessage(event) {
    let data = GazeData.fromDataString(event.data),
      dataEvent = new DataEvent(data);
    this.notifyAll(dataEvent);
  }

  class GazeClient extends Observable {

    constructor() {
      super();
    }

    connect(url) {
      this.url = url;
      this.client = new WebSocketClient();
      this.client.addEventListener("connectionopened", this.onConnected.bind(this));
      this.client.addEventListener("connectionclosed", this.onDisconnected.bind(this));
      this.client.addEventListener("erroroccurred", this.onDisconnected.bind(this));
      this.client.addEventListener("dataavailable", this.onDataAvailable
        .bind(this));
      this.client.connect(url);
    }

    onConnected(event) {
      this.notifyAll(event);
    }

    onDisconnected(event) {
      this.notifyAll(event);
    }

    onError(event) {
      this.notifyAll(event);
    }

    onDataAvailable(event) {
      this.notifyAll(event);
    }

  }

  window.GazeClient = GazeClient;

}());
//# sourceMappingURL=gazeclient.js.map
