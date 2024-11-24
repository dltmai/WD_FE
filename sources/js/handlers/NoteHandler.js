export default class NoteHandler {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.currentNoteId = null;

    this.notesList = document.getElementById("notesList");
    this.titleInput = document.getElementById("noteTitle");
    this.contentInput = document.getElementById("noteContent");
    this.saveButton = document.getElementById("saveNote");
    this.newNoteBtn = document.getElementById("newNoteBtn");

    this.initializeEvents();
    this.initializeWindow();
    this.renderNotesList();
  }

  initializeEvents() {
    // Xử lý window controls
    document.getElementById("closeNote").addEventListener("click", () => {
      document.getElementById("noteWindow").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
    });

    // Mở window khi click vào icon
    document
      .querySelector('[data-app="note"]')
      .addEventListener("click", () => {
        document.getElementById("noteWindow").classList.add("active");
        document.getElementById("overlay").classList.add("active");
      });

    // Xử lý các sự kiện note
    this.newNoteBtn.addEventListener("click", () => this.createNewNote());
    this.saveButton.addEventListener("click", () => this.saveNote());
  }

  initializeWindow() {
    // Khởi tạo drag functionality
    const noteWindow = document.getElementById("noteWindow");
    const titleBar = document.getElementById("noteTitleBar");
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
        noteWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener("mouseup", () => {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    });
  }

  createNewNote() {
    this.currentNoteId = null;
    this.titleInput.value = "";
    this.contentInput.value = "";
  }

  saveNote() {
    const title = this.titleInput.value.trim();
    const content = this.contentInput.value.trim();

    if (!title && !content) return;

    const note = {
      id: this.currentNoteId || Date.now(),
      title: title || "Untitled",
      content,
      timestamp: Date.now(),
    };

    if (this.currentNoteId) {
      const index = this.notes.findIndex((n) => n.id === this.currentNoteId);
      if (index !== -1) {
        this.notes[index] = note;
      }
    } else {
      this.notes.push(note);
    }

    localStorage.setItem("notes", JSON.stringify(this.notes));
    this.renderNotesList();
    this.createNewNote();
  }

  renderNotesList() {
    this.notesList.innerHTML = "";

    this.notes
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.className =
          "p-3 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer";
        noteElement.innerHTML = `
                    <h3 class="font-medium text-gray-900 truncate">${
                      note.title
                    }</h3>
                    <p class="text-sm text-gray-500 truncate">${
                      note.content
                    }</p>
                    <p class="text-xs text-gray-400 mt-1">${new Date(
                      note.timestamp
                    ).toLocaleDateString()}</p>
                `;

        noteElement.addEventListener("click", () => this.loadNote(note));
        this.notesList.appendChild(noteElement);
      });
  }

  loadNote(note) {
    this.currentNoteId = note.id;
    this.titleInput.value = note.title;
    this.contentInput.value = note.content;
  }
}
