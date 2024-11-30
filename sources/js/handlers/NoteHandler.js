import DragHandler from "./DragHandler.js";

export default class NoteHandler {
  constructor() {
    this.notes = [];
    this.currentNote = null;
    this.API_URL = "http://localhost:5001/notes";
    this.initializeElements();
    this.addEventListeners();
    this.loadNotes();
  }

  initializeElements() {
    this.notesList = document.getElementById("notesList");
    this.noteTitleInput = document.getElementById("noteTitle");
    this.noteContentInput = document.getElementById("noteContent");
    this.saveButton = document.getElementById("saveNote");
    this.newNoteBtn = document.getElementById("newNoteBtn");
    this.closeNoteBtn = document.getElementById("closeNote");
  }

  addEventListeners() {
    this.saveButton.addEventListener("click", () => this.saveNote());
    this.newNoteBtn.addEventListener("click", () => this.createNewNote());
    this.closeNoteBtn.addEventListener("click", () => {
      document.getElementById("noteWindow").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
    });
    document
      .querySelector('[data-app="note"]')
      .addEventListener("click", () => {
        document.getElementById("noteWindow").classList.add("active");
        document.getElementById("overlay").classList.add("active");
      });
  }

  async loadNotes() {
    try {
      const response = await fetch(this.API_URL);
      if (!response.ok) throw new Error("Failed to load notes");
      this.notes = await response.json();
      this.renderNotesList();
    } catch (error) {
      console.error("Error loading notes:", error);
      alert("Có lỗi xảy ra khi tải ghi chú");
    }
  }

  renderNotesList() {
    this.notesList.innerHTML = "";
    this.notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className =
        "p-3 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer mb-2";
      noteElement.innerHTML = `
        <h3 class="font-medium text-gray-800">${note.title}</h3>
        <p class="text-sm text-gray-500 truncate">${note.content}</p>
        <p class="text-xs text-gray-400 mt-1">${new Date(
          note.createdAt
        ).toLocaleDateString()}</p>
        <div class="flex justify-end mt-2 space-x-2">
          <button class="delete-btn text-red-500 hover:text-red-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </button>
        </div>
      `;

      noteElement.addEventListener("click", (e) => {
        if (!e.target.closest(".delete-btn")) {
          this.selectNote(note);
        }
      });

      const deleteBtn = noteElement.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteNote(note._id);
      });

      this.notesList.appendChild(noteElement);
    });
  }

  selectNote(note) {
    this.currentNote = note;
    this.noteTitleInput.value = note.title;
    this.noteContentInput.value = note.content;
  }

  createNewNote() {
    this.currentNote = null;
    this.noteTitleInput.value = "";
    this.noteContentInput.value = "";
  }

  async saveNote() {
    const noteData = {
      title: this.noteTitleInput.value,
      content: this.noteContentInput.value,
    };

    if (!noteData.title || !noteData.content) {
      alert("Vui lòng điền đầy đủ tiêu đề và nội dung");
      return;
    }

    try {
      if (this.currentNote) {
        // Update existing note
        const response = await fetch(
          `${this.API_URL}/${this.currentNote._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(noteData),
          }
        );

        if (!response.ok) throw new Error("Failed to update note");
        const updatedNote = await response.json();
        this.notes = this.notes.map((note) =>
          note._id === this.currentNote._id ? updatedNote : note
        );
      } else {
        // Create new note
        const response = await fetch(this.API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) throw new Error("Failed to create note");
        const newNote = await response.json();
        this.notes.push(newNote);
      }

      this.renderNotesList();
      this.createNewNote(); // Reset form after saving
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Có lỗi xảy ra khi lưu ghi chú");
    }
  }

  async deleteNote(noteId) {
    // Hiển thị dialog xác nhận
    const confirmDialog = document.getElementById("confirmDialog");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");

    confirmDialog.classList.remove("hidden");

    return new Promise((resolve) => {
      const handleDelete = async () => {
        try {
          const response = await fetch(`${this.API_URL}/${noteId}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete note");

          this.notes = this.notes.filter((note) => note._id !== noteId);
          this.renderNotesList();
          if (this.currentNote && this.currentNote._id === noteId) {
            this.createNewNote();
          }
        } catch (error) {
          console.error("Error deleting note:", error);
          alert("Có lỗi xảy ra khi xóa ghi chú");
        } finally {
          confirmDialog.classList.add("hidden");
          // Cleanup
          confirmDeleteBtn.removeEventListener("click", handleDelete);
          cancelDeleteBtn.removeEventListener("click", handleCancel);
        }
      };

      const handleCancel = () => {
        confirmDialog.classList.add("hidden");
        // Cleanup
        confirmDeleteBtn.removeEventListener("click", handleDelete);
        cancelDeleteBtn.removeEventListener("click", handleCancel);
      };

      confirmDeleteBtn.addEventListener("click", handleDelete);
      cancelDeleteBtn.addEventListener("click", handleCancel);
    });
  }
}
