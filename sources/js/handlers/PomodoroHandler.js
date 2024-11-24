export default class PomodoroHandler {
  constructor() {
    this.timer = document.getElementById("timer");
    this.startBtn = document.getElementById("startTimer");
    this.pauseBtn = document.getElementById("pauseTimer");
    this.resetBtn = document.getElementById("resetTimer");
    this.pomodoroBtn = document.getElementById("pomodoroMode");
    this.shortBreakBtn = document.getElementById("shortBreak");
    this.longBreakBtn = document.getElementById("longBreak");

    this.timeLeft = 25 * 60; // 25 phút
    this.isRunning = false;
    this.timerInterval = null;

    this.initializeEvents();
    this.initializeWindow();
  }

  initializeEvents() {
    // Xử lý các nút điều khiển timer
    this.startBtn.addEventListener("click", () => this.startTimer());
    this.pauseBtn.addEventListener("click", () => this.pauseTimer());
    this.resetBtn.addEventListener("click", () => this.resetTimer());

    // Xử lý các mode
    this.pomodoroBtn.addEventListener("click", () => this.setTime(25));
    this.shortBreakBtn.addEventListener("click", () => this.setTime(5));
    this.longBreakBtn.addEventListener("click", () => this.setTime(15));

    // Xử lý window controls
    document.getElementById("closePomodoro").addEventListener("click", () => {
      document.getElementById("pomodoroWindow").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
    });

    // Mở window khi click vào icon
    document
      .querySelector('[data-app="pomodoro"]')
      .addEventListener("click", () => {
        document.getElementById("pomodoroWindow").classList.add("active");
        document.getElementById("overlay").classList.add("active");
      });
  }

  initializeWindow() {
    // Khởi tạo drag functionality
    const pomodoroWindow = document.getElementById("pomodoroWindow");
    const titleBar = document.getElementById("pomodoroTitleBar");
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    titleBar.addEventListener("mousedown", (e) => {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      if (e.target === titleBar) {
        isDragging = true;
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        pomodoroWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener("mouseup", () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    });
  }

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startBtn.classList.add("hidden");
      this.pauseBtn.classList.remove("hidden");

      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        this.updateDisplay();

        if (this.timeLeft <= 0) {
          this.stopTimer();
          this.playAlarm();
        }
      }, 1000);
    }
  }

  pauseTimer() {
    this.isRunning = false;
    this.startBtn.classList.remove("hidden");
    this.pauseBtn.classList.add("hidden");
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = 25 * 60;
    this.updateDisplay();
  }

  stopTimer() {
    this.isRunning = false;
    this.startBtn.classList.remove("hidden");
    this.pauseBtn.classList.add("hidden");
    clearInterval(this.timerInterval);
  }

  setTime(minutes) {
    this.stopTimer();
    this.timeLeft = minutes * 60;
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  playAlarm() {
    const audio = new Audio("/assets/alarm.mp3");
    audio.play();
  }
}
