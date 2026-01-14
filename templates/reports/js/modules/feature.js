
// js/modules/feature.js

const esc = (s) => (s ?? '').toString().trim();
const lines = (s) => esc(s).split(/\r?\n/).filter(Boolean);

/** Inline HTML fragment for Jira */
export function buildFeatureHTML(model) {
  const labels = lines(model.labels.replace(/,\s*/g, '\n')).map(l => `<span class="tag">${l}</span>`).join('');
  const acceptance = lines(model.acceptance).map(s => `<li><strong>${s.replace(/\b(Given|When|Then)\b/gi, (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase())}</strong></li>`).join('');

  return `
<div class="template-wrap">
  <div class="card">
    <h2>✨ Feature Request</h2>
    <div class="sub">Concise spec with acceptance criteria.</div>

    <div class="kv">
      <div class="k">Summary</div><div>${esc(model.summary) || '[Summary]'}</div>
      <div class="k">Type</div><div>${esc(model.type) || 'Enhancement'}</div>
      <div class="k">Stakeholders</div><div>${esc(model.stakeholders)}</div>
      <div class="k">Component</div><div>${esc(model.component)}</div>
    </div>

    <div class="section-title">User Story</div>
    <div>${esc(model.userStory)}</div>

    <div class="section-title">Acceptance Criteria (Gherkin)</div>
    <ul class="list">${acceptance || '<li><strong>Given</strong> ..., <strong>when</strong> ..., <strong>then</strong> ...</li>'}</ul>

    <div class="section-title">Scope / Constraints</div>
    <ul class="list">
      ${model.scopeIn ? `<li>In scope: ${esc(model.scopeIn)}</li>` : ''}
      ${model.scopeOut ? `<li>Out of scope: ${esc(model.scopeOut)}</li>` : ''}
      ${model.dependencies ? `<li>Dependencies: ${esc(model.dependencies)}</li>` : ''}
    </ul>

    ${model.notes ? `<div class="section-title">UX / Tech Notes</div><div>${esc(model.notes)}</div>` : ''}

    ${model.impact ? `<div class="section-title">Impact / Value</div><div>${esc(model.impact)}</div>` : ''}

    <div class="hr"></div>
    <div class="small">
      Estimate: ${esc(model.estimate)} · Assignee: ${esc(model.assignee)} · Labels:
      ${labels || '<span class="tag">feature</span>'}
      · Target Release: ${esc(model.release)}
    </div>
  </div>
</div>`;
}

/** Markdown fragment */
export function buildFeatureMarkdown(model) {
  const ac = lines(model.acceptance).map(s => `- ${s}`).join('\n') || '- Given ..., when ..., then ...';

  return `## ✨ Feature Request
**Summary:** ${esc(model.summary) || '[Summary]'}
**Type:** ${esc(model.type) || 'Enhancement'}
**Stakeholders:** ${esc(model.stakeholders)}
**Component:** ${esc(model.component)}

**User Story:**
${esc(model.userStory)}

**Acceptance Criteria (Gherkin):**
${ac}

**Scope / Constraints:**
${model.scopeIn ? `- In scope: ${esc(model.scopeIn)}\n` : ''}${model.scopeOut ? `- Out of scope: ${esc(model.scopeOut)}\n` : ''}${model.dependencies ? `- Dependencies: ${esc(model.dependencies)}\n` : ''}

**UX / Tech Notes:**
${esc(model.notes)}

**Impact / Value:** ${esc(model.impact)}

_Estimate:_ ${esc(model.estimate)} · _Assignee:_ ${esc(model.assignee)} · _Labels:_ ${esc(model.labels || 'feature')} · _Target Release:_ ${esc(model.release)}
`;
}

export function readFeatureForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  return {
    summary: esc(data.summary),
    type: esc(data.type),
    stakeholders: esc(data.stakeholders),
    component: esc(data.component),
    userStory: esc(data.userStory),
    acceptance: esc(data.acceptance),
    scopeIn: esc(data.scopeIn),
    scopeOut: esc(data.scopeOut),
    dependencies: esc(data.dependencies),
    notes: esc(data.notes),
    impact: esc(data.impact),
    estimate: esc(data.estimate),
    assignee: esc(data.assignee),
    release: esc(data.release),
    labels: esc(data.labels)
  };
}
