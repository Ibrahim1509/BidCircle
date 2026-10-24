/* PLACEHOLDER for Mustafa's admin.js. Replace this file with Mustafa's real version.
   The shared data it will use is already available as BC.data (see README data contract). */
const phInfo = document.getElementById('ph-info');
if (phInfo) phInfo.textContent = 'Shared data ready: ' + BC.data.auctions.length + ' auctions, ' + BC.data.bids.length + ' bids, ' + BC.data.users.length + ' users.';
