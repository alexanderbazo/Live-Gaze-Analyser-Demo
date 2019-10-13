/* eslint-env node */

const schema = require("@colyseus/schema"),
  Schema = schema.Schema;

class GazePoint extends Schema {

  constructor(screenX, screenY, createdAt, source) {
    super();
    this.screenX = screenX;
    this.screenY = screenY;
    this.createdAt = createdAt;
    this.source = source;
    this.relativeAge = 0;
  }

  static fromClientData(data) {
    return new GazePoint(data.screenX, data.screenY, data.createdAt, data.source);
  }

}

schema.defineTypes(GazePoint, {
  screenX: "number",
  screenY: "number",
  createdAt: "number",
  relativeAge: "number",
  source: "string",
});

module.exports = GazePoint;