document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById("saveBtn");
  const savedRounds = document.getElementById("savedRounds");

  // PLACED: Enter key moves from Date → Course
  document.getElementById("date").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("course").focus();
    }
  });

  function saveRound() {
    const date = document.getElementById("date").value;
    const course = document.getElementById("course").value;
    const score = document.getElementById("score").value;
    const slope = document.getElementById("slope").value;
    const handicap = document.getElementById("handicap").value;
    const notes = document.getElementById("notes").value;

    const round = `${date} — ${course} | Score: ${score}, Slope: ${slope}, Handicap: ${handicap} | ${notes}`;
    const timestamp = new Date().toLocaleString();
    localStorage.setItem("round_" + timestamp, round);

    displayRounds();
  }

  function displayRounds() {
    savedRounds.innerHTML = "<h2>Saved Rounds</h2>";

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("round_")) {
        const round = localStorage.getItem(key);
        const entry = document.createElement("div");
        entry.className = "round-entry";
        entry.textContent = round;
        savedRounds.appendChild(entry);
      }
    }
  }

  saveBtn.addEventListener("click", saveRound);
  displayRounds();
});
