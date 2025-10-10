if const form = document.getElementById('golfForm');
const log = document.getElementById('log');

form.addEventListener('submit', (e) => {
  e.preventDefault();
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
    card.innerHTML = `
      <strong>Date:</strong> ${r.date}<br>
      <strong>Course:</strong> ${r.course}<br>
      <strong>Score:</strong> ${r.score}<br>
      <strong>Slope:</strong> ${r.slope}<br>
      <strong>Handicap (live):</strong> ${handicap}<br>
      <strong>Notes:</strong> ${r.notes}
    `;
    log.appendChild(card);
  });
}


function calculateHandicap(rounds) {
  const validRounds = rounds.filter(r => r.score && r.slope);
  if (validRounds.length === 0) return '—';

  const differentials = validRounds.map(r => ((r.score - 72) * 113) / r.slope);
  const avg = differentials.reduce((a, b) => a + b, 0) / differentials.length;
  return Math.round(avg * 0.96); // USGA formula
}


renderRounds();
(score - 72) * 113 / slope
