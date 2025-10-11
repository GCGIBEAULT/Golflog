// script.js - corrected
const form = document.getElementById('golfForm');
const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];

// ⛔ Prevent accidental Enter from submitting the form
form.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.target.id !== 'notes') {
    e.preventDefault();
  }
});

// Restore saved field values on page load
window.addEventListener('DOMContentLoaded', () => {
  fields.forEach(id => {
    const saved = localStorage.getItem(`field_${id}`);
    if (saved !== null) {
      const el = document.getElementById(id);
      if (el) el.value = saved;
    }
  });
});


// Save field values live as you type
fields.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    localStorage.setItem(`field_${id}`, el.value);
  });
});

// Handle form submit: log the round, but do NOT reset or delete field saves
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Force handicap calculation BEFORE building the round object
  calculateHandicap();

  // Small delay to ensure DOM updates before reading value
  setTimeout(() => {
    const round = {
      date: (document.getElementById('date') || {}).value || '',
      course: (document.getElementById('course') || {}).value || '',
      score: parseInt((document.getElementById('score') || {}).value) || null,
      slope: parseInt((document.getElementById('slope') || {}).value) || null,
      handicap: parseFloat((document.getElementById('handicapInput') || {}).value) || null,
      notes: (document.getElementById('notes') || {}).value || ''
    };

    saveRound(round);
  }, 10); // 10ms delay to let DOM update
});


function saveRound(round) {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
}
function calculateHandicap() {
  const score = parseFloat(document.getElementById('score').value);
  const slope = parseFloat(document.getElementById('slope').value);
  const rating = 72; // Default course rating

  if (!isNaN(score) && !isNaN(slope) && slope > 0) {
    const differential = ((score - rating) * 113) / slope;
    const handicap = Math.round(differential * 10) / 10; // round to 1 decimal
    document.getElementById('handicapInput').value = handicap;
  } else {
    document.getElementById('handicapInput').value = '';
  }
}

document.getElementById('score').addEventListener('input', calculateHandicap);
document.getElementById('slope').addEventListener('input', calculateHandicap);
