// script.js
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById("saveBtn");
  const savedRounds = document.getElementById("savedRounds");

  const dateInput = document.getElementById("date");
  const courseInput = document.getElementById("course");

  if (!dateInput || !courseInput) {
    console.error("Missing #date or #course input — check IDs in HTML");
    return;
  }

  // 🔒 Strong override: catch Enter before other handlers and force focus shift
  (function () {
    function handler(e) {
      const isEnter = e.key === "Enter" || e.code === "Enter" || e.keyCode === 13;
      if (!isEnter) return;
      if (document.activeElement !== dateInput) return;

      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }

      setTimeout(() => {
        courseInput.focus();
        console.log("OVERRIDE: Enter on Date → moved focus to Course");
      }, 0);
    }

    document.addEventListener("keydown", handler, { capture: true });
    document.addEventListener("keypress", handler, { capture: true });
  })();

  // 🧠 Secondary listener for redundancy
  function advanceToCourse(e) {
    const isEnter = e.key === "Enter" || e.code === "Enter" || e.keyCode === 13;
    if (!isEnter) return;
    if (document.activeElement !== dateInput) return;

    e.preventDefault();
    e.stopPropagation();

    setTimeout(() => {
      courseInput.focus();
      console.log("Date → Course: Enter handled, focus moved");
    }, 0);
  }

  dateInput.removeEventListener("keydown", advanceToCourse);
  dateInput.addEventListener("keydown
