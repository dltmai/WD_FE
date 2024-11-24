export default class TimeHandler {
  constructor() {
    this.timeElement = document.getElementById("current-time");
    this.initTime();
  }

  initTime() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    this.timeElement.textContent = timeString;
  }
}
