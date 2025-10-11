document.addEventListener('DOMContentLoaded', () => {
  const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];
  const saveBtn = document.getElementById('saveBtn');
  const roundList = document.getElementById('roundList');

  // 🗓 Auto-fill today's date if blank
  const dateField = document.getElementById('date');
  if (dateField && !dateField.value) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateField.value = `${mm}/${dd}/${yyyy}`;
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

      const timestamp = new Date().toLocaleString();
      const entry = `${round.date} — ${round.course} Score: ${round.score}, Slope: ${round.slope} ${round.notes}`;
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

      // 🔁 Refill today's date after save
      if (dateField) {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const yyyy = today.getFullYear();
        dateField.value = `${mm}/${dd}/${yyyy}`;
      }
    });
  }
});
