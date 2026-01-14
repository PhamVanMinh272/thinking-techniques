
// js/main.js
import { buildBugHTML, buildBugMarkdown, readBugForm } from './modules/bug.js';
import { buildFeatureHTML, buildFeatureMarkdown, readFeatureForm } from './modules/feature.js';

const bugForm = document.getElementById('bugForm');
const bugPreview = document.getElementById('bugPreview');
const bugCopyMd = document.getElementById('bugCopyMd');
const bugCopyHtml = document.getElementById('bugCopyHtml');

const featureForm = document.getElementById('featureForm');
const featurePreview = document.getElementById('featurePreview');
const featureCopyMd = document.getElementById('featureCopyMd');
const featureCopyHtml = document.getElementById('featureCopyHtml');

function updateBug() {
  const model = readBugForm(bugForm);
  bugPreview.innerHTML = buildBugHTML(model);
}
function updateFeature() {
  const model = readFeatureForm(featureForm);
  featurePreview.innerHTML = buildFeatureHTML(model);
}

function attachAutoUpdate(form, update) {
  form.addEventListener('input', update);
  form.addEventListener('change', update);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied to clipboard ✔');
  } catch {
    alert('Copy failed. Select and copy manually.');
  }
}

function toast(msg) {
  // Quick Bootstrap toast-like feedback
  const el = document.createElement('div');
  el.className = 'position-fixed bottom-0 end-0 p-3';
  el.innerHTML = `
    <div class="toast align-items-center show" role="alert">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
      </div>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

// Initial previews
updateBug();
updateFeature();
attachAutoUpdate(bugForm, updateBug);
attachAutoUpdate(featureForm, updateFeature);

// Copy buttons
bugCopyMd.addEventListener('click', () => {
  const model = readBugForm(bugForm);
  copyText(buildBugMarkdown(model));
});
bugCopyHtml.addEventListener('click', () => {
  const model = readBugForm(bugForm);
  copyText(buildBugHTML(model));
});
featureCopyMd.addEventListener('click', () => {
  const model = readFeatureForm(featureForm);
  copyText(buildFeatureMarkdown(model));
});
featureCopyHtml.addEventListener('click', () => {
  const model = readFeatureForm(featureForm);
  copyText(buildFeatureHTML(model));
});
