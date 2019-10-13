import GazeDataProvider from "./GazeDataProvider.js";
import Event from "../utils/Event.js";
import GazePoint from "./GazePoint.js";

class FakeGazeDataProvider extends GazeDataProvider {

  constructor() {
    super();
  }

  start() {
    window.addEventListener("mousemove", this.onMouseDataAvailable.bind(this));
  }

  onMouseDataAvailable(event) {
    let gazeEvent = new Event("dataavailable", new GazePoint(event.screenX,
      event.screenY));
    this.notifyAll(gazeEvent);
  }

}

export default FakeGazeDataProvider;