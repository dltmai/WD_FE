export default class DragHandler {
  constructor(element, titleBar) {
    this.element = element;
    this.titleBar = titleBar;
    this.isDragging = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;

    this.initDrag();
  }

  initDrag() {
    this.titleBar.addEventListener("mousedown", (e) => this.dragStart(e));
    document.addEventListener("mousemove", (e) => this.drag(e));
    document.addEventListener("mouseup", (e) => this.dragEnd(e));
  }

  dragStart(e) {
    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;

    if (e.target === this.titleBar) {
      this.isDragging = true;
    }
  }

  drag(e) {
    if (this.isDragging) {
      e.preventDefault();
      this.currentX = e.clientX - this.initialX;
      this.currentY = e.clientY - this.initialY;
      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      this.setTranslate(this.currentX, this.currentY);
    }
  }

  dragEnd() {
    this.initialX = this.currentX;
    this.initialY = this.currentY;
    this.isDragging = false;
  }

  setTranslate(xPos, yPos) {
    this.element.style.transform = `translate(${xPos}px, ${yPos}px)`;
  }
}
