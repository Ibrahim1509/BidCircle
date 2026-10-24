/* Module 2 - Auction Lifecycle & Live Updates (Ibrahim). Local simulation, no server. */
(function () {
  const body = document.getElementById("life-body"), sel = document.getElementById("life-select"), log = document.getElementById("event-log"), bidBody = document.getElementById("life-bids");
  sel.innerHTML = BC.data.auctions.map((x) => `<option value="${x.id}">${BC.esc(x.title)}</option>`).join("");
  const A = () => BC.getAuction(sel.value);
  const note = (t) => { const li = document.createElement("li"); li.textContent = new Date().toLocaleTimeString() + " - " + t; log.prepend(li); };

  function render() {
    body.innerHTML = BC.data.auctions.map((x) => { const st = BC.syncStatus(x); const t = st === "live" ? x.endTime : x.startTime;
      return `<tr><td>${BC.esc(x.title)}</td><td><span class="badge badge-${st}">${BC.label(st)}</span></td><td class="countdown">${st === "closed" ? "Ended " + BC.fmtTime(x.endTime) : (st === "live" ? "Ends in " : "Starts in ") + BC.countdown(t - Date.now())}</td><td>${x.extensions}</td></tr>`; }).join("");
    const bids = BC.bidsFor(sel.value);
    bidBody.innerHTML = bids.length ? bids.map((b) => `<tr><td>${BC.fmtTime(b.timestamp)}</td><td>${BC.esc(BC.userName(b.bidderId))}</td><td>${BC.money(b.amount)}</td></tr>`).join("") : `<tr><td colspan="3">No bids for this auction yet.</td></tr>`;
  }
  const act = {
    "start-btn": () => { const a = A(); if (BC.syncStatus(a) !== "upcoming") return note("Only upcoming auctions can be started."); a.startTime = Date.now(); note('"' + a.title + '" is now live.'); },
    "final-btn": () => { const a = A(); if (BC.syncStatus(a) !== "live") return note("Auction must be live."); a.endTime = Date.now() + 60000; note("End time moved to 60 seconds from now."); },
    "snipe-btn": () => { const a = A(); if (BC.syncStatus(a) !== "live") return note("Auction must be live."); const rival = BC.data.users.find((u) => u.id !== a.sellerId && u.id !== a.highestBidderId && u.id !== BC.currentUserId);
      const r = BC.placeBid(a, rival.id, BC.minNextBid(a), "manual"); note(BC.userName(rival.id) + " bid " + BC.money(a.currentPrice) + (r.extended ? ". Anti-sniping extended the end time by 2 minutes (extension " + a.extensions + " of " + BC.ANTI_SNIPE.max + ")." : ". Not in the final 2 minutes, so no extension.")); },
    "close-btn": () => { const a = A(); if (BC.syncStatus(a) === "closed") return note("Already closed."); a.endTime = Date.now(); BC.syncStatus(a); note('"' + a.title + '" closed' + (a.winnerId ? ". Winner: " + BC.userName(a.winnerId) : " with no bids.")); if (a.winnerId) { BC.notify(a.winnerId, "won", a.id, 'You won "' + a.title + '" for ' + BC.money(a.currentPrice) + "."); BC.notify(a.sellerId, "sold", a.id, 'Your listing "' + a.title + '" sold for ' + BC.money(a.currentPrice) + "."); } }
  };
  Object.keys(act).forEach((id) => document.getElementById(id).addEventListener("click", () => { act[id](); render(); }));
  sel.addEventListener("change", render);
  render(); note("Page loaded. Times are simulated relative to now.");
  setInterval(render, 1000);
})();
