document.addEventListener('DOMContentLoaded', () => {
  // 🔗 Input references
  const dateInput = document.getElementById("date");
  const courseInput = document.getElementById("course");
  const scoreInput = document.getElementById("score");
  const slopeInput = document.getElementById("slope");
  const handicapInput = document.getElementById("handicap");
  const notesInput = document.getElementById("notes");
  const saveBtn = document.getElementById("saveBtn");
  const savedRounds = document.getElementById("savedRounds");

  if (!dateInput || !courseInput) {
    console.error("Missing #date or #course input — check IDs in HTML");
    return;
  }

  // ⏎ Enter override: Date → Course
  function advanceToCourse(e) {
    const isEnter = e.key === "Enter" || e.code === "Enter" || e.keyCode === 13;
    if (!isEnter || document.activeElement !== dateInput) return;
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      courseInput.focus();
      console.log("Date → Course: Enter handled, focus moved");
    }, 0);
  }

  dateInput.addEventListener("keydown", advanceToCourse);
  dateInput.addEventListener("keypress", advanceToCourse);

  // 💾 Save logic
  function saveRound() {
    const date = dateInput.value;
    const course = courseInput.value;
    const score = scoreInput?.value || "";
    const slope = slopeInput?.value || "";
    const handicap = handicapInput?.value || "";
    const notes = notesInput?.value || "";

    const round = `${date} — ${course} | Score: ${score}, Slope: ${slope}, Handicap: ${handicap} | ${notes}`;
    const timestamp = new Date().toLocaleString();

    try {
      localStorage.setItem("round_" + timestamp, round);
    } catch (err) {
      console.warn("Could not write to localStorage", err);
    }

    displayRounds();

    // 🧹 Clear inputs after save
    dateInput.value = "";
    courseInput.value = "";
    scoreInput.value = "";
    slopeInput.value = "";
    handicapInput.value = "";
    notesInput.value = "";

    // 🔁 Reset focus to Date
    dateInput.focus();
  }

  // 📋 Display logic
  function displayRounds() {
    if (!savedRounds) return;
    savedRounds.innerHTML = "<h2>Saved Rounds</h2>";

    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("round_")) {
        keys.push(key);
      }
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

      // 🗑️ Wire up delete logic
      entry.querySelector(".delete-btn").addEventListener("click", function () {
        const keyToDelete = this.getAttribute("data-key");
        localStorage.removeItem(keyToDelete);
        displayRounds(); // re-render after deletion
      });
    }
  }

  if (saveBtn) saveBtn.addEventListener("click", saveRound);
  displayRounds();

  console.log("script.js loaded — inputs clear after save, delete buttons active");
});
