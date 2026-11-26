// Hearth & Ledger — seed data for the Ellis household, November 2026.
// Every figure is the family's own number for the month. The store (store.js)
// loads this seed on first visit and then keeps the household's edits in
// localStorage, so the site always opens with real figures in place.

export const HOUSEHOLD = {
  name: "The Ellis household",
  members: "Maya & Jordan Ellis, with Nora (9) and Sam (6)",
  month: "November 2026",
  monthKey: "2026-11",
  currency: "USD",
};

export const CATEGORIES = [
  { id: "groceries",     name: "Groceries",      color: "#2f7d6b", budget: 750 },
  { id: "housing",       name: "Housing",        color: "#1f4d3a", budget: 1650 },
  { id: "childcare",     name: "Childcare",      color: "#7a5a8c", budget: 900 },
  { id: "transport",     name: "Transport",      color: "#4a7fa5", budget: 420 },
  { id: "utilities",     name: "Utilities",      color: "#c99a2e", budget: 400 },
  { id: "household",     name: "Household & pets", color: "#8a6d3b", budget: 260 },
  { id: "dining",        name: "Dining out",     color: "#c25e4b", budget: 220 },
  { id: "entertainment", name: "Entertainment",  color: "#b97a1a", budget: 180 },
  { id: "gifts",         name: "Gifts & giving", color: "#5a7d5a", budget: 150 },
  { id: "clothing",      name: "Clothing",       color: "#6b5b95", budget: 120 },
  { id: "health",        name: "Health",         color: "#3d8a8a", budget: 240 },
  { id: "subscriptions", name: "Subscriptions",  color: "#9c6b4f", budget: 85 },
];

// Income for November 2026.
export const INCOME = [
  { id: "inc-1", source: "Maya — salary, Northside Clinic", amount: 4200, date: "2026-11-01" },
  { id: "inc-2", source: "Jordan — salary, Meridian Logistics", amount: 2350, date: "2026-11-01" },
  { id: "inc-3", source: "Jordan — weekend bike repairs", amount: 300, date: "2026-11-15" },
];

// Spending transactions, newest last in the file; the ledger sorts by date.
export const TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", payee: "Maple Court Apartments", category: "housing", amount: 1650.00, note: "November rent" },
  { id: "t02", date: "2026-11-01", payee: "Streamline Music + Cloud", category: "subscriptions", amount: 85.00, note: "Monthly bundle" },
  { id: "t03", date: "2026-11-02", payee: "Little Acorns Daycare", category: "childcare", amount: 900.00, note: "November tuition, Nora & Sam" },
  { id: "t04", date: "2026-11-03", payee: "Whole Foods Market", category: "groceries", amount: 96.40, note: "Weekly shop" },
  { id: "t05", date: "2026-11-03", payee: "StreamBox", category: "entertainment", amount: 15.99, note: "Movie streaming" },
  { id: "t06", date: "2026-11-04", payee: "Shell — Route 9", category: "transport", amount: 45.00, note: "Fuel" },
  { id: "t07", date: "2026-11-05", payee: "The Corner Bistro", category: "dining", amount: 42.50, note: "Date night" },
  { id: "t08", date: "2026-11-06", payee: "Trader Joe's", category: "groceries", amount: 74.15, note: "Weekly shop" },
  { id: "t09", date: "2026-11-06", payee: "SafeDrive Insurance", category: "transport", amount: 120.00, note: "Car insurance, monthly" },
  { id: "t10", date: "2026-11-06", payee: "Riverside Pharmacy", category: "health", amount: 35.00, note: "Prescriptions" },
  { id: "t11", date: "2026-11-07", payee: "City Power & Light", category: "utilities", amount: 132.00, note: "Electric bill" },
  { id: "t12", date: "2026-11-07", payee: "HomeBase Hardware", category: "household", amount: 64.50, note: "Light bulbs, draught excluder" },
  { id: "t13", date: "2026-11-08", payee: "Farmers Market — Elm St", category: "groceries", amount: 58.90, note: "Vegetables, eggs, bread" },
  { id: "t14", date: "2026-11-08", payee: "Regal Cinema", category: "entertainment", amount: 54.00, note: "Family movie night" },
  { id: "t15", date: "2026-11-09", payee: "City Water Department", category: "utilities", amount: 68.00, note: "Water bill" },
  { id: "t16", date: "2026-11-10", payee: "Olive & Vine", category: "dining", amount: 68.00, note: "Dinner with the Patels" },
  { id: "t17", date: "2026-11-11", payee: "FastNet Broadband", category: "utilities", amount: 84.00, note: "Internet, monthly" },
  { id: "t18", date: "2026-11-12", payee: "Whole Foods Market", category: "groceries", amount: 112.30, note: "Weekly shop + Thanksgiving prep" },
  { id: "t19", date: "2026-11-12", payee: "Metro Transit", category: "transport", amount: 38.00, note: "Bus passes" },
  { id: "t20", date: "2026-11-13", payee: "PetPantry", category: "household", amount: 89.99, note: "Dog food, Biscuit" },
  { id: "t21", date: "2026-11-14", payee: "Noodle House", category: "dining", amount: 35.75, note: "Takeaway" },
  { id: "t22", date: "2026-11-15", payee: "Target", category: "groceries", amount: 63.75, note: "Pantry top-up" },
  { id: "t23", date: "2026-11-15", payee: "Book Nook", category: "entertainment", amount: 32.00, note: "Books for Nora" },
  { id: "t24", date: "2026-11-16", payee: "Old Navy", category: "clothing", amount: 88.00, note: "Winter coats for the kids" },
  { id: "t25", date: "2026-11-17", payee: "Shell — Route 9", category: "transport", amount: 52.00, note: "Fuel" },
  { id: "t26", date: "2026-11-18", payee: "Trader Joe's", category: "groceries", amount: 88.20, note: "Weekly shop" },
  { id: "t27", date: "2026-11-18", payee: "Handmade Hearts", category: "gifts", amount: 120.00, note: "Birthday gift for Grandma Rose" },
  { id: "t28", date: "2026-11-19", payee: "Bright Smile Dental", category: "health", amount: 61.00, note: "Sam's check-up copay" },
  { id: "t29", date: "2026-11-20", payee: "Noodle House", category: "dining", amount: 28.40, note: "Takeaway" },
  { id: "t30", date: "2026-11-20", payee: "IKEA", category: "household", amount: 78.50, note: "Bookshelf for Nora's room" },
  { id: "t31", date: "2026-11-21", payee: "Corner Market", category: "groceries", amount: 41.60, note: "Milk, fruit, snacks" },
  { id: "t32", date: "2026-11-21", payee: "Lucky Lanes Bowling", category: "entertainment", amount: 40.25, note: "Saturday bowling" },
  { id: "t33", date: "2026-11-22", payee: "AutoCare Garage", category: "transport", amount: 96.00, note: "Oil change + inspection" },
  { id: "t34", date: "2026-11-23", payee: "Costco", category: "groceries", amount: 147.10, note: "Bulk shop" },
  { id: "t35", date: "2026-11-24", payee: "Pizza Pronto", category: "dining", amount: 21.60, note: "Friday pizza" },
  { id: "t36", date: "2026-11-25", payee: "NorthStar Mobile", category: "utilities", amount: 110.00, note: "Phone plan, two lines" },
];

// Savings goals.
export const GOALS = [
  { id: "g1", name: "Emergency fund", target: 12000, saved: 8450, note: "Six months of essentials, kept in a high-yield savings account." },
  { id: "g2", name: "Family trip to the coast", target: 2400, saved: 1875, note: "A week at the shore next summer — cottage, train, ice cream fund." },
  { id: "g3", name: "New car down payment", target: 6000, saved: 2300, note: "Replacing the 2012 hatchback before it gives up." },
  { id: "g4", name: "Kids' college starter", target: 5000, saved: 1150, note: "$50 a month each into Nora's and Sam's 529 plans." },
];

// Recurring bills. `paid` marks what November has already covered.
export const BILLS = [
  { id: "b01", name: "Rent — Maple Court", amount: 1650.00, dueDay: 1, category: "housing", paid: true },
  { id: "b02", name: "Little Acorns Daycare", amount: 900.00, dueDay: 2, category: "childcare", paid: true },
  { id: "b03", name: "StreamBox", amount: 15.99, dueDay: 3, category: "entertainment", paid: true },
  { id: "b04", name: "SafeDrive car insurance", amount: 120.00, dueDay: 6, category: "transport", paid: true },
  { id: "b05", name: "City Power & Light", amount: 132.00, dueDay: 7, category: "utilities", paid: true },
  { id: "b06", name: "City Water", amount: 68.00, dueDay: 9, category: "utilities", paid: true },
  { id: "b07", name: "FastNet Broadband", amount: 84.00, dueDay: 11, category: "utilities", paid: true },
  { id: "b08", name: "NorthStar Mobile", amount: 110.00, dueDay: 25, category: "utilities", paid: true },
  { id: "b09", name: "Harbor Credit Card", amount: 420.00, dueDay: 27, category: "household", paid: false },
  { id: "b10", name: "Riverside Gym — family plan", amount: 49.00, dueDay: 28, category: "health", paid: false },
  { id: "b11", name: "Home insurance — Haven Mutual", amount: 96.00, dueDay: 30, category: "housing", paid: false },
];

// Six-month history for the trend chart (Jun–Nov 2026).
export const HISTORY = [
  { month: "Jun", income: 6720, spending: 4610 },
  { month: "Jul", income: 6850, spending: 4980 },
  { month: "Aug", income: 6850, spending: 5140 },
  { month: "Sep", income: 6850, spending: 4720 },
  { month: "Oct", income: 6980, spending: 4905 },
  { month: "Nov", income: 6850, spending: 4938 },
];
