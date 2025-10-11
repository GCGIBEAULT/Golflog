// script.js - corrected
const form = document.getElementById('golfForm');
const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];

// ⛔ Prevent accidental Enter from submitting the form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const score = parseFloat(document.getElementById('score').value);
  const slope = parseFloat(document.getElementById('slope').value);
  const rating = 72;
  let handicap = null;

  if (!isNaN(score) && !isNaN(slope) && slope > 0) {
    const differential = ((score - rating) * 113) / slope;
    handicap = Math.round(differential * 10) / 10;
  }

  // show the result immediately in the UI
  document.getElementById('handicapInput').value = handicap ?? '';

  const round = {
    date: (document.getElementById('date') || {}).value || '',
    course: (document.getElementById('course') || {}).value || '',
    score: Number.isFinite(score) ? parseInt(score) : null,
    slope: Number.isFinite(slope) ? parseInt(slope) : null,
    handicap: handicap,
    notes: (document.getElementById('notes') || {}).value || ''
  };

  saveRound(round);
});


function saveRound(round) {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
}
function calculateHandicap() {
  const score = parseFloat(document.getElementById('score').value);
  const slope = parseFloat(document.getElementById('slope').value);
  const rating = 72;
  if (!isNaN(score) && !isNaN(slope) && slope > 0) {
    const differential = ((score - rating) * 113) / slope;
    const handicap = Math.round(differential * 10) / 10;
    document.getElementById('handicapInput').value = handicap;
  } else {
    document.getElementById('handicapInput').value = '';
  }
}

document.getElementById('score').addEventListener('input', calculateHandicap);
document.getElementById('slope').addEventListener('input', calculateHandicap);

