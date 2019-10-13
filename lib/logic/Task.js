/* eslint-env node */

const schema = require("@colyseus/schema"),
  Schema = schema.Schema;

var taskCounter = 0;

class Task extends Schema {

  constructor(imageUrl, taskDescription, taskSource, duration) {
    super();
    taskCounter++;
    this.imageUrl = imageUrl;
    this.taskDescription = taskDescription;
    this.taskSource = taskSource;
    this.duration = duration;
    this.position = taskCounter;
  }
}

schema.defineTypes(Task, {
  imageUrl: "string",
  taskDescription: "string",
  taskSource: "string",
  duration: "number",
  height: "number",
  position: "number",
});

module.exports = Task;