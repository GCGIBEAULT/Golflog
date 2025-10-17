document.addEventListener("DOMContentLoaded", () => {
  // Auto-fill today's date (keep current behavior)
  const dateField = document.getElementById("date");
  if (dateField && !dateField.value) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const yyyy = today.getFullYear();
    dateField.value = `${mm}/${dd}/${yyyy}`;
  }

  const saveBtn = document.getElementById("saveBtn");
  const savedRounds = document.getElementById("savedRounds");
  if (!savedRounds) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/\&/g, "&amp;").replace(/\</g, "&lt;")
      .replace(/\>/g, "&gt;").replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeStoredRound(raw) {
    // Coerce null to empty string, decode common encodings and remove HTML breaks
    const text = String(raw || "")
      .replace(/&lt;br&gt;/gi, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/\\u003E/gi, ">")
      .replace(/\s+/g, " ")
      .trim();
    return text;
  }

  function calculateCumulativeHandicap() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith("round_"));
    const handicaps = [];
    keys.forEach(key => {
      const raw = localStorage.getItem(key) || "";
      const text = normalizeStoredRound(raw);
      // tolerant regex: optional comma, flexible spacing, case-insensitive
      const match = text.match(/Score:\s*(\d+),?\s*Slope:\s*(\d+)/i);
      if (match) {
        const score = parseFloat(match[1]);
        const slope = parseFloat(match[2]);
        if (!isNaN(score) && !isNaN(slope) && slope !== 0) {
          const scaled = ((score - 72) / slope) * 113;
          const h = Math.max(0, Math.min(scaled, 36));
          handicaps.push(h);
        }
      }
    });
    const handicapField = document.getElementById("handicap");
    if (handicapField) {
      if (handicaps.length > 0) {
        const avg = handicaps.reduce((a, b) => a + b, 0) / handicaps.length;
        handicapField.value = avg.toFixed(1);
        // ensure mobile browsers repaint and propagate change
        handicapField.dispatchEvent(new Event('input'));
        handicapField.style.display = 'none';
        handicapField.offsetHeight; // trigger reflow
        handicapField.style.display = '';
      } else {
        handicapField.value = "—";
        handicapField.dispatchEvent(new Event('input'));
      }
    }
  }

  function displayRounds() {
    savedRounds.innerHTML = "<h2>Saved Rounds</h2>";
    const keys = Object.keys(localStorage).filter(k => k.startsWith("round_")).sort().reverse();
    keys.forEach(key => {
      const raw = localStorage.getItem(key) || "";
      // Convert stored breaks to visible <br> for display, then split
      const normalizedForDisplay = String(raw)
        .replace(/&lt;br&gt;/gi, "<br>")
        .replace(/\\u003E/gi, ">")
        .replace(/(^|[^<])br>/gi, "<br>")
        .replace(/<br\s*\/?>/gi, "<br>");
      const lines = normalizedForDisplay.split("<br>");
      const line1 = lines[0]?.trim() || "";
      const rest = lines.slice(1).map(l => escapeHtml(l.trim())).join("<br>");
      const entry = document.createElement("div");
      entry.className = "round-entry";
      entry.innerHTML = ` <span class="round-text"> ${escapeHtml(line1)}<br>${rest} </span> <button class="delete-btn" data-key="${key}" title="Delete this round">×</button> `;
      savedRounds.appendChild(entry);
      const del = entry.querySelector(".delete-btn");
      if (del) {
        del.addEventListener("click", function () {
          const keyToDelete = this.getAttribute("data-key");
          if (keyToDelete) {
            localStorage.removeItem(keyToDelete);
            displayRounds();
            calculateCumulativeHandicap();
          }
        });
      }
    });
    // Ensure handicap calculation runs after rounds are displayed
    calculateCumulativeHandicap();
  }

  function saveRound() {
    const date = document.getElementById("date")?.value || "";
    const course = document.getElementById("course")?.value || "";
    const scoreVal = parseFloat(document.getElementById("score")?.value || "");
    const slopeVal = parseFloat(document.getElementById("slope")?.value || "");
    const yardage = document.getElementById("yardage")?.value || "";
    const notes = document.getElementById("notes")?.value || "";

    // Mandatory field check
    if (!course || isNaN(scoreVal) || isNaN(slopeVal)) {
      alert("Please enter Course, Score, and Slope before saving.");
      return;
    }

    // Keep the existing per-round handicap calculation (stored for convenience)
    let handicapVal = "";
    if (!isNaN(scoreVal) && !isNaN(slopeVal) && slopeVal !== 0) {
      const scaled = ((scoreVal - 72) / slopeVal) * 113;
      handicapVal = Math.max(0, Math.min(scaled, 36)).toFixed(1);
    }

    const round = `${date} — ${course}<br>Score: ${scoreVal}, Slope: ${slopeVal}, Yardage: ${yardage}<br>Notes: ${notes || ""}`;
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem("round_" + timestamp, round);
    } catch (err) {
      console.warn("localStorage write failed", err);
    }

    // Immediately update UI and recalc handicap
    displayRounds();

    // Reset form but keep auto-fill of today's date (current behavior)
    const form = document.getElementById("roundForm") || document.querySelector("form");
    if (form) try { form.reset(); } catch (e) {}

    // Refill date only as current behavior expects
    const dateFieldAfter = document.getElementById("date");
    if (dateFieldAfter) {
      try {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const yyyy = today.getFullYear();
        dateFieldAfter.value = `${mm}/${dd}/${yyyy}`;
        dateFieldAfter.focus();
        if (dateFieldAfter.setSelectionRange) dateFieldAfter.setSelectionRange(0, 0);
      } catch (e) {}
    }
  }

  if (saveBtn) {
    saveBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveRound();
      // Small safety guard: ensure the calc runs after save on flaky mobile timing
      setTimeout(() => { calculateCumulativeHandicap(); }, 40);
    });
  }

  // Initial render
  displayRounds();
});
function saveRoundToLocal(roundData, courseLayout) {
  const course = document.getElementById("course-name")?.value || "Unnamed Course";
  const date = document.getElementById("round-date")?.value || new Date().toLocaleDateString();
  const handicap = document.getElementById("handicap")?.value || "N/A";

  const savedRounds = JSON.parse(localStorage.getItem("rounds") || "[]");

  savedRounds.push({
    course,
    date,
    handicap,
    courseLayout,
    roundData
  });

  localStorage.setItem("rounds", JSON.stringify(savedRounds));
}
