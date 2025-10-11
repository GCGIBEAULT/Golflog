// script.js - single canonical implementation
const form = document.getElementById('golfForm');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const fields = ['date', 'course', 'score', 'slope', 'handicapInput', 'notes'];

// Prevent Enter from submitting the form (allow Enter in notes)
if (form) {
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id !== 'notes') {
      e.preventDefault();
    }
  });

  // Neutralize form submit so Enter never saves
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // intentionally do nothing here so Enter never saves
  });
}

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
  if (!list) return;
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

// Single canonical handicap calculator used by UI and save
function calculateHandicap() {
  const scoreEl = document.getElementById('score');
  const slopeEl = document.getElementById('slope');
  const hcEl = document.getElementById('handicapInput');
  const score = scoreEl ? parseFloat(scoreEl.value) : NaN;
  const slope = slopeEl ? parseFloat(slopeEl.value) : NaN;
  const rating = 72; // change if you want configurable rating
  if (!isNaN(score) && !isNaN(slope) && slope > 0) {
    const differential = ((score - rating) * 113) / slope;
    const handicap = Math.round(differential * 10) / 10;
    if (hcEl) hcEl.value = handicap;
    return handicap;
  } else {
    if (hcEl) hcEl.value = '';
    return null;
  }
}

// Expose for Console debugging if needed
window.calculateHandicap = calculateHandicap;
window.saveRound = saveRound;

// Live UI updates (single pair of listeners)
const scoreInput = document.getElementById('score');
const slopeInput = document.getElementById('slope');
if (scoreInput) scoreInput.addEventListener('input', calculateHandicap);
if (slopeInput) slopeInput.addEventListener('input', calculateHandicap);

// Improved explicit Save button handler — robust parsing + fallback
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    const scoreRaw = (document.getElementById('score') || {}).value || '';
    const slopeRaw = (document.getElementById('slope') || {}).value || '';
    const scoreVal = parseFloat((scoreRaw + '').trim());
    const slopeVal = parseFloat((slopeRaw + '').trim());

    // inline calculation (defensive)
    const rating = 72;
    let handicap = null;
    if (!Number.isNaN(scoreVal) && !Number.isNaN(slopeVal) && slopeVal > 0) {
      const differential = ((scoreVal - rating) * 113) / slopeVal;
      handicap = Math.round(differential * 10) / 10;
    }

    // fallback: if inline calc failed but UI shows a value, use it
    if (handicap === null) {
      const uiVal = (document.getElementById('handicapInput') || {}).value || '';
      const uiNum = parseFloat((uiVal + '').trim());
      if (!Number.isNaN(uiNum)) handicap = Math.round(uiNum * 10) / 10;
    }

    // Last-resort debug: if still null, warn with context
    if (handicap === null) {
      console.warn('Save: handicap missing — score:', scoreRaw, 'slope:', slopeRaw, 'hcField:', (document.getElementById('handicapInput') || {}).value);
    }

    // Ensure UI shows computed/fallback result immediately
    const hcEl = document.getElementById('handicapInput');
    if (hcEl) hcEl.value = handicap ?? '';

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
  // Ensure handicap field matches restored score/slope on load
  calculateHandicap();
  renderSavedRounds();
});
