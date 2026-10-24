/* Module 8 - Admin & Analytics (Mustafa). Sample data only; there is NO real admin access control. */
(function () {
  const D = BC.data, live = D.auctions.filter((a) => BC.syncStatus(a) === "live").length;
  const vol = D.transactions.reduce((s, t) => s + t.total, 0);
  document.getElementById("admin-stats").innerHTML = [["Users", D.users.length], ["Live auctions", live], ["Total bids", D.bids.length], ["Simulated sales", BC.money(vol)]].map(([l, v]) => `<div class="panel stat-box"><strong>${v}</strong><span>${l}</span></div>`).join("");
  const mx = Math.max(...D.categories.map((c) => D.auctions.filter((a) => a.category === c.name).length), 1);
  document.getElementById("cat-chart").innerHTML = D.categories.map((c) => { const n = D.auctions.filter((a) => a.category === c.name).length; return `<div class="bar-row"><span>${c.icon} ${BC.esc(c.name)}</span><div class="meter" role="img" aria-label="${n} listings"><span style="width:${(n / mx) * 100}%"></span></div><b>${n}</b></div>`; }).join("");
  const flagged = document.getElementById("flagged-body"), reports = document.getElementById("report-body");
  function render() {
    const fl = D.suspiciousActivity.filter((s) => s.riskLevel !== "low");
    flagged.innerHTML = fl.length ? fl.map((s) => `<tr><td>${BC.esc(BC.userName(s.bidderId))}</td><td><span class="badge badge-${s.riskLevel}">${s.riskLevel} (${s.riskScore})</span></td><td>${BC.esc(s.reasons[0])}</td><td>${s.reviewed ? "Reviewed" : "Open"}</td></tr>`).join("") : '<tr><td colspan="4">No flagged users.</td></tr>';
    reports.innerHTML = D.reports.length ? D.reports.map((r) => { const name = r.targetType === "listing" ? (BC.getAuction(r.targetId) || {}).title : BC.userName(r.targetId);
      return `<tr><td>${r.targetType}</td><td>${BC.esc(name || r.targetId)}</td><td>${BC.esc(r.reason)}</td><td>${r.status}</td><td>${r.status === "open" ? `<button class="btn btn-secondary btn-sm" data-act="dismissed" data-id="${r.id}" type="button">Dismiss</button> <button class="btn btn-danger btn-sm" data-act="actioned" data-id="${r.id}" type="button">Take action</button>` : "-"}</td></tr>`; }).join("") : '<tr><td colspan="5">No reports.</td></tr>';
  }
  reports.addEventListener("click", (e) => { const id = e.target.dataset.id; if (!id) return; D.reports.find((r) => r.id === id).status = e.target.dataset.act; render(); });
  render();
})();
