const form = document.getElementById('golfForm');

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
});

function saveRound(round) {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
}
