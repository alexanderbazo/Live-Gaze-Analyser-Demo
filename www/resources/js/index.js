/* eslint-env browser */

import Logger from "./utils/Logger.js";
import ImageViewer from "./viewer/ImageViewer.js";
import NetClient from "./com/NetClient.js";
import FakeGazeDataProvider from "./gaze/FakeGazeDataProvider.js";
import GazeDataProvider from "./gaze/GazeDataProvider.js";

const GAZE_SERVER_URL = "ws://localhost:8001/gaze",
VIEWER_SERVER_URL = "ws://localhost:2568";

var starScreen = document.querySelector("#startScreen"),
  stage = document.querySelector("#stage"),
  viewerServerUrl = VIEWER_SERVER_URL,
  useMouseInput = false,
  isObserver = false,
  imageViewer;

function init() {
  document.querySelector(".startButton").addEventListener("click", initViewer);
}

function loadOptions() {
  useMouseInput = document.querySelector("#useMouseInput").checked;
  isObserver = document.querySelector("#isObserver").checked;
  viewerServerUrl = document.querySelector("#viewerServerUrl").value;
}

function initViewer() {
  let netClient, dataProvider;
  loadOptions();
  netClient = new NetClient(viewerServerUrl);
  dataProvider = getDataProvider();
  imageViewer = new ImageViewer(dataProvider, netClient, stage, isObserver);
  stage.requestFullscreen().then(startViewer);
}

function startViewer() {
  starScreen.classList.add("hidden");
  stage.classList.remove("hidden");
}

function getDataProvider() {
  let provider;
  if (useMouseInput === true) {
    provider = new FakeGazeDataProvider();
  } else {
    provider = new GazeDataProvider();
  }
  provider.start(GAZE_SERVER_URL);
  return provider;
}

init();