import TimeHandler from "./handlers/TimeHandler.js";
import BatteryHandler from "./handlers/BatteryHandler.js";
import PomodoroHandler from "./handlers/PomodoroHandler.js";
import NoteHandler from "./handlers/NoteHandler.js";
import TodoHandler from "./handlers/TodoHandler.js";
import DragHandler from "./handlers/DragHandler.js";
import AuthHandler from "./handlers/AuthHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  new TimeHandler();
  new BatteryHandler();
  new PomodoroHandler();
  new NoteHandler();
  new TodoHandler();

  let lastClickTime = 0;
  const doubleClickDelay = 300;
  let activeApp = null;

  function handleAppOpen(appId) {
    const overlay = document.getElementById("overlay");

    // Đóng tất cả các app khác trước khi mở app mới
    allApps.forEach((id) => {
      if (id !== appId) {
        document.getElementById(id).classList.remove("active");
      }
    });

    // Mở app được chọn
    document.getElementById(appId).classList.add("active");
    overlay.classList.add("active");
  }

  // Thêm event listeners cho các app icons
  document.querySelectorAll("[data-app]").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const appId = `${e.currentTarget.dataset.app}Window`;
      handleAppOpen(appId);
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

  // Xử lý Windows Menu
  const startButton = document.getElementById("startButton");
  const windowsMenu = document.getElementById("windowsMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  // Hàm để lấy thông tin user từ userID
  async function getUserInfo() {
    const userID = localStorage.getItem("user");
    console.log("UserID:", userID);

    if (!userID) return null;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      const userData = await response.json();
      console.log("User data:", userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }

  // Cập nhật thông tin user trong menu
  function updateUserInfo() {
    const email = localStorage.getItem("email");

    if (email) {
      const emailElement = document.querySelector("#windowsMenu .font-medium");

      if (emailElement) {
        emailElement.textContent = email.replace(/"/g, ""); // Xóa dấu ngoặc kép
      } else {
        console.error("Could not find username or email elements");
      }
    }
  }

  // Hiển thị/ẩn menu khi click vào nút Start
  startButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    windowsMenu.classList.toggle("hidden");
    await updateUserInfo(); // Cập nhật thông tin user mỗi khi mở menu
  });

  // Ẩn menu khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!windowsMenu.contains(e.target) && !startButton.contains(e.target)) {
      windowsMenu.classList.add("hidden");
    }
  });

  // Xử lý logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // Thêm xóa username
    localStorage.removeItem("email"); // Thêm xóa email
    window.location.href = "authen.html";
  });
});
