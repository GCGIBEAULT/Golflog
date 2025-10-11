document.addEventListener('DOMContentLoaded', () => {
  const fields = ['date', 'time', 'course', 'score', 'slope', 'rating', 'handicap', 'notes'];
  const saveBtn = document.getElementById('saveBtn');
  const roundList = document.getElementById('roundList');

  // 🗓 Pre-fill today's date once, but allow manual edits
  const dateField = document.getElementById('date');
  if (dateField && !dateField.value) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateField.value = `${mm}/${dd}/${yyyy}`;
  }

  // 🕒 Optional: Pre-fill current time once
  const timeField = document.getElementById('time');
  if (timeField && !timeField.value) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    timeField.value = `${hours}:${minutes} ${ampm}`;
  }

  // ✅ Save logic with validation gate
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const round = {};
      for (const id of fields) {
        const el = document.getElementById(id);
        round[id] = el?.value?.trim() || '';
      }

      // 🚫 Prevent ghost saves
      if (!round.date || !round.course || !round.score || !round.slope) {
        alert('Date, Course, Score, and Slope are required.');
        return;
      }

      // 🔐 Unique key to prevent overwrite
      const timestamp = new Date().toLocaleString() + "_" + Math.random().toString(36).substr(2, 5);

      // 🧾 Format saved entry
      const entry = `${round.date}, ${round.time} — ${round.course} Score: ${round.score}, Slope: ${round.slope}, Rating: ${round.rating}, HC: ${round.handicap} ${round.notes}`;
      localStorage.setItem("round_" + timestamp, entry);

      // 🧹 Clear and re-render saved rounds
      roundList.innerHTML = "";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("round_")) {
          const saved = localStorage.getItem(key);
          const div = document.createElement("div");
          div.textContent = saved;
          roundList.appendChild(div);
        }
      }
    });
  }
});
