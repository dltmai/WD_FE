export default class AuthHandler {
  constructor() {
    this.API_URL = "http://localhost:5001/auth";
    this.initializeElements();
    this.addEventListeners();
  }

  initializeElements() {
    // Form elements
    this.signInForm = document.querySelector(".sign-in-form");
    this.signUpForm = document.querySelector(".sign-up-form");

    // Input fields
    this.signInEmail = this.signInForm.querySelector('input[type="email"]');
    this.signInPassword = this.signInForm.querySelector(
      'input[type="password"]'
    );

    this.signUpName = this.signUpForm.querySelector('input[type="text"]');
    this.signUpEmail = this.signUpForm.querySelector('input[type="email"]');
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

      // Lưu token vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Chuyển hướng đến trang chính
      window.location.href = "/screen.html";
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  }

  async handleSignUp(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${this.API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.signUpName.value,
          email: this.signUpEmail.value,
          password: this.signUpPassword.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Hiển thị thông báo thành công
      alert("Đăng ký thành công! Vui lòng đăng nhập.");

      // Chuyển về form đăng nhập
      document.querySelector(".container").classList.remove("sign-up-mode");

      // Reset form đăng ký
      this.signUpForm.reset();
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      alert(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  }

  // Phương thức kiểm tra token và chuyển hướng nếu đã đăng nhập
  checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/screen.html";
    }
  }

  // Phương thức đăng xuất
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/authen.html";
  }
}
