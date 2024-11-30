import TimeHandler from "./handlers/TimeHandler.js";
import BatteryHandler from "./handlers/BatteryHandler.js";
import PomodoroHandler from "./handlers/PomodoroHandler.js";
import NoteHandler from "./handlers/NoteHandler.js";
import TodoHandler from "./handlers/TodoHandler.js";
import DragHandler from "./handlers/DragHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  new TimeHandler();
  new BatteryHandler();
  new PomodoroHandler();
  new NoteHandler();
  new TodoHandler();

  let lastClickTime = 0;
  const doubleClickDelay = 300;
  let activeApp = null; // Theo dõi app đang active

  function handleAppOpen(appId) {
    const overlay = document.getElementById("overlay");
    const appWindow = document.getElementById(appId);

    // Nếu đã có app đang mở, không cho phép mở app khác
    if (activeApp) {
      return;
    }

    // Mở app và lưu trạng thái
    appWindow.classList.add("active");
    overlay.classList.add("active");
    activeApp = appId;

    // Thêm class để vô hiệu hóa click events trên desktop
    document
      .querySelector(".desktop-background")
      .classList.add("pointer-events-none");
    // Cho phép tương tác với app đang mở
    appWindow.classList.add("pointer-events-auto");
  }

  // Event listeners cho app icons với double click
  document.querySelectorAll("[data-app]").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;

      if (timeDiff < doubleClickDelay) {
        const appId = `${e.currentTarget.dataset.app}Window`;
        handleAppOpen(appId);
      }

      lastClickTime = currentTime;
    });
  });

  // Event listeners cho các nút đóng
  document.querySelectorAll('[id^="close"]').forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      const appWindow = closeBtn.closest(".popup-window");
      appWindow.classList.remove("active");
      document.getElementById("overlay").classList.remove("active");

      // Xóa trạng thái active app và cho phép tương tác lại với desktop
      activeApp = null;
      document
        .querySelector(".desktop-background")
        .classList.remove("pointer-events-none");
    });
  });

  // Khởi tạo drag functionality
  const windows = [
    {
      window: document.getElementById("todoWindow"),
      titleBar: document.getElementById("todoTitleBar"),
    },
    {
      window: document.getElementById("noteWindow"),
      titleBar: document.getElementById("noteTitleBar"),
    },
    {
      window: document.getElementById("pomodoroWindow"),
      titleBar: document.getElementById("pomodoroTitleBar"),
    },
  ];

  windows.forEach(({ window: win, titleBar }) => {
    if (win && titleBar) {
      new DragHandler(win, titleBar);
    }
  });
});
