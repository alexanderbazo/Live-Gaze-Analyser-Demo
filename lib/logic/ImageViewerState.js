/* eslint-env node */

const schema = require("@colyseus/schema"),
    Logger = require("../utils/Logger.js"),
    Task = require("./Task"),
    Schema = schema.Schema;

var currentCallback;

class ImageViewerState extends Schema {

    constructor() {
        super();
        this.task = null;
    }

    setTask(task, onFinish) {
        this.task = task;  
        currentCallback = onFinish;
        setTimeout(this.onTaskFinished, task.duration);
    }

    onTaskFinished() {
        currentCallback();
    }

}

schema.defineTypes(ImageViewerState, {
    stateType: "string",
    width: "number",
    height: "number",
    task: Task,
});

module.exports = ImageViewerState;