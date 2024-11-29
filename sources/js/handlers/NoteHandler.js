import notes from "../data/notes.json";

export default class NoteHandler {
  constructor() {
    this.notes = [];
    this.loadNotes();

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
    document.getElementById("closeNote").addEventListener("click", () => {
      this.closeNoteWindow();
    });

    const noteIcon = document.querySelector('[data-app="note"]');
    if (noteIcon) {
      noteIcon.addEventListener("click", () => {
        this.openNoteWindow();
      });
    }

    this.newNoteBtn.addEventListener("click", () => this.createNewNote());
    this.saveButton.addEventListener("click", () => this.saveNote());
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
      id: this.currentNoteId || Date.now().toString(),
      title: title || "Untitled",
      content,
      createdAt: new Date().toISOString(),
    };

    if (this.currentNoteId) {
      const index = this.notes.findIndex((n) => n.id === this.currentNoteId);
      if (index !== -1) {
        this.notes[index] = note;
      }
    } else {
      this.notes.unshift(note);
    }

    this.renderNotesList();
    this.createNewNote();
  }

  renderNotesList() {
    this.notesList.innerHTML = "";

    if (this.notes.length === 0) {
      this.notesList.innerHTML = `
        <div class="text-gray-500 text-center p-4">
          Chưa có ghi chú nào.
        </div>
      `;
      return;
    }

    this.notesList.className =
      "space-y-2 custom-scrollbar overflow-y-auto max-h-[400px] pr-2";

    this.notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className =
        "p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer transition-colors";

      const createdAt = new Date(note.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const truncatedTitle =
        note.title.length > 30
          ? note.title.substring(0, 30) + "..."
          : note.title;

      const truncatedContent =
        note.content.length > 100
          ? note.content.substring(0, 100) + "..."
          : note.content;

      noteElement.innerHTML = `
        <div class="flex justify-between items-start">
          <h3 class="font-medium text-lg text-gray-900 mb-1 truncate max-w-[80%]" 
              title="${note.title}">
            ${truncatedTitle}
          </h3>
          <button class="delete-note text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-2 line-clamp-2 text-sm" title="${note.content}">
          ${truncatedContent}
        </p>
        <div class="text-xs text-gray-500">${createdAt}</div>
      `;

      noteElement.addEventListener("click", (e) => {
        if (!e.target.closest(".delete-note")) {
          this.loadNote(note);
        }
      });

      const deleteButton = noteElement.querySelector(".delete-note");
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteNote(note.id);
      });

      this.notesList.appendChild(noteElement);
    });
  }

  loadNote(note) {
    this.currentNoteId = note.id;
    this.titleInput.value = note.title;
    this.contentInput.value = note.content;
  }

  deleteNote(id) {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.renderNotesList();
    if (this.currentNoteId === id) {
      this.createNewNote();
    }
  }

  initializeWindow() {
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

  openNoteWindow() {
    const noteWindow = document.getElementById("noteWindow");
    const overlay = document.getElementById("overlay");
    if (noteWindow && overlay) {
      noteWindow.classList.add("active");
      overlay.classList.add("active");
      this.renderNotesList();
    }
  }

  closeNoteWindow() {
    const noteWindow = document.getElementById("noteWindow");
    const overlay = document.getElementById("overlay");
    if (noteWindow && overlay) {
      noteWindow.classList.remove("active");
      overlay.classList.remove("active");
    }
  }

  async loadNotes() {
    try {
      const response = await fetch("./js/data/notes.json");
      this.notes = await response.json();
      this.renderNotesList();
    } catch (error) {
      console.error("Error loading notes:", error);
      this.notes = []; // Fallback to empty array if loading fails
    }
  }

  showNoteDetail(note) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center";
    modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4 relative">
            <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700" id="closeDetailModal">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="mb-4">
                <h2 class="text-2xl font-bold text-gray-900 mb-2">${
                  note.title
                }</h2>
                <div class="text-sm text-gray-500 mb-4">
                    Tạo ngày: ${new Date(note.createdAt).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                </div>
                <div class="prose max-w-none">
                    <p class="text-gray-600 whitespace-pre-wrap">${
                      note.content
                    }</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal
      .querySelector("#closeDetailModal")
      .addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
}
