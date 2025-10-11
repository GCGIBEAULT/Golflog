// Golf Log — Editorially locked script.js

const form = document.getElementById('golfForm');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];

// 🛑 Prevent Enter from submitting the form (except in notes)
form.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const tag = e.target.tagName.toLowerCase();
    const id = e.target.id;
    if (!(tag === 'textarea' || id === 'notes')) {
      e.preventDefault();
    }
  }
});

// ✅ Save round and reset form
saveBtn.addEventListener('click', () => {
  const round = {
    date: document.getElementById('date').value.trim(),
    course: document.getElementById('course').value.trim(),
    score: document.getElementById('score').value.trim(),
    slope: document.getElementById('slope').value.trim(),
    handicap: document.getElementById('handicapInput').value.trim(),
    notes: document.getElementById('notes').value.trim()
  };

  if (!round.date || !round.course || !round.score || !round.slope) {
    alert('Please fill out all required fields before saving.');
    return;
  }

  const rounds = JSON.parse(localStorage.getItem('golfRounds') || '[]');
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
  renderSavedRounds();
  clearForm();
});

// ✅ Render saved rounds
function renderSavedRounds() {
  const container = document.getElementById('roundList');
  container.innerHTML = '';
  const rounds = JSON.parse(localStorage.getItem('golfRounds') || '[]');

  if (rounds.length === 0) {
    container.innerHTML = '<p>No rounds saved yet.</p>';
    return;
  }

  rounds.forEach(round => {
    const div = document.createElement('div');
    div.className = 'round';
    div.innerHTML = `
      <div class="meta">${round.date} — ${round.course}</div>
      <div>Score: ${round.score}, Slope: ${round.slope}${round.handicap ? `, HC: ${round.handicap}` : ''}</div>
      <div class="notes">${round.notes || '—'}</div>
    `;
    container.appendChild(div);
  });
}

// ✅ Clear form fields and autosave
function clearForm() {
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      localStorage.removeItem('field_' + id);
    }
  });
}

// ✅ Restore autosaved fields and rounds on load
window.addEventListener('DOMContentLoaded', () => {
  fields.forEach(id => {
    const saved = localStorage.getItem('field_' + id);
    if (saved !== null) {
      const el = document.getElementById(id);
      if (el) el.value = saved;
    }
  });
  renderSavedRounds();
});

// ✅ Autosave fields on input
fields.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    localStorage.setItem('field_' + id, el.value);
  });
});

// 🧹 Manual clear button (optional)
if (clearBtn) {
  clearBtn.addEventListener('click', clearForm);
}
