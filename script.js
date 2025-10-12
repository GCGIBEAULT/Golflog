document.addEventListener('DOMContentLoaded', () => {
  // element refs used for non-save behaviors
  const saveBtn = document.getElementById("saveBtn");
  const savedRounds = document.getElementById("savedRounds");
  if (!savedRounds) {
    console.error("Missing #savedRounds element — check HTML IDs");
    return;
  }

  // Enter override: Date -> Course
  const dateEl = document.getElementById("date");
  const courseEl = document.getElementById("course");
  if (dateEl && courseEl) {
    function advanceToCourse(e) {
      const isEnter = e.key === "Enter" || e.code === "Enter" || e.keyCode === 13;
      if (!isEnter || document.activeElement !== dateEl) return;
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => courseEl.focus(), 0);
    }
    dateEl.addEventListener("keydown", advanceToCourse);
    dateEl.addEventListener("keypress", advanceToCourse);
  }

  // Display saved rounds
  function displayRounds() {
    savedRounds.innerHTML = "<h2>Saved Rounds</h2>";
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("round_")) keys.push(key);
    }
    keys.sort().reverse(); // newest first

    for (const key of keys) {
      const round = localStorage.getItem(key);
      const entry = document.createElement("div");
      entry.className = "round-entry";
      entry.innerHTML = `
        <span class="round-text">${round}</span>
        <button class="delete-btn" data-key="${key}" title="Delete this round">×</button>
      `;
      savedRounds.appendChild(entry);
      entry.querySelector(".delete-btn").addEventListener("click", function () {
        const keyToDelete = this.getAttribute("data-key");
        localStorage.removeItem(keyToDelete);
        displayRounds();
      });
    }
  }

  // SAVE: direct DOM queries inside function to avoid timing/scope issues on mobile
  function saveRound() {
    const date = document.getElementById("date")?.value || "";
    const course = document.getElementById("course")?.value || "";
    const score = document.getElementById("score")?.value || "";
    const slope = document.getElementById("slope")?.value || "";
    const handicap = document.getElementById("handicap")?.value || "";
    const notes = document.getElementById("notes")?.value || "";

    const round = `${date} — ${course} | Score: ${score}, Slope: ${slope}, Handicap: ${handicap} | ${notes}`;
    const timestamp = new Date().toISOString(); // stable key
    try {
      localStorage.setItem("round_" + timestamp, round);
    } catch (err) {
      console.warn("localStorage write failed", err);
    }

    displayRounds();

    // Clear fields — direct DOM writes, then blur/refocus to avoid mobile keyboard/value artifacts
    const d = document.getElementById("date");
    const c = document.getElementById("course");
    const s = document.getElementById("score");
    const sl = document.getElementById("slope");
    const h = document.getElementById("handicap");
    const n = document.getElementById("notes");

    if (d) { d.value = ""; d.blur(); }
    if (c) { c.value = ""; c.blur(); }
    if (s) { s.value = ""; s.blur(); }
    if (sl) { sl.value = ""; sl.blur(); }
    if (h) { h.value = ""; h.blur(); }
    if (n) { n.value = ""; n.blur(); }

    // small delay before refocus reduces mobile race conditions
    setTimeout(() => {
      const dateField = document.getElementById("date");
      if (dateField) {
        dateField.focus();
        // ensure caret at start on some mobile browsers
        if (dateField.setSelectionRange) dateField.setSelectionRange(0, 0);
      }
    }, 120);
  }

  if (saveBtn) saveBtn.addEventListener("click", (e) => { e.preventDefault(); saveRound(); });
  displayRounds();
  console.log("script.js loaded: saveRound clears fields (mobile-safe)");
});
