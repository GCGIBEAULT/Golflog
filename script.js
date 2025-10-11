// script.js — Drop-in replacement
const form = document.getElementById('golfForm');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];

// Prevent Enter from submitting the form (except in notes)
if (form) {
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const tag = e.target.tagName.toLowerCase();
      const id = e.target.id;
      if (!(tag === 'textarea' || id === 'notes')) {
        e.preventDefault();
      }
    }
  });
}

// Save round and reset form
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const round = {
      date: (document.getElementById('date') || {}).value?.trim() || '',
      course: (document.getElementById('course') || {}).value?.trim() || '',
      score: (document.getElementById('score') || {}).value?.trim() || '',
      slope: (document.getElementById('slope') || {}).value?.trim() || '',
      handicap: (document.getElementById('handicapInput') || {}).value?.trim() || '',
      notes: (document.getElementById('notes') || {}).value?.trim() || ''
    };

    if (!round.date || !round.course || !round.score || !round.slope) {
      alert('Please fill Date, Course, Score and Slope before saving.');
      return;
    }

    const rounds = JSON.parse(localStorage.getItem('golfRounds') || '[]');
    rounds.push(round);
    localStorage.setItem('golfRounds', JSON.stringify(rounds));

    renderSavedRounds();
    clearFormFields();
  });
}

// Render saved rounds into #roundList
function renderSavedRounds() {
  const container = document.getElementById('roundList');
  if (!container) return;
  container.innerHTML = '';
  const rounds = JSON.parse(localStorage.getItem('golfRounds') || '[]');
  if (rounds.length === 0) {
    container.innerHTML = '<p>No rounds saved yet.</p>';
    return;
  }
  rounds.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'round-entry';
    div.innerHTML = `
      <div class="meta"><strong>${escapeHtml(r.date)}</strong> — ${escapeHtml(r.course)}</div>
      <div>Score: ${escapeHtml(r.score)}, Slope: ${escapeHtml(r.slope)}${r.handicap ? `, HC: ${escapeHtml(r.handicap)}` : ''}</div>
      <div class="notes">${escapeHtml(r.notes || '—')}</div>
    `;
    container.appendChild(div);
  });
}

// Clear form fields and autosave keys
function clearFormFields() {
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.value = '';
      localStorage.removeItem('field_' + id);
    }
  });
}

// Restore autosaved fields and render on load
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

// Autosave fields on input
fields.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    localStorage.setItem('field_' + id, el.value);
  });
});

// Simple HTML escape to avoid accidental markup injection
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Optional clear button hookup
if (clearBtn) clearBtn.addEventListener('click', clearFormFields);
