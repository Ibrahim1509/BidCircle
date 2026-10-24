/* Module 7 - Simulated Checkout & Transactions (Mustafa). NO real payments. */
(function () {
  const sel = document.getElementById("won-select"), sum = document.getElementById("order-summary"), form = document.getElementById("checkout-form"), receipt = document.getElementById("receipt"), hist = document.getElementById("tx-body"), none = document.getElementById("no-pending");
  const FEE = 0.02;
  const pending = () => BC.data.auctions.filter((a) => BC.syncStatus(a) === "closed" && a.winnerId === BC.currentUserId && !BC.data.transactions.some((t) => t.auctionId === a.id));
  function render() {
    const p = pending(); sel.innerHTML = p.map((a) => `<option value="${a.id}">${BC.esc(a.title)}</option>`).join("");
    none.hidden = p.length > 0; form.hidden = p.length === 0; summary();
    const mine = BC.data.transactions.filter((t) => t.buyerId === BC.currentUserId || t.sellerId === BC.currentUserId);
    hist.innerHTML = mine.length ? mine.map((t) => `<tr><td>${t.id}</td><td>${BC.esc(BC.getAuction(t.auctionId).title)}</td><td>${t.buyerId === BC.currentUserId ? "Bought" : "Sold"}</td><td>${BC.money(t.total)}</td><td><span class="badge badge-live">${t.status}</span></td><td>${BC.fmtTime(t.createdAt)}</td></tr>`).join("") : '<tr><td colspan="6">No transactions yet.</td></tr>';
  }
  function summary() { const a = BC.getAuction(sel.value); if (!a) { sum.innerHTML = ""; return; } const fee = Math.round(a.currentPrice * FEE);
    sum.innerHTML = `<table><tr><td>${BC.esc(a.title)}</td><td>${BC.money(a.currentPrice)}</td></tr><tr><td>Demo campus fee (2%)</td><td>${BC.money(fee)}</td></tr><tr><th>Total</th><th>${BC.money(a.currentPrice + fee)}</th></tr></table>`; }
  sel.addEventListener("change", summary);
  form.addEventListener("submit", (e) => { e.preventDefault(); if (!form.reportValidity()) return;
    const a = BC.getAuction(sel.value), fee = Math.round(a.currentPrice * FEE), method = form.elements.method.value;
    const t = { id: "t" + (BC.data.transactions.length + 1), auctionId: a.id, buyerId: BC.currentUserId, sellerId: a.sellerId, amount: a.currentPrice, fee, total: a.currentPrice + fee, status: "completed", method, createdAt: Date.now() };
    BC.data.transactions.push(t); form.reset();
    receipt.hidden = false; receipt.innerHTML = `<strong>Simulated order ${t.id} confirmed.</strong> ${BC.money(t.total)} via ${BC.esc(method)}. No money was charged.`; render(); });
  render();
})();
