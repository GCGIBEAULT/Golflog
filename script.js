const form = document.getElementById('golfForm');

// Restore saved field values on page load
window.addEventListener('DOMContentLoaded', () => {
  const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];
  fields.forEach(id => {
    const saved = localStorage.getItem(`field_${id}`);
    if (saved !== null) {
      document.getElementById(id).value = saved;
    }
  });
});

// Save field values live as you type
['date', 'course', 'score', 'slope', 'handicapInput', 'notes'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    localStorage.setItem(`field_${id}`, el.value);
  });
});

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

  // Clear saved field values
  ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'].forEach(id => {
    localStorage.removeItem(`field_${id}`);
  });
});

function saveRound(round) {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
}
