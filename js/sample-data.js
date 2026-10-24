/* BidCircle shared sample data - THE DATA CONTRACT (see README).
   Simulated demo data only. Times are relative to page load so the demo always has live auctions.
   Do NOT rename properties without agreeing with your partner. */
(function () {
  const now = Date.now(), MIN = 60000, HR = 3600000, DAY = 24 * HR;
  const data = {
    currentUserId: "u1",
    categories: [
      { id: "c1", name: "Books", icon: "📚", image: "images/cat-books.svg" },
      { id: "c2", name: "Electronics", icon: "🔌", image: "images/cat-electronics.svg" },
      { id: "c3", name: "Furniture", icon: "🪑", image: "images/cat-furniture.svg" },
      { id: "c4", name: "Clothing", icon: "🧥", image: "images/cat-clothing.svg" },
      { id: "c5", name: "Sports", icon: "🏸", image: "images/cat-sports.svg" }
    ],
    // User: id, name, department, accountAgeDays, verified, role
    users: [
      { id: "u1", name: "Ayesha Khan", department: "BS Software Engineering", accountAgeDays: 210, verified: true, role: "student" },
      { id: "u2", name: "Hamza Ali", department: "BS Computer Science", accountAgeDays: 340, verified: true, role: "student" },
      { id: "u3", name: "Sara Ahmed", department: "BS Electrical Engineering", accountAgeDays: 120, verified: true, role: "student" },
      { id: "u4", name: "Bilal Raza", department: "BBA", accountAgeDays: 75, verified: true, role: "student" },
      { id: "u5", name: "Zainab Tariq", department: "BS Computer Science", accountAgeDays: 6, verified: false, role: "student" },
      { id: "u6", name: "Usman Sheikh", department: "BS Mathematics", accountAgeDays: 5, verified: false, role: "student" }
    ],
    // Auction: status is 'upcoming' | 'live' | 'closed' (BC.syncStatus recomputes it from startTime/endTime)
    auctions: [
      { id: "a1", title: "Casio fx-991EX Scientific Calculator", description: "Barely used, includes cover. Great for exams.", category: "Electronics", condition: "Like new", sellerId: "u2", startingPrice: 2500, currentPrice: 2900, minIncrement: 100, buyNowPrice: 6000, status: "live", startTime: now - DAY, endTime: now + 5 * HR, highestBidderId: "u5", winnerId: null, bidCount: 3, extensions: 0, image: "images/cat-electronics.svg" },
      { id: "a2", title: "Data Structures & Algorithms Textbook", description: "Clean copy, no highlighting. Latest edition.", category: "Books", condition: "Good", sellerId: "u3", startingPrice: 1200, currentPrice: 1400, minIncrement: 50, buyNowPrice: 2500, status: "live", startTime: now - DAY, endTime: now + 4 * MIN, highestBidderId: "u1", winnerId: null, bidCount: 3, extensions: 0, image: "images/cat-books.svg" },
      { id: "a3", title: "Wooden Study Desk", description: "Sturdy desk with one drawer. Pickup from hostel block B.", category: "Furniture", condition: "Good", sellerId: "u4", startingPrice: 8000, currentPrice: 9000, minIncrement: 250, buyNowPrice: 15000, status: "live", startTime: now - 6 * HR, endTime: now + DAY, highestBidderId: "u5", winnerId: null, bidCount: 3, extensions: 0, image: "images/cat-furniture.svg" },
      { id: "a4", title: "Engineering Drawing Set", description: "Complete set with drafter and case.", category: "Books", condition: "Good", sellerId: "u2", startingPrice: 1500, currentPrice: 1800, minIncrement: 100, buyNowPrice: null, status: "closed", startTime: now - 2 * DAY, endTime: now - 2 * HR, highestBidderId: "u1", winnerId: "u1", bidCount: 2, extensions: 0, image: "images/cat-books.svg" },
      { id: "a5", title: "Logitech Gaming Mouse", description: "Works perfectly, 6 buttons.", category: "Electronics", condition: "Good", sellerId: "u1", startingPrice: 2500, currentPrice: 3200, minIncrement: 100, buyNowPrice: null, status: "closed", startTime: now - 3 * DAY, endTime: now - DAY, highestBidderId: "u3", winnerId: "u3", bidCount: 2, extensions: 0, image: "images/cat-electronics.svg" },
      { id: "a6", title: "University Winter Hoodie (M)", description: "Warm fleece hoodie, worn twice.", category: "Clothing", condition: "Like new", sellerId: "u1", startingPrice: 1800, currentPrice: 1800, minIncrement: 100, buyNowPrice: 3500, status: "upcoming", startTime: now + 2 * HR, endTime: now + 2 * DAY, highestBidderId: null, winnerId: null, bidCount: 0, extensions: 0, image: "images/cat-clothing.svg" },
      { id: "a7", title: "Yonex Badminton Racket", description: "Includes cover and two shuttles.", category: "Sports", condition: "Good", sellerId: "u5", startingPrice: 2200, currentPrice: 2200, minIncrement: 100, buyNowPrice: 4500, status: "upcoming", startTime: now + 30 * MIN, endTime: now + DAY, highestBidderId: null, winnerId: null, bidCount: 0, extensions: 0, image: "images/cat-sports.svg" },
      { id: "a8", title: "Mini Fridge (45L)", description: "Perfect for hostel rooms. Cooling works well.", category: "Electronics", condition: "Fair", sellerId: "u4", startingPrice: 12000, currentPrice: 13500, minIncrement: 500, buyNowPrice: 22000, status: "live", startTime: now - 3 * HR, endTime: now + 2 * DAY, highestBidderId: "u6", winnerId: null, bidCount: 4, extensions: 0, image: "images/cat-electronics.svg" }
    ],
    bids: [],           // Bid: id, auctionId, bidderId, amount, timestamp(ms), type ('manual'|'proxy'|'buy-now')
    notifications: [],  // Notification: id, userId, type, auctionId, message, createdAt, read
    reviews: [],        // Review: id, reviewerId, revieweeId, auctionId, rating(1-5), comment, createdAt
    transactions: [],   // Transaction: id, auctionId, buyerId, sellerId, amount, fee, total, status, method, createdAt
    suspiciousActivity: [], // SuspiciousActivity: id, auctionId, bidderId, riskScore, riskLevel, reasons[], metrics{}, flaggedAt, reviewed
    reports: []         // Report: id, targetType('user'|'listing'), targetId, reporterId, reason, createdAt, status
  };
  const addBids = (aid, list) => list.forEach(([u, amt, ago, type]) =>
    data.bids.push({ id: "b" + (data.bids.length + 1), auctionId: aid, bidderId: u, amount: amt, timestamp: now - ago * MIN, type: type || "manual" }));
  addBids("a1", [["u3", 2500, 300], ["u1", 2700, 200], ["u5", 2900, 90]]);
  addBids("a2", [["u2", 1200, 400], ["u4", 1300, 250], ["u1", 1400, 120]]);
  addBids("a3", [["u2", 8000, 200], ["u3", 8500, 150], ["u5", 9000, 100]]);
  addBids("a4", [["u3", 1500, 3000], ["u1", 1800, 2900]]);
  addBids("a5", [["u4", 2500, 2000], ["u3", 3200, 1900]]);
  addBids("a8", [["u5", 12000, 60], ["u6", 12500, 55], ["u5", 13000, 50], ["u6", 13500, 45]]);
  const n = (userId, type, auctionId, message, ago, read) =>
    data.notifications.push({ id: "n" + (data.notifications.length + 1), userId, type, auctionId, message, createdAt: now - ago * MIN, read });
  n("u1", "outbid", "a1", "You were outbid on \"Casio fx-991EX Scientific Calculator\". Current price: PKR 2,900.", 12, false);
  n("u1", "ending", "a2", "\"Data Structures & Algorithms Textbook\" ends in about 4 minutes. You are the highest bidder.", 1, false);
  n("u1", "won", "a4", "You won \"Engineering Drawing Set\" for PKR 1,800. Continue to checkout.", 120, false);
  n("u1", "sold", "a5", "Your listing \"Logitech Gaming Mouse\" sold for PKR 3,200.", 1440, true);
  n("u1", "system", null, "Welcome to BidCircle. All activity here is a classroom simulation.", 4000, true);
  data.reviews.push(
    { id: "r1", reviewerId: "u3", revieweeId: "u1", auctionId: "a5", rating: 5, comment: "Mouse worked perfectly. Quick, friendly handover.", createdAt: now - DAY },
    { id: "r2", reviewerId: "u2", revieweeId: "u1", auctionId: "a5", rating: 4, comment: "Good seller, replied fast.", createdAt: now - 5 * DAY },
    { id: "r3", reviewerId: "u1", revieweeId: "u2", auctionId: "a4", rating: 5, comment: "Drawing set was exactly as described.", createdAt: now - 3 * HR },
    { id: "r4", reviewerId: "u1", revieweeId: "u3", auctionId: "a5", rating: 4, comment: "Paid on time and easy to coordinate with.", createdAt: now - 20 * HR },
    { id: "r5", reviewerId: "u2", revieweeId: "u4", auctionId: "a3", rating: 3, comment: "Item was fine but pickup was late.", createdAt: now - 9 * DAY },
    { id: "r6", reviewerId: "u3", revieweeId: "u2", auctionId: "a1", rating: 5, comment: "Trustworthy and polite.", createdAt: now - 12 * DAY }
  );
  data.transactions.push({ id: "t1", auctionId: "a5", buyerId: "u3", sellerId: "u1", amount: 3200, fee: 64, total: 3264, status: "completed", method: "Simulated cash on pickup", createdAt: now - 20 * HR });
  data.suspiciousActivity.push(
    { id: "s1", auctionId: "a8", bidderId: "u6", riskScore: 82, riskLevel: "high", reasons: ["Account is only 5 days old and unverified", "Bids alternate only with one other account (u5)", "Bids placed within seconds of each other, 4 times"], metrics: { bidsOnAuction: 2, sellerBidShare: 0, avgGapSeconds: 300, accountAgeDays: 5 }, flaggedAt: now - 40 * MIN, reviewed: false },
    { id: "s2", auctionId: "a8", bidderId: "u5", riskScore: 74, riskLevel: "high", reasons: ["Account is only 6 days old and unverified", "Raised price in a back-and-forth pattern with u6", "Also leading on two other live auctions"], metrics: { bidsOnAuction: 2, sellerBidShare: 0, avgGapSeconds: 300, accountAgeDays: 6 }, flaggedAt: now - 38 * MIN, reviewed: false },
    { id: "s3", auctionId: "a3", bidderId: "u2", riskScore: 41, riskLevel: "medium", reasons: ["Opened bidding on a seller's item at the minimum price", "Has bid on 3 of this seller's last 4 listings"], metrics: { bidsOnAuction: 1, sellerBidShare: 75, avgGapSeconds: 0, accountAgeDays: 340 }, flaggedAt: now - 3 * HR, reviewed: false },
    { id: "s4", auctionId: "a1", bidderId: "u4", riskScore: 12, riskLevel: "low", reasons: ["Single bid, normal timing", "Established verified account"], metrics: { bidsOnAuction: 1, sellerBidShare: 0, avgGapSeconds: 0, accountAgeDays: 75 }, flaggedAt: now - 5 * HR, reviewed: true }
  );
  data.reports.push(
    { id: "rp1", targetType: "listing", targetId: "a3", reporterId: "u3", reason: "Misleading description", createdAt: now - 6 * HR, status: "open" },
    { id: "rp2", targetType: "user", targetId: "u5", reporterId: "u2", reason: "Suspicious bidding behaviour", createdAt: now - 2 * HR, status: "open" },
    { id: "rp3", targetType: "listing", targetId: "a7", reporterId: "u4", reason: "Wrong category", createdAt: now - 2 * DAY, status: "dismissed" }
  );
  window.BidCircleData = data;
})();
