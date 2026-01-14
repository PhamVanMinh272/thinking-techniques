
// js/modules/bug.js

const severityBadgeClass = (sev) => ({
  Critical: 'badge red',
  High: 'badge orange',
  Medium: 'badge blue',
  Low: 'badge green'
}[sev] || 'badge blue');

const esc = (s) => (s ?? '').toString().trim();
const lines = (s) => esc(s).split(/\r?\n/).filter(Boolean);

/** Build inline HTML fragment suitable to paste in Jira description */
export function buildBugHTML(model) {
  const steps = lines(model.steps).map(s => `<li>${s}</li>`).join('');
  const labels = lines(model.labels.replace(/,\s*/g, '\n')).map(l => `<span class="tag">${l}</span>`).join('');
  const sevClass = severityBadgeClass(model.severity);

  return `
<div class="template-wrap">
  <div class="card">
    <h2>🐞 Bug Report</h2>
    <div class="sub">Fill in under 5 minutes.</div>

    <div class="kv">
      <div class="k">Summary</div><div>${esc(model.summary) || '[Summary]'}</div>
      <div class="k">Severity</div><div><span class="${sevClass}">${esc(model.severity) || 'High'}</span></div>
      <div class="k">Priority</div><div>${esc(model.priority) || 'P1'}</div>
      <div class="k">Component</div><div>${esc(model.component)}</div>
      <div class="k">Environment</div><div>${esc(model.environment)}</div>
    </div>

    <div class="section-title">Steps to Reproduce</div>
    <ol class="list">${steps || '<li>[Step 1]</li><li>[Step 2]</li>'}</ol>

    <div class="section-title">Expected Result</div>
    <div>${esc(model.expected)}</div>

    <div class="section-title">Actual Result</div>
    <div>${esc(model.actual)}</div>

    <div class="section-title">Evidence</div>
    <div>
      ${esc(model.evidence)}
      ${esc(model.logs) ? `<div class="code">${esc(model.logs)}</div>` : ''}
    </div>

    <div class="section-title">Scope / Impact</div>
    <ul class="list">
      ${model.usersAffected ? `<li>Users affected: ${esc(model.usersAffected)}</li>` : ''}
      ${model.frequency ? `<li>Frequency: ${esc(model.frequency)}</li>` : ''}
      ${model.workaround ? `<li>Workaround: ${esc(model.workaround)}</li>` : ''}
    </ul>

    ${model.notes ? `<div class="section-title">Notes</div><div>${esc(model.notes)}</div>` : ''}

    <div class="hr"></div>
    <div class="small">
      ${model.assignee ? `Assignee: ${esc(model.assignee)} · ` : ''}
      Labels: ${labels || '<span class="tag">bug</span>'}
      ${model.affectsVersion ? ` · Affects Version(s): ${esc(model.affectsVersion)}` : ''}
      ${model.fixVersion ? ` · Fix Version: ${esc(model.fixVersion)}` : ''}
    </div>
  </div>
</div>`;
}

/** Build Markdown fragment (universal in Jira) */
export function buildBugMarkdown(model) {
  const steps = lines(model.steps).map((s, i) => `${i + 1}. ${s}`).join('\n') || '1. [Step 1]\n2. [Step 2]';
  const logsBlock = model.logs ? `\n\`\`\`\n${esc(model.logs)}\n\`\`\`\n` : '';

  return `## 🐞 Bug Report
**Summary:** ${esc(model.summary) || '[Summary]'}
**Severity:** ${esc(model.severity) || 'High'} · **Priority:** ${esc(model.priority) || 'P1'}
**Component:** ${esc(model.component)}
**Environment:** ${esc(model.environment)}

**Steps to Reproduce:**
${steps}

**Expected Result:** ${esc(model.expected)}
**Actual Result:** ${esc(model.actual)}

**Evidence:** ${esc(model.evidence)}${logsBlock}

**Scope / Impact:**
${model.usersAffected ? `- Users affected: ${esc(model.usersAffected)}\n` : ''}${model.frequency ? `- Frequency: ${esc(model.frequency)}\n` : ''}${model.workaround ? `- Workaround: ${esc(model.workaround)}\n` : ''}${model.notes ? `\n**Notes:** ${esc(model.notes)}\n` : ''}

_Assignee:_ ${esc(model.assignee)} · _Labels:_ ${esc(model.labels || 'bug')} · _Affects Versions:_ ${esc(model.affectsVersion)} · _Fix Version:_ ${esc(model.fixVersion)}
`;
}

/** Read form fields into a plain object */
export function readBugForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    summary: esc(data.summary),
    severity: esc(data.severity),
    priority: esc(data.priority),
    component: esc(data.component),
    environment: esc(data.environment),
    steps: esc(data.steps),
    expected: esc(data.expected),
    actual: esc(data.actual),
    evidence: esc(data.evidence),
    logs: esc(data.logs),
    usersAffected: esc(data.usersAffected),
    frequency: esc(data.frequency),
    workaround: esc(data.workaround),
    notes: esc(data.notes),
    affectsVersion: esc(data.affectsVersion),
    fixVersion: esc(data.fixVersion),
    assignee: esc(data.assignee),
    labels: esc(data.labels)
  };
}

