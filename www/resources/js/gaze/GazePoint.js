class GazePoint {

  constructor(screenX, screenY) {
    this.screenX = screenX;
    this.screenY = screenY;
    this.createdAt = Date.now();
    this.id = this.createdAt;
  }

  linkTo(node) {
    let bb = node.getBoundingClientRect(),
      // Difference between height of browser window (including menus and decoration) and actual viewport height
      yOffSet = window.outerHeight - window.innerHeight,
      elementLeft = window.screenX + bb.left,
      elementTop = window.screenY + bb.top + yOffSet,
      elementRight = window.screenX + bb.right,
      elementBottom = window.screenY + bb.bottom + yOffSet,
      coordinates;
    if (this.screenX >= elementLeft && this.screenX <= elementRight && this
      .screenY >=
      elementTop && this.screenY <= elementBottom) {
      this.hasLink = true;
      this.link = node;
      this.targetX = this.screenX - elementLeft;
      this.targetY = this.screenY - elementTop;
    }
    return coordinates;
  }

}

export default GazePoint;