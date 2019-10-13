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

export default Observable;