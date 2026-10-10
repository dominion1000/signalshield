const samples = {
  phishing:{sender:"IT Help Desk <security@campus-support-login.xyz>",subject:"URGENT: Your student account will be disabled",body:"We detected unusual activity. Verify your password immediately within 2 hours or your account will be disabled. Click https://bit.ly/campus-verify to keep access."},
  ambiguous:{sender:"Team Finance <billing@vendor-invoices.com>",subject:"Invoice needs review",body:"Could you review the attached invoice today? The supplier says the account details changed. Please confirm before Friday."},
  safe:{sender:"Library Services <library@northbridge.edu>",subject:"Book due next Tuesday",body:"Your copy of Design for the Real World is due Tuesday. Return it at any library desk or sign in through the university portal you normally use to renew it."}
};
const $ = (q) => document.querySelector(q);
const form = $("#analyze-form"), result = $("#result");

document.querySelectorAll("[data-sample]").forEach((button) => button.addEventListener("click", () => {
  const sample = samples[button.dataset.sample];
  $("#sender").value = sample.sender; $("#subject").value = sample.subject; $("#body").value = sample.body;
  $("#body").focus();
}));

$("#clear").addEventListener("click", () => {
  form.reset();
  result.className = "card result empty";
  result.innerHTML = `<div class="empty-state"><div class="radar"><span></span></div><h2>Your analysis will appear here</h2><p>SignalShield checks language, links, sender identity, urgency, and manipulation patterns.</p></div>`;
});

function escapeHtml(value="") { return String(value).replace(/[&<>'"]/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }

function render(data) {
  const tone = data.score >= 65 ? "#f06a5f" : data.score >= 35 ? "#e0a443" : "#c8f05a";
  result.className = "card result";
  result.innerHTML = `
    <div class="result-head"><div><span class="step">02</span><h2>Risk analysis</h2></div><span class="engine">${escapeHtml(data.engine)}</span></div>
    <div class="verdict-block">
      <div class="score-ring" style="--score:${Number(data.score)};--tone:${tone}"><strong>${Number(data.score)}</strong><small>/ 100</small></div>
      <div class="verdict"><h3>${escapeHtml(data.verdict)}</h3><p>${escapeHtml(data.summary)}</p><div class="meta"><span>${escapeHtml(data.confidence)} confidence</span><span>${data.linksFound} link${data.linksFound===1?"":"s"}</span><span>${escapeHtml(data.senderDomain)}</span></div></div>
    </div>
    <div class="findings-title"><h4>Why it scored this way</h4><span class="engine">${data.findings.length} signals</span></div>
    <div>${data.findings.map(f=>`<div class="finding"><i class="dot ${escapeHtml(f.severity)}"></i><div><strong>${escapeHtml(f.label)}</strong><small>${escapeHtml(f.evidence)}</small></div></div>`).join("")}</div>
    <div class="actions"><h4>Safest next move</h4><ol>${data.nextSteps.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ol></div>`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button[type=submit]"); button.disabled = true;
  result.className = "card result empty loading";
  result.innerHTML = `<div class="empty-state"><div class="radar"><span></span></div><h2>Inspecting the signals…</h2><p>Checking intent, identity, links, pressure tactics, and context.</p></div>`;
  try {
    const response = await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sender:$("#sender").value,subject:$("#subject").value,body:$("#body").value})});
    const data = await response.json(); if(!response.ok) throw new Error(data.error); render(data);
  } catch(error) {
    result.className = "card result empty"; result.innerHTML = `<div class="empty-state"><h2>Analysis unavailable</h2><p>${escapeHtml(error.message || "Please try again.")}</p></div>`;
  } finally { button.disabled = false; }
});
