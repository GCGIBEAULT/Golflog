// script.js - corrected
const form = document.getElementById('golfForm');
const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];

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

  const round = {
    date: (document.getElementById('date') || {}).value || '',
    course: (document.getElementById('course') || {}).value || '',
    score: parseInt((document.getElementById('score') || {}).value) || null,
    slope: parseInt((document.getElementById('slope') || {}).value) || null,
    handicap: parseInt((document.getElementById('handicapInput') || {}).value) || null,
    notes: (document.getElementById('notes') || {}).value || ''
  };

  saveRound(round);

  // Intentionally keep fields and their saved values in localStorage.
  // If you later want a manual "Clear" button, we can add that separately.
});

function saveRound(round) {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
}
