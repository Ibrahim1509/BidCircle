/* Module 5 - Listing & Category Management (Mustafa). Listings exist in memory only. */
(function () {
  const grid = document.getElementById("listing-grid"), q = document.getElementById("search"), cat = document.getElementById("category"), st = document.getElementById("status-filter"), sort = document.getElementById("sort"), empty = document.getElementById("empty-state"), count = document.getElementById("result-count");
  cat.innerHTML = '<option value="all">All categories</option>' + BC.data.categories.map((c) => `<option value="${BC.esc(c.name)}">${c.icon} ${BC.esc(c.name)}</option>`).join("");
  document.getElementById("f-category").innerHTML = '<option value="">Choose a category</option>' + BC.data.categories.map((c) => `<option>${BC.esc(c.name)}</option>`).join("");
  function render() {
    const term = q.value.trim().toLowerCase();
    let list = BC.data.auctions.filter((a) => (cat.value === "all" || a.category === cat.value) && (st.value === "all" || BC.syncStatus(a) === st.value) && (a.title + " " + a.description).toLowerCase().includes(term));
    if (sort.value === "ending") list.sort((a, b) => a.endTime - b.endTime);
    if (sort.value === "low") list.sort((a, b) => a.currentPrice - b.currentPrice);
    if (sort.value === "high") list.sort((a, b) => b.currentPrice - a.currentPrice);
    grid.innerHTML = list.map(BC.card).join("");
    empty.hidden = list.length > 0;
    count.textContent = list.length + " of " + BC.data.auctions.length + " listings shown";
  }
  [q, cat, st, sort].forEach((el) => el.addEventListener("input", render));
  document.getElementById("clear-filters").addEventListener("click", () => { q.value = ""; cat.value = "all"; st.value = "all"; sort.value = "ending"; render(); });

  const form = document.getElementById("listing-form"), ok = document.getElementById("listing-ok");
  const ids = ["f-title", "f-category", "f-condition", "f-desc", "f-start", "f-inc", "f-buy", "f-hours"];
  function validate() {
    let good = true;
    const buy = document.getElementById("f-buy"), start = document.getElementById("f-start");
    buy.setCustomValidity(buy.value !== "" && Number(buy.value) <= Number(start.value) ? "Buy Now price must be higher than the starting price." : "");
    ids.forEach((id) => { const el = document.getElementById(id); document.getElementById("err-" + id).textContent = el.checkValidity() ? "" : el.validationMessage; if (!el.checkValidity()) good = false; });
    return good;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault(); ok.hidden = true;
    if (!validate()) return;
    const v = (id) => document.getElementById(id).value, c = BC.data.categories.find((x) => x.name === v("f-category")), now = Date.now(), start = Number(v("f-start"));
    const a = { id: "a" + (BC.data.auctions.length + 1), title: v("f-title").trim(), description: v("f-desc").trim(), category: c.name, condition: v("f-condition"), sellerId: BC.currentUserId, startingPrice: start, currentPrice: start, minIncrement: Number(v("f-inc")), buyNowPrice: v("f-buy") ? Number(v("f-buy")) : null, status: "live", startTime: now, endTime: now + Number(v("f-hours")) * 3600000, highestBidderId: null, winnerId: null, bidCount: 0, extensions: 0, image: c.image };
    BC.data.auctions.unshift(a);
    ok.hidden = false; ok.textContent = 'Listing "' + a.title + '" is live (simulated, lost on reload).';
    form.reset(); render();
  });
  render();
})();
