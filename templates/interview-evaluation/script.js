// --- Config ---
const COMPETENCIES = [
  {
    key: 'fundamentals',
    title: 'Python Fundamentals',
    help: 'Syntax, data structures (list/dict/set/tuple), iteration, comprehensions, OOP & data model (dunder methods).',
  },
  {
    key: 'stdlib_packaging',
    title: 'Stdlib & Packaging',
    help: 'venv, pip, pyproject.toml, wheels; import system, modules, path management.',
  },
  {
    key: 'performance_concurrency',
    title: 'Performance & Concurrency',
    help: 'GIL impact; threading vs multiprocessing vs asyncio; profiling (cProfile), memory (tracemalloc).',
  },
  {
    key: 'testing_quality',
    title: 'Testing & Code Quality',
    help: 'pytest fixtures & parametrization; type hints, static checks; docstrings, linters.',
  },
  {
    key: 'data_numerics',
    title: 'Data & Numerics',
    help: 'NumPy broadcasting & vectorization; pandas pitfalls (chained assignment, indexes).',
  },
  {
    key: 'debug_tooling',
    title: 'Debugging & Tooling',
    help: 'Logging vs print; pdb/ipdb; profiling tools; exception hygiene.',
  },
];

const QUESTION_BANK = [
  'Explain list vs tuple trade-offs and when immutability helps.',
  'Walk through Python data model and a practical use of __iter__/__enter__/__exit__.',
  'How do you manage environments and packaging? pyproject.toml vs requirements.txt vs setup.cfg.',
  'What is the GIL? Contrast threading, multiprocessing, and asyncio with examples.',
  'Approach to profiling and optimizing Python (cProfile, time complexity, vectorization).',
  'NumPy broadcasting rules and common performance pitfalls. Give a code example.',
  'Pandas: avoid chained assignment; groupby vs apply; index best practices.',
  'pytest best practices: fixtures, parametrization, mocking; property-based testing.',
  'Logging configuration and structured logging; when to use WARNING vs INFO.',
  'Safe serialization: pickle vs json; risks in unpickling; Parquet for tabular data.',
  'Iterators/generators, lazy evaluation; memory-efficient data pipelines.',
  'Dataclasses vs attrs/pydantic—trade-offs for validation and performance.',
];

// --- Timer ---
let remaining = 12 * 60; // seconds
const timerEl = document.getElementById('timer');
const timer = setInterval(() => {
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  remaining -= 1;
  if (remaining < 0) {
    clearInterval(timer);
    timerEl.classList.remove('bg-warning');
    timerEl.classList.add('bg-danger');
    timerEl.textContent = 'Time!';
  }
}, 1000);

// --- Build ratings UI ---
const ratingsRoot = document.getElementById('ratings');
COMPETENCIES.forEach((c, idx) => {
  const row = document.createElement('div');
  row.className = 'rating-row';
  const header = document.createElement('h6');
  header.textContent = `${idx+1}. ${c.title}`;
  const help = document.createElement('div');
  help.className = 'help-text';
  help.textContent = c.help;
  const radios = document.createElement('div');
  radios.className = 'my-2';
  for (let i=1; i<=5; i++) {
    const id = `${c.key}_rating_${i}`;
    const w = document.createElement('div');
    w.className = 'form-check form-check-inline';
    w.innerHTML = `
      <input class="form-check-input" type="radio" name="${c.key}_rating" id="${id}" value="${i}">
      <label class="form-check-label" for="${id}">${i}</label>
    `;
    radios.appendChild(w);
  }
  const notes = document.createElement('textarea');
  notes.className = 'form-control';
  notes.rows = 2;
  notes.placeholder = 'Notes / evidence';
  notes.id = `${c.key}_notes`;
  row.appendChild(header);
  row.appendChild(help);
  row.appendChild(radios);
  row.appendChild(notes);
  ratingsRoot.appendChild(row);
});

// --- Build question list ---
const qRoot = document.getElementById('questionList');
QUESTION_BANK.forEach((q, i) => {
  const col = document.createElement('div');
  col.className = 'col';
  const item = document.createElement('div');
  item.className = 'form-check';
  const id = `q_${i}`;
  item.innerHTML = `
    <input class="form-check-input" type="checkbox" id="${id}" value="${q}">
    <label class="form-check-label" for="${id}">${q}</label>
  `;
  col.appendChild(item);
  qRoot.appendChild(col);
});

// --- Export helpers ---
function ratingLabel(n) {
  const map = {1:'Poor', 2:'Fair', 3:'Good', 4:'Very Good', 5:'Excellent'};
  return map[n] || 'Unrated';
}

function compileText() {
  const name = document.getElementById('candidateName').value?.trim() || 'Unknown';
  const role = document.getElementById('candidateRole').value?.trim() || '';
  const date = document.getElementById('sessionDate').value || new Date().toISOString().slice(0,10);
  const interviewer = document.getElementById('interviewer').value?.trim() || '';
  const years = document.getElementById('yearsExp').value?.trim() || '';
  const startTime = document.getElementById('startTime').value?.trim() || '';
  const rec = (document.querySelector('input[name="recommendation"]:checked')?.value) || 'Unspecified';
  const summary = document.getElementById('summary').value?.trim() || '';

  let lines = [];
  lines.push(`Candidate: ${name}`);
  lines.push(`Role: ${role}`);
  lines.push(`Date: ${date}`);
  lines.push(`Interviewer: ${interviewer}`);
  if (years) lines.push(`Years of experience: ${years}`);
  if (startTime) lines.push(`Start time: ${startTime}`);
  lines.push('');
  lines.push('Ratings (1–5):');

  COMPETENCIES.forEach((c, idx) => {
    const scoreEl = document.querySelector(`input[name="${c.key}_rating"]:checked`);
    const score = scoreEl ? parseInt(scoreEl.value,10) : null;
    const notes = document.getElementById(`${c.key}_notes`).value?.trim();
    const label = score ? ratingLabel(score) : 'Unrated';
    lines.push(`${idx+1}. ${c.title}: ${score || '-'} (${label})`);
    if (notes) lines.push(`   Notes: ${notes}`);
  });

  lines.push('');
  lines.push('Questions covered:');
  const qs = Array.from(document.querySelectorAll('#questionList input[type="checkbox"]'))
    .filter(x => x.checked)
    .map(x => x.value);
  if (qs.length) {
    qs.forEach(q => lines.push(`- ${q}`));
  } else {
    lines.push('- (None marked)');
  }

  lines.push('');
  lines.push(`Overall recommendation: ${rec}`);
  lines.push('');
  lines.push('Summary:');
  lines.push(summary || '(No summary)');

  return lines.join('\n');
}

function downloadTxt(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// --- Actions ---
document.getElementById('exportBtn').addEventListener('click', () => {
  const content = compileText();
  const name = document.getElementById('candidateName').value?.trim() || 'Candidate';
  const date = document.getElementById('sessionDate').value || new Date().toISOString().slice(0,10);
  const filename = `PythonInterview_Eval_${name.replace(/\s+/g,'_')}_${date}.txt`;
  downloadTxt(content, filename);
});

document.getElementById('copyBtn').addEventListener('click', async () => {
  const content = compileText();
  try {
    await navigator.clipboard.writeText(content);
    alert('Evaluation copied to clipboard.');
  } catch (e) {
    alert('Copy failed. You can still use Export to .txt');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all fields?')) return;
  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.type === 'radio' || el.type === 'checkbox') el.checked = false;
    else el.value = '';
  });
});
