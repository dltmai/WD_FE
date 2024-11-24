export default class TodoHandler {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.currentFilter = "all";

    this.tasksList = document.getElementById("tasksList");
    this.addTaskForm = document.getElementById("addTaskForm");
    this.taskInput = document.getElementById("taskTitle");
    this.dueDateInput = document.getElementById("taskDueDate");

    this.initializeEvents();
    this.initializeWindow();
    this.renderTasks();
  }

  initializeEvents() {
    // Xử lý window controls
    document.getElementById("closeTodo").addEventListener("click", () => {
      document.getElementById("todoWindow").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
    });

    // Mở window khi click vào icon
    document
      .querySelector('[data-app="todo"]')
      .addEventListener("click", () => {
        document.getElementById("todoWindow").classList.add("active");
        document.getElementById("overlay").classList.add("active");
      });

    // Xử lý form thêm task
    this.addTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTask();
    });

    // Xử lý các filter
    document
      .getElementById("allTasks")
      .addEventListener("click", () => this.filterTasks("all"));
    document
      .getElementById("todayTasks")
      .addEventListener("click", () => this.filterTasks("today"));
    document
      .getElementById("upcomingTasks")
      .addEventListener("click", () => this.filterTasks("upcoming"));
    document
      .getElementById("completedTasks")
      .addEventListener("click", () => this.filterTasks("completed"));
  }

  initializeWindow() {
    // Khởi tạo drag functionality
    const todoWindow = document.getElementById("todoWindow");
    const titleBar = document.getElementById("todoTitleBar");
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
        todoWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener("mouseup", () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    });
  }

  addTask() {
    const title = this.taskInput.value.trim();
    const dueDate = this.dueDateInput.value;

    if (!title) return;

    const task = {
      id: Date.now(),
      title,
      dueDate,
      completed: false,
      timestamp: Date.now(),
    };

    this.tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));

    this.taskInput.value = "";
    this.dueDateInput.value = "";

    this.renderTasks();
  }

  toggleTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      this.renderTasks();
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
    this.renderTasks();
  }

  filterTasks(filter) {
    this.currentFilter = filter;
    this.renderTasks();
  }

  getFilteredTasks() {
    const today = new Date().toISOString().split("T")[0];

    switch (this.currentFilter) {
      case "today":
        return this.tasks.filter((task) => task.dueDate === today);
      case "upcoming":
        return this.tasks.filter((task) => task.dueDate > today);
      case "completed":
        return this.tasks.filter((task) => task.completed);
      default:
        return this.tasks;
    }
  }

  renderTasks() {
    this.tasksList.innerHTML = "";

    const filteredTasks = this.getFilteredTasks();

    filteredTasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className =
        "flex items-center justify-between p-3 bg-white rounded-lg shadow";
      taskElement.innerHTML = `
                <div class="flex items-center space-x-3">
                    <input type="checkbox" ${task.completed ? "checked" : ""} 
                           class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500">
                    <span class="${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-900"
                    }">
                        ${task.title}
                    </span>
                </div>
                <div class="flex items-center space-x-2">
                    ${
                      task.dueDate
                        ? `<span class="text-sm text-gray-500">${task.dueDate}</span>`
                        : ""
                    }
                    <button class="delete-task text-red-500 hover:text-red-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            `;

      const checkbox = taskElement.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", () => this.toggleTask(task.id));

      const deleteButton = taskElement.querySelector(".delete-task");
      deleteButton.addEventListener("click", () => this.deleteTask(task.id));

      this.tasksList.appendChild(taskElement);
    });
  }
}
