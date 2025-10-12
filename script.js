give document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.querySelector("button");
  const savedRounds = document.getElementById("savedRounds");

  // 🗓 Pre-fill today's date once, but allow manual edits
  const dateField = document.getElementById("date");
  if (dateField && !dateField.value) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateField.value = `${mm}/${dd}/${yyyy}`;
  }

  function saveRound() {
    const date = document.getElementById("date").value;
    const course = document.getElementById("course").value;
    const score = document.getElementById("score").value;
    const slope = document.getElementById("slope").value;
    const rating = document.getElementById("rating").value;
    const handicap = document.getElementById("handicap").value;
    const notes = document.getElementById("notes").value;

    const round = `${date} — ${course} Score: ${score}, Slope: ${slope} ${notes}`;
    const timestamp = new Date().toLocaleString();
    localStorage.setItem("round_" + timestamp, round);

    displayRounds();
  }

  function displayRounds() {
    savedRounds.innerHTML = "";

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("round_")) {
        const round = localStorage.getItem(key);
        const entry = document.createElement("div");
        entry.textContent = round;
        savedRounds.appendChild(entry);
      }
    }
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", saveRound);
  }

  displayRounds();
});
document.getElementById("date").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("course").focus();
  }
});
