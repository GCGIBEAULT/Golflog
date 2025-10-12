document.addEventListener('DOMContentLoaded', () => {
  // Autofill today's date
  const dateInput = document.getElementById("date");
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toLocaleDateString("en-US");
  }

  const saveBtn = document.getElementById("saveBtn");
  const savedRounds = document.getElementById("savedRounds");

  const courseInput = document.getElementById("course");
  const scoreInput = document.getElementById("score");
  const slopeInput = document.getElementById("slope");
  const handicapInput = document.getElementById("handicap");
  const notesInput = document.getElementById("notes");

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function displayRounds() {
    savedRounds.innerHTML = "<h2>Saved Rounds</h2>";
    const keys = Object.keys(localStorage).filter(k => k.startsWith("round_")).sort().reverse();
    for (const key of keys) {
      const round = localStorage.getItem(key);
      const entry = document.createElement("div");
      entry.className = "round-entry";
      entry.innerHTML = `
        <span class="round-text">${escapeHtml(round)}</span>
        <button class="delete-btn" data-key="${key}" title="Delete this round">×</button>
      `;
      savedRounds.appendChild(entry);
      entry.querySelector(".delete-btn").addEventListener("click", () => {
        localStorage.removeItem(key);
        displayRounds();
      });
    }
  }

  function clearInputs() {
    [dateInput, courseInput, scoreInput, slopeInput, handicapInput, notesInput].forEach(el => {
      if (el) el.value = "";
    });
    if (dateInput) {
      dateInput.value = new Date().toLocaleDateString("en-US");
      dateInput.focus();
    }
  }

  function saveRound() {
    const date = dateInput.value || "";
    const course = courseInput.value || "";
    const score = scoreInput.value || "";
    const slope = slopeInput.value || "";
    const handicap = handicapInput.value || "";
    const notes = notesInput.value || "";

    const round = `${date} — ${course} | Score: ${score}, Slope: ${slope}, Handicap: ${handicap} | ${notes}`;
    const timestamp = new Date().toISOString();
    localStorage.setItem("round_" + timestamp, round);

    displayRounds();
    clearInputs();
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveRound();
    });
  }

  displayRounds();
});
