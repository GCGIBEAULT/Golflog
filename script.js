// script.js
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById("saveBtn");
  const savedRounds = document.getElementById("savedRounds");

  // Enter key moves from Date → Course (explicit, no extra spaces)
// Put this inside your existing DOMContentLoaded block or replace the current date listener
const dateInput = document.getElementById("date");
const courseInput = document.getElementById("course");

function advanceToCourse(e) {
  const isEnter =
    e.key === "Enter" ||
    e.code === "Enter" ||
    e.keyCode === 13; // legacy fallback

  if (!isEnter) return;

  // stop anything else trying to handle Enter (forms, other listeners, IME)
  e.preventDefault();
  e.stopPropagation();

  // small defer to ensure focus moves cleanly (helps on some mobile keyboards)
  setTimeout(() => {
    courseInput.focus();
    console.log("Date → Course: Enter handled, focus moved");
  }, 0);
}

// Attach to keydown (primary), and keypress (fallback on some older browsers)
dateInput.removeEventListener("keydown", advanceToCourse);
dateInput.addEventListener("keydown", advanceToCourse);
dateInput.addEventListener("keypress", advanceToCourse);

  dateInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();               // prevent form submission or default behavior
      console.log("Enter pressed in Date — moving focus to Course");
      courseInput.focus();
    }
  });

  function saveRound() {
    const date = dateInput.value;
    const course = courseInput.value;
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
