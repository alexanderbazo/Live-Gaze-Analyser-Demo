/* eslint-env node */
/* eslint-disable no-magic-numbers */

var port,
socialRoute,
monitorRoute,
updateInterval,
viewerRoute,
viewerPath,
viewerRoomName;

class ServerConfig {

  reset() {
    port = process.env.PORT || 2568;
    socialRoute = "/";
    monitorRoute = "/colyseus";
    updateInterval = 1000/32;
    viewerRoute = "/viewer";
    viewerPath = "./www";
    viewerRoomName = "image_viewer";
  }

  getPort() {
    return port;
  }

  getSocialRoute() {
    return socialRoute;
  }

  getMonitorRoute() {
    return monitorRoute;
  }

  getUpdateInterval() {
    return updateInterval;
  }

  getViewerRoute() {
     return viewerRoute;
  }

  getViewerPath() {
    return viewerPath;
  }

  getViewerRoomName() {
    return viewerRoomName;
  }

}

const Config = new ServerConfig();
Config.reset();

module.exports = Config;