export default class TodoHandler {
  constructor() {
    this.todos = [];
    this.currentFilter = "all";
    this.API_URL = "https://levelup-backendside.onrender.com/todos";
    this.initializeElements();
    this.addEventListeners();
    this.loadTodos();
  }

  initializeElements() {
    this.todosList = document.getElementById("todosList");
    this.todoInput = document.getElementById("todoInput");
    this.addTodoForm = document.getElementById("addTodoForm");
    this.filterButtons = document.querySelectorAll(".filter-btn");
  }

  addEventListeners() {
    this.addTodoForm.addEventListener("submit", (e) => this.handleAddTodo(e));

    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentFilter = btn.dataset.filter;
        this.filterButtons.forEach((b) =>
          b.classList.remove("bg-blue-500", "text-white")
        );
        btn.classList.add("bg-blue-500", "text-white");
        this.renderTodosList();
      });
    });

    document.getElementById("closeTodo").addEventListener("click", () => {
      document.getElementById("todoWindow").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
    });

    document
      .querySelector('[data-app="todo"]')
      .addEventListener("click", () => {
        document.getElementById("todoWindow").classList.add("active");
        document.getElementById("overlay").classList.add("active");
      });
  }

  async loadTodos() {
    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) throw new Error("Failed to fetch todos");
      this.todos = await response.json();
      console.log(this.todos);
      this.renderTodosList();
    } catch (error) {
      console.error("Error loading todos:", error);
      //alert("Có lỗi xảy ra khi tải danh sách công việc");
    }
  }

  async handleAddTodo(e) {
    e.preventDefault();
    const todoText = this.todoInput.value.trim();
    if (!todoText) return;

    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: todoText,
          completed: false,
        }),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      const newTodo = await response.json();
      this.todos.push(newTodo);
      this.todoInput.value = "";
      this.renderTodosList();
    } catch (error) {
      console.error("Error adding todo:", error);
      //alert("Có lỗi xảy ra khi thêm công việc");
    }
  }

  async toggleTodoStatus(id) {
    const todo = this.todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      // Cập nhật trạng thái completed
      todo.completed = !todo.completed;

      // Gọi lại hàm render để cập nhật giao diện
      this.renderTodosList();
    } catch (error) {
      console.error("Error updating todo:", error);
      //alert("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  }

  async deleteTodo(id) {
    if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      try {
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete todo");

        this.todos = this.todos.filter((todo) => todo._id !== id);
        this.renderTodosList();
      } catch (error) {
        console.error("Error deleting todo:", error);
        //alert("Có lỗi xảy ra khi xóa công việc");
      }
    }
  }

  renderTodosList() {
    let filteredTodos = this.todos;
    if (this.currentFilter === "active") {
      filteredTodos = this.todos.filter((todo) => !todo.completed);
    } else if (this.currentFilter === "completed") {
      filteredTodos = this.todos.filter((todo) => todo.completed);
    }

    this.todosList.innerHTML = filteredTodos
      .map(
        (todo) => `
        <div class="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <div class="flex items-center">
            <input
              type="checkbox"
              ${todo.completed ? "checked" : ""}
              onchange="window.todoHandler.toggleTodoStatus('${todo._id}')"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            >
            <span class="ml-3 ${
              todo.completed ? "line-through text-gray-500" : ""
            }">
              ${todo.title}
            </span>
          </div>
          <button
            onclick="window.todoHandler.deleteTodo('${todo._id}')"
            class="text-red-500 hover:text-red-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      `
      )
      .join("");
  }
}
