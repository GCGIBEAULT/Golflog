// script.js - corrected
const form = document.getElementById('golfForm');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];

// --- Prevent Enter from submitting the form (allow Enter in notes) ---
form.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && e.target.id !== 'notes') {
    e.preventDefault();
  }
});

// --- Neutralize form submit so Enter never saves ---
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // intentionally do nothing so Enter cannot save
});

// --- Local storage helpers and render ---
function saveRound(round) {
  const rounds = JSON.parse(localStorage.getItem('golfRounds')) || [];
  rounds.push(round);
  localStorage.setItem('golfRounds', JSON.stringify(rounds));
  renderSavedRounds();
}

function loadRounds() {
  return JSON.parse(localStorage.getItem('golfRounds')) || [];
}

function renderSavedRounds() {
  const list = document.getElementById('roundList');
  list.innerHTML = '';
  const rounds = loadRounds();
  if (rounds.length === 0) {
    list.textContent = 'No saved rounds yet.';
    return;
  }
  rounds.slice().reverse().forEach(r => {
    const div = document.createElement('div');
    div.className = 'round';
    const t = document.createElement('time');
    t.textContent = r.date ? r.date : 'No date';
    div.appendChild(t);
    const meta = document.createElement('div');
    meta.innerHTML = '<strong>' + (r.course || 'No course') + '</strong> — Score: ' + (r.score ?? '—') + ', Slope: ' + (r.slope ?? '—') + ', HC: ' + (r.handicap ?? '—');
    div.appendChild(meta);
    if (r.notes) {
      const p = document.createElement('div');
      p.textContent = r.notes;
      div.appendChild(p);
    }
    list.appendChild(div);
  });
}

// --- Single canonical handicap calculator used by UI and save ---
function calculateHandicap() {
  const score = parseFloat(document.getElementById('score').value);
  const slope = parseFloat(document.getElementById('slope').value);
  const rating = 72; // change if you want configurable rating
  if (!isNaN(score) && !isNaN(slope) && slope > 0) {
    const differential = ((score - rating) * 113) / slope;
    const handicap = Math.round(differential * 10) / 10;
    document.getElementById('handicapInput').value = handicap;
    return handicap;
  } else {
    document.getElementById('handicapInput').value = '';
    return null;
  }
}

// Live UI updates (single pair of listeners)
document.getElementById('score').addEventListener('input', calculateHandicap);
document.getElementById('slope').addEventListener('input', calculateHandicap);

// --- Explicit Save button path (no form-submit reliance) ---
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    // Inline calculation so we never rely on DOM timing
    const scoreVal = parseFloat(document.getElementById('score').value);
    const slopeVal = parseFloat(document.getElementById('slope').value);
    const rating = 72;
    let handicap = null;
    if (!isNaN(scoreVal) && !isNaN(slopeVal) && slopeVal > 0) {
      const differential = ((scoreVal - rating) * 113) / slopeVal;
      handicap = Math.round(differential * 10) / 10;
    }

    // Ensure UI shows the computed value immediately
    document.getElementById('handicapInput').value = handicap ?? '';

    const round = {
      date: (document.getElementById('date') || {}).value || '',
      course: (document.getElementById('course') || {}).value || '',
      score: Number.isFinite(scoreVal) ? parseInt(scoreVal) : null,
      slope: Number.isFinite(slopeVal) ? parseInt(slopeVal) : null,
      handicap: handicap,
      notes: (document.getElementById('notes') || {}).value || ''
    };

    saveRound(round);
  });
}

// Clear fields helper
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
      localStorage.removeItem('field_' + id);
    });
  });
}

// Persist individual field values (optional behavior retained)
fields.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    localStorage.setItem('field_' + id, el.value);
  });
});

// Restore saved field values on load and render saved rounds
window.addEventListener('DOMContentLoaded', () => {
  fields.forEach(id => {
    const saved = localStorage.getItem('field_' + id);
    if (saved !== null) {
      const el = document.getElementById(id);
      if (el) el.value = saved;
    }
  });
  calculateHandicap();
  renderSavedRounds();
});
