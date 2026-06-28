/**
 * ============================================================
 * CALCULATOR — script.js
 * Modular, well-commented calculator with:
 *   - Core arithmetic (÷ × − +), %, ±, decimal
 *   - Real-time display updates
 *   - Division-by-zero handling
 *   - Backspace & clear
 *   - Full keyboard support
 *   - Light/dark theme toggle
 *   - Calculation history (click to recall)
 *   - Result shimmer animation
 * ============================================================
 */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. STATE
   ────────────────────────────────────────────────────────── */
const state = {
  current:        '0',      // the number currently being built
  previous:       null,     // operand stored before operator press
  operator:       null,     // pending operator (÷ × − +)
  shouldReplace:  false,    // flag: next digit replaces current
  hasResult:      false,    // flag: last action was equals
  history:        [],       // array of { expr, result }
  historyOpen:    false,    // history panel visibility
  theme:          'dark',   // 'dark' | 'light'
  expression:     '',       // top-line expression string
};

/* ──────────────────────────────────────────────────────────
   2. DOM REFERENCES
   ────────────────────────────────────────────────────────── */
const dom = {
  displayValue:   document.getElementById('displayValue'),
  displayExpr:    document.getElementById('displayExpression'),
  calcDisplay:    document.getElementById('calcDisplay'),
  historyToggle:  document.getElementById('historyToggle'),
  historyPanel:   document.getElementById('historyPanel'),
  historyList:    document.getElementById('historyList'),
  historyEmpty:   document.getElementById('historyEmpty'),
  clearHistory:   document.getElementById('clearHistory'),
  themeToggle:    document.getElementById('themeToggle'),
  opButtons:      document.querySelectorAll('.btn--op'),
  htmlRoot:       document.documentElement,
};

/* ──────────────────────────────────────────────────────────
   3. DISPLAY HELPERS
   ────────────────────────────────────────────────────────── */

/**
 * Format a number string for display.
 * Caps at 12 significant figures; shows exponential for extremes.
 */
function formatDisplay(value) {
  if (value === 'Error' || value === 'Infinity' || value === '-Infinity') {
    return value;
  }

  // If it's mid-input (ends with '.') just show as-is
  if (value.endsWith('.')) return value;

  const num = parseFloat(value);
  if (isNaN(num)) return value;

  // For very large or very small numbers, use exponential notation
  if (Math.abs(num) >= 1e13 || (Math.abs(num) < 1e-7 && num !== 0)) {
    return num.toPrecision(6).replace(/\.?0+e/, 'e');
  }

  // Round to 10 decimal places to avoid floating-point artifacts
  const rounded = parseFloat(num.toPrecision(12));

  // Return without trailing zeros but keep as string
  return String(rounded);
}

/**
 * Update the display with current state values.
 * @param {boolean} isResult - apply result colour + shimmer
 * @param {boolean} isError  - apply error colour
 */
function updateDisplay(isResult = false, isError = false) {
  const raw = state.current;
  const formatted = formatDisplay(raw);

  dom.displayValue.textContent = formatted;
  dom.displayExpr.textContent  = state.expression;

  // Font-size scaling for long numbers
  const len = formatted.length;
  dom.displayValue.className = 'display-value';
  if (len <= 8)       dom.displayValue.classList.add('font-lg');
  else if (len <= 12) dom.displayValue.classList.add('font-md');
  else if (len <= 16) dom.displayValue.classList.add('font-sm');
  else                dom.displayValue.classList.add('font-xs');

  // Result / error colouring
  if (isError) {
    dom.displayValue.classList.add('is-error');
  } else if (isResult) {
    dom.displayValue.classList.add('is-result');
    triggerShimmer();
  }
}

/** Fire the shimmer animation on the display */
function triggerShimmer() {
  dom.calcDisplay.classList.remove('result-shimmer');
  // Force reflow so re-adding the class restarts the animation
  void dom.calcDisplay.offsetWidth;
  dom.calcDisplay.classList.add('result-shimmer');
}

/** Highlight / un-highlight the active operator button */
function setActiveOperator(op) {
  dom.opButtons.forEach(btn => {
    if (btn.dataset.value === op) btn.classList.add('is-active');
    else btn.classList.remove('is-active');
  });
}

/* ──────────────────────────────────────────────────────────
   4. CORE CALCULATION LOGIC
   ────────────────────────────────────────────────────────── */

/**
 * Convert display operator symbol to arithmetic operator.
 * '÷' → '/', '×' → '*', '−' → '-', '+' → '+'
 */
function symbolToOp(sym) {
  return { '÷': '/', '×': '*', '−': '-', '+': '+' }[sym] ?? sym;
}

/**
 * Perform arithmetic on two numbers.
 * Returns a number or 'Error' / 'Infinity'.
 */
function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (isNaN(a) || isNaN(b)) return 'Error';

  switch (op) {
    case '÷':
      if (b === 0) return a === 0 ? 'Error' : 'Infinity';
      return a / b;
    case '×': return a * b;
    case '−': return a - b;
    case '+': return a + b;
    default:  return 'Error';
  }
}

/* ──────────────────────────────────────────────────────────
   5. ACTION HANDLERS
   ────────────────────────────────────────────────────────── */

/**
 * Append a digit (0–9) to the current value.
 */
function handleDigit(digit) {
  // After equals or operator selection, start fresh
  if (state.shouldReplace) {
    state.current = digit === '0' ? '0' : digit;
    state.shouldReplace = false;
  } else if (state.current === '0' && digit !== '0') {
    state.current = digit;
  } else if (state.current === '0' && digit === '0') {
    // already zero, do nothing
  } else {
    // Limit input to 15 characters
    if (state.current.replace('-', '').replace('.', '').length >= 15) return;
    state.current += digit;
  }

  state.hasResult = false;
  updateDisplay();
}

/**
 * Append a decimal point.
 */
function handleDecimal() {
  if (state.shouldReplace) {
    state.current = '0.';
    state.shouldReplace = false;
    updateDisplay();
    return;
  }
  if (!state.current.includes('.')) {
    state.current += '.';
    updateDisplay();
  }
}

/**
 * Handle an operator press (+, −, ×, ÷).
 * If there's a pending operation, chain it first.
 */
function handleOperator(op) {
  if (state.hasResult) {
    // Continue chaining from the result
    state.previous = state.current;
    state.operator = op;
    state.expression = `${formatDisplay(state.current)} ${op}`;
    state.shouldReplace = true;
    state.hasResult = false;
    setActiveOperator(op);
    updateDisplay();
    return;
  }

  // Chain: if we already have a previous and operator, evaluate first
  if (state.previous !== null && !state.shouldReplace) {
    const result = calculate(state.previous, state.current, state.operator);
    const resultStr = (result === 'Error' || result === 'Infinity')
      ? result
      : String(parseFloat(result.toPrecision(12)));

    state.current  = resultStr;
    state.previous = resultStr;
    state.expression = `${formatDisplay(resultStr)} ${op}`;
  } else {
    state.previous   = state.current;
    state.expression = `${formatDisplay(state.current)} ${op}`;
  }

  state.operator     = op;
  state.shouldReplace = true;
  setActiveOperator(op);
  updateDisplay();
}

/**
 * Evaluate the pending expression.
 */
function handleEquals() {
  if (state.operator === null || state.previous === null) {
    // Nothing pending; flash current value
    updateDisplay(true);
    return;
  }

  const a = state.previous;
  const b = state.current;
  const op = state.operator;

  const fullExpr = `${formatDisplay(a)} ${op} ${formatDisplay(b)}`;

  const raw = calculate(a, b, op);
  const isErr = (raw === 'Error' || raw === 'Infinity');

  const resultStr = isErr
    ? raw
    : String(parseFloat(raw.toPrecision(12)));

  // ── Add to history ──
  if (!isErr) {
    addToHistory(fullExpr, resultStr);
  }

  state.expression   = `${fullExpr} =`;
  state.current      = resultStr;
  state.previous     = null;
  state.operator     = null;
  state.shouldReplace = true;
  state.hasResult    = true;

  setActiveOperator(null); // clear active op highlight
  updateDisplay(!isErr, isErr);
}

/**
 * Clear all state (C button / Escape key).
 */
function handleClear() {
  state.current       = '0';
  state.previous      = null;
  state.operator      = null;
  state.shouldReplace  = false;
  state.hasResult     = false;
  state.expression    = '';

  setActiveOperator(null);
  updateDisplay();
}

/**
 * Backspace: remove the last character from current.
 */
function handleBackspace() {
  // If just showed a result, clear entirely
  if (state.hasResult || state.shouldReplace) {
    handleClear();
    return;
  }

  if (state.current.length <= 1 || state.current === '0') {
    state.current = '0';
  } else {
    state.current = state.current.slice(0, -1);
    // Handle edge case like "-" or "-."
    if (state.current === '-' || state.current === '-.') {
      state.current = '0';
    }
  }
  updateDisplay();
}

/**
 * Toggle sign: positive ↔ negative.
 */
function handleSign() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay();
}

/**
 * Percentage: divide current by 100.
 * If a previous value exists, treats as fraction of it.
 */
function handlePercent() {
  const val = parseFloat(state.current);
  if (isNaN(val)) return;

  let result;
  if (state.previous !== null && state.operator !== null) {
    // e.g. 200 + 15% → 200 + 30
    result = (parseFloat(state.previous) * val) / 100;
  } else {
    result = val / 100;
  }

  state.current = String(parseFloat(result.toPrecision(12)));
  updateDisplay();
}

/* ──────────────────────────────────────────────────────────
   6. HISTORY
   ────────────────────────────────────────────────────────── */

/**
 * Add one entry to history and re-render the list.
 */
function addToHistory(expr, result) {
  state.history.unshift({ expr, result }); // newest first
  if (state.history.length > 50) state.history.pop(); // cap at 50
  renderHistory();
}

/**
 * Re-render the history list DOM.
 */
function renderHistory() {
  if (state.history.length === 0) {
    dom.historyEmpty.style.display = 'block';
    // Remove any existing items
    dom.historyList.querySelectorAll('.history-item').forEach(el => el.remove());
    return;
  }

  dom.historyEmpty.style.display = 'none';

  // Rebuild
  dom.historyList.querySelectorAll('.history-item').forEach(el => el.remove());

  state.history.forEach(({ expr, result }, idx) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `${expr} = ${result}. Click to recall.`);
    li.style.animationDelay = `${idx * 0.03}s`;
    li.innerHTML = `
      <div class="history-item__expr">${escapeHtml(expr)}</div>
      <div class="history-item__result">${escapeHtml(result)}</div>
    `;
    // Click/Enter to recall result
    li.addEventListener('click', () => recallHistory(result));
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') recallHistory(result);
    });
    dom.historyList.appendChild(li);
  });
}

/**
 * Recall a result from history into the display.
 */
function recallHistory(result) {
  handleClear();
  state.current = result;
  state.hasResult = true;
  updateDisplay(true);
}

/**
 * Sanitise HTML to prevent XSS in history items.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Toggle the history panel open/closed.
 */
function toggleHistory() {
  state.historyOpen = !state.historyOpen;
  dom.historyPanel.classList.toggle('is-open', state.historyOpen);
  dom.historyPanel.setAttribute('aria-hidden', String(!state.historyOpen));
  dom.historyToggle.setAttribute('aria-pressed', String(state.historyOpen));
}

/* ──────────────────────────────────────────────────────────
   7. THEME
   ────────────────────────────────────────────────────────── */

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  dom.htmlRoot.setAttribute('data-theme', state.theme);
  dom.themeToggle.setAttribute('aria-label',
    state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  // Persist preference
  try { localStorage.setItem('calc-theme', state.theme); } catch (_) {}
}

function loadThemePreference() {
  try {
    const saved = localStorage.getItem('calc-theme');
    if (saved === 'light' || saved === 'dark') {
      state.theme = saved;
      dom.htmlRoot.setAttribute('data-theme', saved);
    }
  } catch (_) {}
}

/* ──────────────────────────────────────────────────────────
   8. EVENT ROUTING
   ────────────────────────────────────────────────────────── */

/**
 * Dispatch a button action to the correct handler.
 */
function dispatchAction(action, value) {
  switch (action) {
    case 'digit':    handleDigit(value);    break;
    case 'decimal':  handleDecimal();       break;
    case 'operator': handleOperator(value); break;
    case 'equals':   handleEquals();        break;
    case 'clear':    handleClear();         break;
    case 'sign':     handleSign();          break;
    case 'percent':  handlePercent();       break;
    default: break;
  }
}

/* ──────────────────────────────────────────────────────────
   9. CLICK HANDLER (button grid delegation)
   ────────────────────────────────────────────────────────── */

document.querySelector('.calc-grid').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  dispatchAction(btn.dataset.action, btn.dataset.value);
  // Brief visual press for touch/mouse
  btn.classList.add('btn-pressed');
  setTimeout(() => btn.classList.remove('btn-pressed'), 120);
});

/* ──────────────────────────────────────────────────────────
   10. KEYBOARD SUPPORT
   ────────────────────────────────────────────────────────── */

document.addEventListener('keydown', e => {
  // Ignore if focus is inside history list (allow arrow keys there)
  if (e.target.closest('.history-list')) return;

  const key = e.key;

  if (key >= '0' && key <= '9')        { e.preventDefault(); handleDigit(key); }
  else if (key === '.')                 { e.preventDefault(); handleDecimal(); }
  else if (key === '+')                 { e.preventDefault(); handleOperator('+'); }
  else if (key === '-')                 { e.preventDefault(); handleOperator('−'); }
  else if (key === '*')                 { e.preventDefault(); handleOperator('×'); }
  else if (key === '/')                 { e.preventDefault(); handleOperator('÷'); }
  else if (key === 'Enter' || key === '=') { e.preventDefault(); handleEquals(); }
  else if (key === 'Backspace')         { e.preventDefault(); handleBackspace(); }
  else if (key === 'Escape')            { e.preventDefault(); handleClear(); }
  else if (key === '%')                 { e.preventDefault(); handlePercent(); }
  else if (key === 'h' || key === 'H')  { e.preventDefault(); toggleHistory(); }
  else if (key === 't' || key === 'T')  { e.preventDefault(); toggleTheme(); }
});

/* ──────────────────────────────────────────────────────────
   11. TOP-BAR BUTTON LISTENERS
   ────────────────────────────────────────────────────────── */

dom.historyToggle.addEventListener('click', toggleHistory);
dom.themeToggle.addEventListener('click', toggleTheme);
dom.clearHistory.addEventListener('click', () => {
  state.history = [];
  renderHistory();
});

/* ──────────────────────────────────────────────────────────
   12. INITIALISE
   ────────────────────────────────────────────────────────── */

(function init() {
  loadThemePreference();
  updateDisplay();
  renderHistory();
  console.log(
    '%ccalc. %cready',
    'color:#A855F7;font-family:monospace;font-weight:700;font-size:14px',
    'color:#8890B0;font-family:monospace;font-size:14px'
  );
})();
