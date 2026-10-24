/* Module 6 - Ratings & Trust (Mustafa). */
(function () {
  const list = document.getElementById("user-list"), prof = document.getElementById("profile");
  let selected = "u1"; const reported = new Set();
  const avg = (id) => { const r = BC.data.reviews.filter((x) => x.revieweeId === id); return r.length ? r.reduce((s, x) => s + x.rating, 0) / r.length : 0; };
  const stars = (n) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
  function render() {
    list.innerHTML = BC.data.users.map((u) => `<button type="button" class="btn ${u.id === selected ? "btn-primary" : "btn-secondary"}" data-u="${u.id}" aria-pressed="${u.id === selected}">${BC.esc(u.name)}</button>`).join("");
    const u = BC.getUser(selected), rs = BC.data.reviews.filter((r) => r.revieweeId === selected), a = avg(selected);
    prof.innerHTML = `<div class="row"><div><h2>${BC.esc(u.name)}</h2><p class="muted">${BC.esc(u.department)} | ${u.accountAgeDays} days on BidCircle</p></div><span class="badge ${u.verified ? "badge-live" : "badge-upcoming"}">${u.verified ? "Verified student" : "Not verified"}</span></div>
      <p class="rating"><span aria-hidden="true">${stars(a)}</span> <strong>${rs.length ? a.toFixed(1) : "No ratings"}</strong> <span class="muted">(${rs.length} reviews)</span></p>
      <h3>Reviews</h3>${rs.length ? rs.map((r) => `<blockquote class="review"><p>${BC.esc(r.comment)}</p><footer class="muted small">${"★".repeat(r.rating)} by ${BC.esc(BC.userName(r.reviewerId))}</footer></blockquote>`).join("") : '<div class="empty">No reviews yet.</div>'}
      ${u.id === BC.currentUserId ? '<p class="muted small">This is your own profile.</p>' : reported.has(u.id) ? '<p class="alert alert-ok" role="status">Report sent (simulated). Thank you.</p><button class="btn btn-danger btn-sm" disabled>Reported</button>' :
      `<form id="report-form"><label for="reason">Report this user</label><select id="reason" required><option value="">Select a reason</option><option>Did not show up</option><option>Item not as described</option><option>Suspicious bidding</option><option>Abusive behaviour</option></select><p class="field-error" id="reason-err"></p><button class="btn btn-danger btn-sm" type="submit">Send report</button></form>`}`;
    const f = document.getElementById("report-form");
    if (f) f.addEventListener("submit", (e) => { e.preventDefault(); const r = document.getElementById("reason"); if (!r.value) { document.getElementById("reason-err").textContent = "Choose a reason before sending."; return; }
      BC.data.reports.push({ id: "rp" + (BC.data.reports.length + 1), targetType: "user", targetId: selected, reporterId: BC.currentUserId, reason: r.value, createdAt: Date.now(), status: "open" }); reported.add(selected); render(); });
  }
  list.addEventListener("click", (e) => { if (e.target.dataset.u) { selected = e.target.dataset.u; render(); } });
  render();
})();
