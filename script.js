const form = document.getElementById('golfForm');
const log = document.getElementById('log');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const round = {
    date: document.getElementById('date').value,
    course: document.getElementById('course').value,
    score: document.getElementById('score').value,
    notes: document.getElementById('notes').value
  };
  saveRound(round);
  form.reset();
  renderRounds();
});

function saveRound(round) {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
}

function renderRounds() {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  log.innerHTML = '';
  rounds.forEach((r) => {
    const card = document.createElement('div');
    card.innerHTML = `<strong>${r.date}</strong> — ${r.course} — ${r.score}<br>${r.notes}`;
    log.appendChild(card);
  });
}

renderRounds();
