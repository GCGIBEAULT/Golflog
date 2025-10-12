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

  // Strong override: catch Enter before other handlers and force focus shift
  (function () {
    function handler(e) {
      const isEnter = e.key === "Enter" || e.code === "Enter" || e.keyCode === 13;
      if (!isEnter) return;

      // Only act when the date input is focused
      if (document.activeElement !== dateInput) return;

      // Prevent other handlers and default form submission
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") {
        e.stopImmediatePropagation();
      }

      // Defer slightly for mobile keyboard quirks
      setTimeout(() => {
        courseInput.focus();
        console.log("OVERRIDE: Enter on Date -> moved focus to Course");
      }, 0);
    }

    // Use capture true to intercept before bubble-phase handlers
    document.addEventListener("keydown", handler, { capture: true });
    // Fallbacks in case some environments use keypress
    document.addEventListener("keypress", handler, { capture: true });
  })();

  // Secondary safe listener directly on the input (keeps backward compatibility)
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

  // Ensure only one set of listeners active
  dateInput.removeEventListener("keydown", advanceToCourse);
  dateInput.addEventListener("keydown", advanceToCourse);
  dateInput.addEventListener("keypress", advanceToCourse);

  // Save/display logic
  function saveRound() {
    const date = dateInput.value;
    const course = courseInput.value;
    const score = document.getElementById("score") ? document.getElementById("score").value : "";
    const slope = document.getElementById("slope") ? document.getElementById("slope").value : "";
    const handicap = document.getElementById("handicap") ? document.getElementById("handicap").value : "";
    const notes = document.getElementById("notes") ? document.getElementById("notes").value : "";

    const round = `${date} — ${course} | Score: ${score}, Slope: ${slope}, Handicap: ${handicap} | ${notes}`;
    const timestamp = new Date().toLocaleString();
    try {
      localStorage.setItem("round_" + timestamp, round);
    } catch (err) {
      console.warn("Could not write to localStorage", err);
    }
    displayRounds();
  }

  function displayRounds() {
    if (!savedRounds) return;
    savedRounds.innerHTML = "<h2>Saved Rounds</h2>";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("round_")) {
        const round = localStorage.getItem(key);
        const entry = document.createElement("div");
        entry.className = "round-entry";
        entry.textContent = round;
        savedRounds.appendChild(entry);
      }
    }
  }

  if (saveBtn) saveBtn.addEventListener("click", saveRound);

  // Initial display
  displayRounds();

  // Diagnostic: confirm script loaded
  console.log("script.js loaded — Enter override attached for Date input");
});
