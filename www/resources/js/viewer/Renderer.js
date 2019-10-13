/* eslint-env browser */

const GAZE_POINT_RADIUS = 15,
  GAZE_POINT_COLOR = "#4cd494";

var context;

class Renderer {

  static setContext(_context) {
    context = _context;
  }

  static drawGazePoints(gazePoints) {
    context.clearRect(0, 0, screen.width, screen.height);
    context.fillStyle = GAZE_POINT_COLOR;
    for (let i = 0; i < gazePoints.length; i++) {
      Renderer.drawSingleGazePoint(gazePoints[i]);
    }
  }

  static drawSingleGazePoint(gazePoint) {
    let inversedAge = 1 - gazePoint.relativeAge,
      radius = inversedAge * GAZE_POINT_RADIUS;
    context.save();
    context.globalAlpha = inversedAge;
    context.globalAlpha = 1;
    context.beginPath();
    context.ellipse(gazePoint.screenX, gazePoint.screenY, radius, radius,
      Math.PI /
      4, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }

}

export default Renderer;