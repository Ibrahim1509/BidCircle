/* Module 3 - Shill Bidding Detection (Ibrahim). PREDEFINED DEMO DATA - no real fraud detection. */
(function () {
  const list = document.getElementById("risk-list"), filter = document.getElementById("risk-filter"), sum = document.getElementById("risk-summary");
  function render() {
    const all = BC.data.suspiciousActivity, f = filter.value;
    sum.textContent = "High: " + all.filter((s) => s.riskLevel === "high").length + " | Medium: " + all.filter((s) => s.riskLevel === "medium").length + " | Low: " + all.filter((s) => s.riskLevel === "low").length;
    const shown = all.filter((s) => f === "all" || s.riskLevel === f).sort((x, y) => y.riskScore - x.riskScore);
    list.innerHTML = shown.length ? shown.map((s) => { const a = BC.getAuction(s.auctionId), m = s.metrics;
      return `<article class="panel risk-card risk-${s.riskLevel}"><div class="row"><h3>${BC.esc(BC.userName(s.bidderId))}</h3><span class="badge badge-${s.riskLevel}">${s.riskLevel} risk (${s.riskScore}/100)</span></div>
      <div class="meter" role="img" aria-label="Demo risk score ${s.riskScore} out of 100"><span style="width:${s.riskScore}%"></span></div>
      <p class="muted small">Auction: ${BC.esc(a ? a.title : s.auctionId)} | Flagged ${BC.fmtTime(s.flaggedAt)}</p>
      <p><strong>Why it was flagged (demo):</strong></p><ul>${s.reasons.map((r) => "<li>" + BC.esc(r) + "</li>").join("")}</ul>
      <p class="muted small">Bids on this auction: ${m.bidsOnAuction} | Share of seller's auctions bid on: ${m.sellerBidShare}% | Account age: ${m.accountAgeDays} days</p>
      <button class="btn btn-secondary btn-sm" data-id="${s.id}" type="button">${s.reviewed ? "Reviewed - undo" : "Mark as reviewed"}</button></article>`; }).join("") : `<div class="empty">No bidders match this risk level.</div>`;
  }
  list.addEventListener("click", (e) => { const id = e.target.dataset.id; if (!id) return; const s = BC.data.suspiciousActivity.find((x) => x.id === id); s.reviewed = !s.reviewed; e.target.textContent = s.reviewed ? "Reviewed - undo" : "Mark as reviewed"; });
  filter.addEventListener("change", render); render();
})();
