/* eslint-env node */

const schema = require("@colyseus/schema"),
  Schema = schema.Schema,
  TASKS = [{
    imageUrl: "images/Brueghel-The_Dutch_Proverbs.jpg",
    taskDescription: "Suchen Sie nach bildlichen Darstellungen niederländischer Sprichwörter des 16. Jahrhunderts.",
    taskSource: "Pieter Bruegel the Elder, Netherlandish Proverbs (Oil on oak wood, 1599), Gemäldegalerie, Berlin",
    duration: 15000,
  },
  {
    imageUrl: "images/Brueghel-The_Fight_Between_Carnival_and_Lent.jpg",
    taskDescription: "Suchen Sie nach Darstellungen von Personen ohne Kopfbedeckung.",
    taskSource: "Pieter Bruegel the Elder, The Fight Between Carnival and Lent (Oil on oak wood, 1559), Kunsthistorisches Museum, Vienna",
    duration: 15000,
  },
  {
    imageUrl: "images/Bruegel-Childrens_Games.jpg.jpg",
    taskDescription: "Identifizieren Sie unterschiedliche Spiele.",
    taskSource: "Pieter Bruegel the Elder, Children's Bruegel-Childrens_Games (Oil on oak wood, 1560), Kunsthistorisches Museum, Vienna",
    duration: 15000,
  }];

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

  static getTasks() {
    return TASKS;
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