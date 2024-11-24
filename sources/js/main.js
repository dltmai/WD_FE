import TimeHandler from "./handlers/TimeHandler.js";
import BatteryHandler from "./handlers/BatteryHandler.js";
import PomodoroHandler from "./handlers/PomodoroHandler.js";
import NoteHandler from "./handlers/NoteHandler.js";
import TodoHandler from "./handlers/TodoHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  new TimeHandler();
  new BatteryHandler();
  new PomodoroHandler();
  new NoteHandler();
  new TodoHandler();
});
