/* Module 4 - Notifications (Ibrahim). Local simulation only. */
(function () {
  const list = document.getElementById("notif-list"), tabs = document.getElementById("notif-tabs"), status = document.getElementById("notif-status");
  const groups = { all: "All", unread: "Unread", outbid: "Outbid", ending: "Ending", won: "Won", sold: "Sold" };
  let filter = "all";
  const mine = () => BC.data.notifications.filter((n) => n.userId === BC.currentUserId).sort((a, b) => b.createdAt - a.createdAt);
  const ago = (ms) => { const m = Math.max(1, Math.round((Date.now() - ms) / 60000)); return m < 60 ? m + " min ago" : m < 1440 ? Math.round(m / 60) + " h ago" : Math.round(m / 1440) + " d ago"; };
  tabs.innerHTML = Object.keys(groups).map((k) => `<button type="button" class="btn btn-secondary btn-sm" data-f="${k}" aria-pressed="${k === filter}">${groups[k]}</button>`).join("");
  function render() {
    const all = mine(), shown = all.filter((n) => filter === "all" || (filter === "unread" ? !n.read : n.type === filter));
    status.textContent = all.filter((n) => !n.read).length + " unread of " + all.length;
    list.innerHTML = shown.length ? shown.map((n) => `<div class="notif ${n.read ? "read" : "unread"}"><div><span class="badge badge-${n.type === "outbid" ? "high" : n.type === "ending" ? "medium" : "low"}">${n.type}</span><p>${BC.esc(n.message)}</p><p class="muted small">${ago(n.createdAt)}${n.auctionId ? ' | <a href="' + BC.root + "pages/bidding.html?id=" + n.auctionId + '">View auction</a>' : ""}</p></div>
      ${n.read ? '<span class="muted small">Read</span>' : `<button class="btn btn-secondary btn-sm" data-read="${n.id}" type="button">Mark as read</button>`}</div>`).join("") : `<div class="empty">You're all caught up. No notifications here.</div>`;
    tabs.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.f === filter));
    BC.renderHeader();
  }
  tabs.addEventListener("click", (e) => { if (e.target.dataset.f) { filter = e.target.dataset.f; render(); } });
  list.addEventListener("click", (e) => { const id = e.target.dataset.read; if (!id) return; BC.data.notifications.find((n) => n.id === id).read = true; render(); });
  document.getElementById("read-all").addEventListener("click", () => { mine().forEach((n) => (n.read = true)); render(); });
  document.getElementById("sim-alert").addEventListener("click", () => { const a = BC.data.auctions.find((x) => BC.syncStatus(x) === "live"); BC.notify(BC.currentUserId, "outbid", a.id, 'Simulated alert: someone outbid you on "' + a.title + '".'); render(); });
  render();
})();
