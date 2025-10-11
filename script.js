document.addEventListener('DOMContentLoaded', () => {
  // Auto-fill today's date if blank
  const dateField = document.getElementById('date');
  if (dateField && !dateField.value) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateField.value = `${mm}/${dd}/${yyyy}`;
  }

  const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];
  const form = document.getElementById('golfForm');
  const saveBtn = document.getElementById('saveBtn');
  const roundList = document.getElementById('roundList');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      history.replaceState({}, '', location.pathname);
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const round = {};
      for (const id of fields) {
        const el = document.getElementById(id);
        round[id] = el?.value?.trim() || '';
      }

      if (!round.date || !round.course || !round.score || !round.slope) {
        alert('Date, Course, Score, and Slope are required.');
        return;
      }

      const rounds = JSON.parse(localStorage.getItem('golfRounds') || '[]');
      rounds.push(round);
      localStorage.setItem('golfRounds', JSON.stringify(rounds));

      renderRounds(rounds);
      for (const id of fields) {
        const el = document.getElementById(id);
        if (el) el.value = '';
      }
    });
  }

  function renderRounds(rounds) {
    if (!roundList) return;
    roundList.innerHTML = '';
    for (const r of rounds) {
      const div = document.createElement('div');
      div.className = 'round-entry';
      div.innerHTML = `
        <div><strong>${r.date}</strong> — ${r.course}</div>
        <div>Score: ${r.score}, Slope: ${r.slope}${r.handicapInput ? `, HC: ${r.handicapInput}` : ''}</div>
        <div><em>${r.notes || '—'}</em></div>
      `;
      roundList.appendChild(div);
    }
  }

  renderRounds(JSON.parse(localStorage.getItem('golfRounds') || '[]'));
});
