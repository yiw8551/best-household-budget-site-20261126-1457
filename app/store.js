// Hearth & Ledger — store.js
// One small job: hold the household's numbers, load the seed from data.js on
// first visit, persist every change to localStorage, and answer the totals
// every view needs. Nothing here touches the page.

import { CATEGORIES, TRANSACTIONS, INCOME, GOALS, BILLS, HISTORY, HOUSEHOLD } from "./data.js";

const KEY = "hearth-ledger-v1";

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function seedState() {
  return {
    household: deepCopy(HOUSEHOLD),
    categories: deepCopy(CATEGORIES),
    income: deepCopy(INCOME),
    transactions: deepCopy(TRANSACTIONS),
    goals: deepCopy(GOALS),
    bills: deepCopy(BILLS),
    history: deepCopy(HISTORY),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    // A stored state missing any collection is corrupt; reseed rather than
    // render a half-empty site.
    for (const k of ["categories", "income", "transactions", "goals", "bills", "history"]) {
      if (!Array.isArray(parsed[k])) return seedState();
    }
    return parsed;
  } catch {
    return seedState();
  }
}

export const state = loadState();

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full quota: the site keeps working in memory.
  }
}

export function resetToSeed() {
  const fresh = seedState();
  for (const k of Object.keys(fresh)) state[k] = fresh[k];
  save();
}

// ---------- derived numbers ----------

export const money = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const money0 = (n) => "$" + Math.round(Number(n)).toLocaleString("en-US");

export function totalIncome() {
  return state.income.reduce((s, i) => s + i.amount, 0);
}

export function totalSpending() {
  return state.transactions.reduce((s, t) => s + t.amount, 0);
}

export function categorySpent(categoryId) {
  return state.transactions
    .filter((t) => t.category === categoryId)
    .reduce((s, t) => s + t.amount, 0);
}

export function categoryName(categoryId) {
  return state.categories.find((c) => c.id === categoryId)?.name ?? categoryId;
}

export function categoryColor(categoryId) {
  return state.categories.find((c) => c.id === categoryId)?.color ?? "#5c6b64";
}

export function totalBudgeted() {
  return state.categories.reduce((s, c) => s + c.budget, 0);
}

export function upcomingBills() {
  return state.bills.filter((b) => !b.paid);
}

export function upcomingBillsTotal() {
  return upcomingBills().reduce((s, b) => s + b.amount, 0);
}

export function goalsTotal() {
  return {
    saved: state.goals.reduce((s, g) => s + g.saved, 0),
    target: state.goals.reduce((s, g) => s + g.target, 0),
  };
}

export function spendingByCategory() {
  return state.categories
    .map((c) => ({ ...c, spent: categorySpent(c.id) }))
    .sort((a, b) => b.spent - a.spent);
}

export function newId(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
}
