/* eslint-env browser */
/* eslint-disable no-console */

class Logger {

  constructor() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  log(msg, label) {
    let time = new Date(),
      hours = time.getUTCHours(),
      minutes = time.getUTCMinutes(),
      seconds = time.getUTCSeconds();
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (this.enabled === false) {
      return;
    }
    console.log(`[${label}]\t${hours}:${minutes}:${seconds} - ${msg}`);
  }

}

let log = new Logger();
export default log;