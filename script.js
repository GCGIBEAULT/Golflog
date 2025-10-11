const form = document.getElementById('golfForm');
const log = document.getElementById('log');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop page refresh

  const round = {
    date: document.getElementById('date').value,
    course: document.getElementById('course').value,
    score: parseInt(document.getElementById('score').value),
    slope: parseInt(document.getElementById('slope').value),
    handicap: parseInt(document.getElementById('handicapInput').value) || null,
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
  rounds.forEach((r, index) => {
    const partialRounds = rounds.slice(0, index + 1);
    const handicap = calculateHandicap(partialRounds);

    const card = document.createElement('div');
    card.className = 'log-card';
    card.innerHTML = `
      <div class="log-line"><strong>Date:</strong> ${r.date}</div>
      <div class="log-line"><strong>Course:</strong> ${r.course}</div>
      <div class="log-line"><strong>Score:</strong> ${r.score}</div>
      <div class="log-line"><strong>Slope:</strong> ${r.slope}</div>
      <div class="handicap-line">Handicap (live): ${handicap}</div>
      <div class="log-line"><strong>Notes:</strong> ${r.notes}</div>
      <br>
    `;
    log.appendChild(card);
  });
}

function calculateHandicap(rounds) {
  const validRounds = rounds.filter(r => r.score && r.slope);
  if (validRounds.length === 0) return '—';

  const differentials = validRounds.map(r => ((r.score - 72) * 113) / r.slope);
  const avg = differentials.reduce((a, b) => a + b, 0) / validRounds.length;
  return Math.round(avg * 0.96);
}

renderRounds();
