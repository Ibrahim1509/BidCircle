/* Module 1 - Bidding Engine (Ibrahim). SIMULATED: nothing is saved and there is no real concurrency control. */
(function () {
  const sel = document.getElementById("auction-select"), summary = document.getElementById("bid-summary");
  const form = document.getElementById("bid-form"), msg = document.getElementById("bid-msg");
  const amountEl = document.getElementById("bid-amount"), proxyEl = document.getElementById("proxy-max");
  const hist = document.getElementById("bid-history"), rivalBtn = document.getElementById("rival-btn"), buyBtn = document.getElementById("buy-btn"), placeBtn = document.getElementById("place-btn");
  const proxies = {}; // auctionId -> max amount (demo user)
  let a = null;

  sel.innerHTML = BC.data.auctions.map((x) => `<option value="${x.id}">${BC.esc(x.title)}</option>`).join("");
  const wanted = new URLSearchParams(location.search).get("id");
  if (wanted && BC.getAuction(wanted)) sel.value = wanted;

  const say = (text, kind) => { msg.className = "alert alert-" + kind; msg.textContent = text; };
  const clearMsg = () => { msg.className = ""; msg.textContent = ""; };

  function render() {
    BC.syncStatus(a);
    const live = a.status === "live", next = BC.minNextBid(a), px = proxies[a.id];
    summary.innerHTML = `<h2>${BC.esc(a.title)}</h2>
      <p><span class="badge badge-${a.status}">${BC.label(a.status)}</span> <span class="muted small">Seller: ${BC.esc(BC.userName(a.sellerId))}</span></p>
      <p class="muted small">Starting price: ${BC.money(a.startingPrice)} | Minimum increment: ${BC.money(a.minIncrement)}</p>
      <p class="muted">Current price</p><p class="big-price">${BC.money(a.currentPrice)}</p>
      <p>Highest bidder: <strong>${a.highestBidderId ? BC.esc(BC.userName(a.highestBidderId)) : "No bids yet"}</strong></p>
      <p>Next valid bid: <strong>${BC.money(next)}</strong></p>
      <p>${live ? 'Time left: <span class="countdown" id="cd"></span>' : a.status === "upcoming" ? "Bidding has not opened yet." : "This auction is closed." + (a.winnerId ? " Winner: " + BC.esc(BC.userName(a.winnerId)) : "")}</p>
      ${px ? `<p class="alert alert-info">Your proxy limit: ${BC.money(px)} (simulated auto-bidding)</p>` : ""}
      ${a.buyNowPrice ? `<p class="muted small">Buy Now price: ${BC.money(a.buyNowPrice)}</p>` : ""}`;
    placeBtn.disabled = rivalBtn.disabled = !live;
    buyBtn.disabled = !live || !a.buyNowPrice;
    buyBtn.textContent = a.buyNowPrice ? "Buy Now (" + BC.money(a.buyNowPrice) + ")" : "Buy Now not offered";
    amountEl.min = next; amountEl.placeholder = "At least " + next;
    const bids = BC.bidsFor(a.id);
    hist.innerHTML = bids.length ? bids.map((b) => `<tr><td>${BC.fmtTime(b.timestamp)}</td><td>${BC.esc(BC.userName(b.bidderId))}</td><td>${BC.money(b.amount)}</td><td>${b.type}</td></tr>`).join("") : `<tr><td colspan="4">No bids yet. Be the first to bid.</td></tr>`;
    tick();
  }
  function tick() { const cd = document.getElementById("cd"); if (cd) cd.textContent = BC.countdown(a.endTime - Date.now()); if (a.status === "live" && Date.now() >= a.endTime) render(); }

  function bid(who, amount, type) {
    const r = BC.placeBid(a, who, amount, type);
    if (r.extended) say("Anti-sniping: the bid arrived in the final 2 minutes, so the end time was extended by 2 minutes.", "warn");
    return r;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); BC.syncStatus(a);
    const amount = Number(amountEl.value), max = proxyEl.value === "" ? null : Number(proxyEl.value), min = BC.minNextBid(a);
    if (a.status !== "live") return say("This auction is not live, so bids are not accepted.", "error");
    if (amountEl.value.trim() === "" || Number.isNaN(amount)) return say("Enter your bid as a number.", "error");
    if (a.highestBidderId === BC.currentUserId) return say("You are already the highest bidder.", "error");
    if (amount < min) return say("Your bid is too low. The minimum is " + BC.money(min) + ".", "error");
    if (max !== null && (Number.isNaN(max) || max < amount)) return say("Your proxy limit must be at least your bid amount.", "error");
    bid(BC.currentUserId, amount, "manual");
    if (max !== null && max > amount) proxies[a.id] = max; else delete proxies[a.id];
    if (!msg.textContent.startsWith("Anti")) say("Demo bid placed: " + BC.money(amount) + ". (Simulated, not saved.)", "ok");
    form.reset(); render();
  });

  rivalBtn.addEventListener("click", () => {
    BC.syncStatus(a); if (a.status !== "live") return render();
    const rivals = BC.data.users.filter((u) => u.id !== BC.currentUserId && u.id !== a.sellerId && u.id !== a.highestBidderId);
    const rival = rivals[Math.floor(Math.random() * rivals.length)];
    const amount = BC.minNextBid(a) + a.minIncrement * Math.floor(Math.random() * 2);
    bid(rival.id, amount, "manual");
    const px = proxies[a.id], counter = a.currentPrice + a.minIncrement;
    if (px && px >= counter) { bid(BC.currentUserId, counter, "proxy"); say(BC.userName(rival.id) + " bid " + BC.money(amount) + ". Your proxy automatically countered with " + BC.money(counter) + ".", "info"); }
    else if (px) { delete proxies[a.id]; say(BC.userName(rival.id) + " bid " + BC.money(amount) + ", above your proxy limit. You were outbid (see Notifications).", "error"); }
    else say(BC.userName(rival.id) + " placed a simulated rival bid of " + BC.money(amount) + ".", "info");
    render();
  });

  buyBtn.addEventListener("click", () => {
    if (!window.confirm("Simulated Buy Now for " + BC.money(a.buyNowPrice) + "? This ends the auction in the demo.")) return;
    BC.data.bids.push({ id: "b" + (BC.data.bids.length + 1), auctionId: a.id, bidderId: BC.currentUserId, amount: a.buyNowPrice, timestamp: Date.now(), type: "buy-now" });
    a.currentPrice = a.buyNowPrice; a.bidCount++; a.highestBidderId = BC.currentUserId; a.winnerId = BC.currentUserId; a.endTime = Date.now();
    BC.notify(BC.currentUserId, "won", a.id, 'You bought "' + a.title + '" with Buy Now for ' + BC.money(a.buyNowPrice) + ".");
    say("Buy Now complete (simulated). The auction is closed.", "ok"); render();
  });

  sel.addEventListener("change", () => { a = BC.getAuction(sel.value); clearMsg(); render(); });
  a = BC.getAuction(sel.value); render();
  setInterval(tick, 1000);
})();
