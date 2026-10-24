/* BidCircle shared helpers (shared foundation). Changes here affect both developers - discuss first. */
const BC = (window.BidCircle = { data: window.BidCircleData, modules: {} });
BC.root = document.body.dataset.root || "";
BC.currentUserId = BC.data.currentUserId;
BC.pages = [
  ["home", "Home", "index.html"], ["auctions", "Auctions", "pages/auctions.html"], ["bidding", "Bidding", "pages/bidding.html"],
  ["lifecycle", "Lifecycle", "pages/lifecycle.html"], ["detection", "Detection", "pages/detection.html"],
  ["notifications", "Notifications", "pages/notifications.html"], ["trust", "Trust", "pages/trust.html"],
  ["checkout", "Checkout", "pages/checkout.html"], ["admin", "Admin", "pages/admin.html"]
];
BC.ANTI_SNIPE = { window: 120000, extension: 120000, max: 5 };

BC.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
BC.money = (n) => "PKR " + Number(n).toLocaleString("en-PK");
BC.fmtTime = (ms) => new Date(ms).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });
BC.label = (st) => ({ upcoming: "Upcoming", live: "Live", closed: "Closed" }[st] || st);
BC.getUser = (id) => BC.data.users.find((u) => u.id === id);
BC.userName = (id) => (BC.getUser(id) ? BC.getUser(id).name : "Unknown");
BC.getAuction = (id) => BC.data.auctions.find((a) => a.id === id);
BC.bidsFor = (id) => BC.data.bids.filter((b) => b.auctionId === id).sort((x, y) => y.timestamp - x.timestamp);
BC.minNextBid = (a) => (a.bidCount ? a.currentPrice + a.minIncrement : a.startingPrice);

BC.countdown = (ms) => {
  if (ms <= 0) return "0s";
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  if (d) return d + "d " + h + "h";
  if (h) return h + "h " + m + "m " + (s % 60) + "s";
  return m + "m " + (s % 60) + "s";
};

BC.syncStatus = (a) => {
  const t = Date.now();
  a.status = t >= a.endTime ? "closed" : t < a.startTime ? "upcoming" : "live";
  if (a.status === "closed" && !a.winnerId && a.bidCount > 0) a.winnerId = a.highestBidderId;
  return a.status;
};

BC.notify = (userId, type, auctionId, message) => {
  BC.data.notifications.unshift({ id: "n" + (BC.data.notifications.length + 1), userId, type, auctionId, message, createdAt: Date.now(), read: false });
  BC.renderHeader();
};

BC.applyAntiSnipe = (a) => {
  const left = a.endTime - Date.now();
  if (left > 0 && left <= BC.ANTI_SNIPE.window && a.extensions < BC.ANTI_SNIPE.max) {
    a.endTime += BC.ANTI_SNIPE.extension;
    a.extensions++;
    return true;
  }
  return false;
};

/* Shared simulated bid action. Used by bidding.js and lifecycle.js. In-memory only. */
BC.placeBid = (a, bidderId, amount, type) => {
  const prev = a.highestBidderId;
  BC.data.bids.push({ id: "b" + (BC.data.bids.length + 1), auctionId: a.id, bidderId, amount, timestamp: Date.now(), type: type || "manual" });
  a.currentPrice = amount;
  a.bidCount++;
  a.highestBidderId = bidderId;
  const extended = BC.applyAntiSnipe(a);
  if (prev && prev !== bidderId) BC.notify(prev, "outbid", a.id, 'You were outbid on "' + a.title + '". Current price: ' + BC.money(amount) + ".");
  return { extended };
};

BC.card = (a) => {
  const st = BC.syncStatus(a), left = a.endTime - Date.now();
  const info = st === "live" ? "Ends in " + BC.countdown(left) : st === "upcoming" ? "Starts in " + BC.countdown(a.startTime - Date.now()) : "Ended " + BC.fmtTime(a.endTime);
  return `<article class="card">
    <img src="${BC.root}${a.image}" alt="${BC.esc(a.category)} item: ${BC.esc(a.title)}" loading="lazy">
    <div class="card-body">
      <div class="row"><span class="badge badge-${st}">${BC.label(st)}</span><span class="muted small">${BC.esc(a.category)}</span></div>
      <h3>${BC.esc(a.title)}</h3>
      <p class="price">${BC.money(a.currentPrice)}</p>
      <p class="muted small">${info}</p>
      <a class="btn btn-primary" href="${BC.root}pages/bidding.html?id=${a.id}">${st === "live" ? "Bid now" : "View details"}</a>
    </div></article>`;
};

BC.renderHeader = () => {
  const el = document.getElementById("site-header"), cur = document.body.dataset.page;
  const unread = BC.data.notifications.filter((n) => n.userId === BC.currentUserId && !n.read).length;
  const links = BC.pages.map(([k, l, h]) => `<li><a href="${BC.root}${h}"${k === cur ? ' aria-current="page"' : ""}>${l}${k === "notifications" && unread ? ` <span class="count" aria-label="${unread} unread">${unread}</span>` : ""}</a></li>`).join("");
  const open = el.querySelector("nav.open") !== null;
  el.innerHTML = `<div class="container bar"><a class="brand" href="${BC.root}index.html">Bid<span>Circle</span></a>
    <button class="menu-btn" type="button" aria-expanded="${open}" aria-controls="main-nav">Menu</button>
    <nav id="main-nav" class="${open ? "open" : ""}" aria-label="Main"><ul>${links}</ul></nav>
    <span class="demo-user">Demo user: ${BC.esc(BC.userName(BC.currentUserId))}</span></div>`;
  const btn = el.querySelector(".menu-btn"), nav = el.querySelector("nav");
  btn.addEventListener("click", () => { const o = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
};

BC.renderFooter = () => {
  document.getElementById("site-footer").innerHTML = `<div class="container"><p><strong>BidCircle</strong> - CSC336 Web Technologies project, COMSATS University Islamabad.</p>
  <p class="muted small">Frontend demonstration only. Bids, payments, notifications and fraud flags are simulated with sample data in your browser and reset on reload. Nothing here is real authentication, payment or fraud prevention.</p></div>`;
};

BC.renderHeader();
BC.renderFooter();

/* Homepage content */
(function () {
  const feat = document.getElementById("featured");
  if (!feat) return;
  const live = BC.data.auctions.filter((a) => BC.syncStatus(a) === "live").slice(0, 3);
  feat.innerHTML = live.map(BC.card).join("");
  const s = document.getElementById("home-stats");
  const count = (st) => BC.data.auctions.filter((a) => BC.syncStatus(a) === st).length;
  s.innerHTML = `<div class="stat"><strong>${count("live")}</strong><span>live auctions</span></div><div class="stat"><strong>${count("upcoming")}</strong><span>starting soon</span></div><div class="stat"><strong>${BC.data.bids.length}</strong><span>bids placed</span></div>`;
})();
