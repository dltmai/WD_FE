export default class AuthHandler {
  constructor() {
    this.API_URL = "http://localhost:5001/users";
    this.initializeElements();
    this.addEventListeners();
  }

  initializeElements() {
    // Form elements
    this.signInForm = document.querySelector(".sign-in-form");
    this.signUpForm = document.querySelector(".sign-up-form");

    // Input fields cho signin
    this.signInEmail = this.signInForm.querySelector('input[type="email"]');
    this.signInPassword = this.signInForm.querySelector(
      'input[type="password"]'
    );

    // Input fields cho signup
    this.signUpEmail = this.signUpForm.querySelector('input[type="email"]');
    this.signUpUsername = this.signUpForm.querySelector('input[type="text"]');
    this.signUpPassword = this.signUpForm.querySelector(
      'input[type="password"]'
    );
  }

  addEventListeners() {
    this.signInForm.addEventListener("submit", (e) => this.handleSignIn(e));
    this.signUpForm.addEventListener("submit", (e) => this.handleSignUp(e));
  }

  async handleSignIn(e) {
    e.preventDefault();

    // Kiểm tra độ dài password
    if (
      this.signInPassword.value.length < 6 ||
      this.signInPassword.value.length > 50
    ) {
      alert("Password must be between 6 and 50 characters");
      return;
    }

    try {
      const response = await fetch(`${this.API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.signInEmail.value,
          password: this.signInPassword.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.user._id);
      localStorage.setItem("email", this.signInEmail.value);
      localStorage.setItem("username", data.user.username);

      window.location.href = "/screen.html";
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  }

  async handleSignUp(e) {
    e.preventDefault();

    // Kiểm tra độ dài username
    if (
      this.signUpUsername.value.length < 6 ||
      this.signUpUsername.value.length > 50
    ) {
      alert("Username must be between 6 and 50 characters");
      return;
    }

    // Kiểm tra độ dài password
    if (
      this.signUpPassword.value.length < 6 ||
      this.signUpPassword.value.length > 50
    ) {
      alert("Password must be between 6 and 50 characters");
      return;
    }

    try {
      const response = await fetch(`${this.API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.signUpEmail.value,
          username: this.signUpUsername.value,
          password: this.signUpPassword.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      document.querySelector(".container").classList.remove("sign-up-mode");
      this.signUpForm.reset();
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  }

  checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/screen.html";
    }
  }

  static initWindowsMenu() {
    // Tạo menu cho Windows icon
    const windowsIcon = document.querySelector('[data-app="windows"]');
    const menu = document.createElement("div");
    menu.className =
      "windows-menu hidden absolute bottom-12 left-0 bg-gray-800 rounded-lg shadow-xl w-64 py-2 text-white";
    menu.innerHTML = `
      <div class="user-info px-4 py-2 border-b border-gray-700">
        <div class="text-sm font-medium">${
          JSON.parse(localStorage.getItem("user"))?.username || "User"
        }</div>
        <div class="text-xs text-gray-400">${
          JSON.parse(localStorage.getItem("user"))?.email || ""
        }</div>
      </div>
      <button class="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    `;

    // Thêm menu vào DOM
    windowsIcon.appendChild(menu);

    // Xử lý sự kiện click cho Windows icon
    windowsIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    // Xử lý sự kiện click cho nút logout
    menu.querySelector("button").addEventListener("click", () => {
      AuthHandler.logout();
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/authen.html";
  }
}
