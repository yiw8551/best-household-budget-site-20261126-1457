// Hearth & Ledger — app.js
// One small job: route between the pages and wire every control.
// Hash routes (#/, #/transactions, #/budgets, #/goals, #/bills, #/reports)
// so every section is reachable by a link and the back button works.

import { state, save, resetToSeed, money, newId } from "./store.js";
import { viewDashboard, viewTransactions, viewBudgets, viewGoals, viewBills, viewReports } from "./views.js";

const mount = document.getElementById("view");
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

navToggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

let txFilter = { q: "", cat: "" };
let editingTxId = null; // when set, the transaction form saves over this row

const routes = {
  "/": viewDashboard,
  "/transactions": () => viewTransactions(txFilter),
  "/budgets": viewBudgets,
  "/goals": viewGoals,
  "/bills": viewBills,
  "/reports": viewReports,
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return routes[hash] ? hash : "/";
}

function render() {
  const route = currentRoute();
  mount.innerHTML = routes[route]();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const target = a.getAttribute("href").replace(/^#/, "") || "/";
    a.classList.toggle("active", target === route);
  });
  mobileNav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
  wirePage(route);
}

function resetTxForm(form) {
  form.reset();
  document.getElementById("fDate").value = "2026-11-26";
  editingTxId = null;
}

// ---------- page wiring ----------

function wirePage(route) {
  if (route === "/transactions") wireTransactions();
  if (route === "/budgets") wireBudgets();
  if (route === "/goals") wireGoals();
  if (route === "/bills") wireBills();
}

function wireTransactions() {
  const search = document.getElementById("txSearch");
  const cat = document.getElementById("txCat");
  const apply = () => {
    txFilter = { q: search.value, cat: cat.value };
    // Re-render the table only: rebuild the view but keep the search text.
    const scroll = window.scrollY;
    mount.innerHTML = viewTransactions(txFilter);
    wireTransactions();
    document.getElementById("txSearch").focus();
    window.scrollTo(0, scroll);
  };
  let timer = null;
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 250);
  });
  cat.addEventListener("change", apply);
  document.getElementById("txClear").addEventListener("click", () => {
    txFilter = { q: "", cat: "" };
    render();
  });

  document.getElementById("txForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const amount = Number(data.get("amount"));
    const date = String(data.get("date"));
    const payee = String(data.get("payee")).trim();
    if (!payee || !date || !(amount > 0)) return;
    const values = {
      date,
      payee,
      category: String(data.get("category")),
      amount: Math.round(amount * 100) / 100,
      note: String(data.get("note") ?? "").trim(),
    };
    if (editingTxId) {
      const t = state.transactions.find((x) => x.id === editingTxId);
      if (t) Object.assign(t, values);
      document.getElementById("txMsg").textContent = `Updated ${payee} — ${money(amount)}.`;
    } else {
      state.transactions.push({ id: newId("t"), ...values });
      document.getElementById("txMsg").textContent =
        `Saved ${payee} — ${money(amount)}. The dashboard, budgets and reports already include it.`;
    }
    save();
    resetTxForm(e.target);
    render();
  });

  document.getElementById("txReset").addEventListener("click", () => {
    if (confirm("Reset the whole ledger to the Ellis family's November seed data? Your edits will be lost.")) {
      resetToSeed();
      txFilter = { q: "", cat: "" };
      render();
    }
  });
}

function wireBudgets() {
  document.getElementById("budgetForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const cat = state.categories.find((c) => c.id === String(data.get("category")));
    const amount = Number(data.get("amount"));
    if (!cat || !(amount >= 0)) return;
    cat.budget = Math.round(amount);
    save();
    document.getElementById("budgetMsg").textContent =
      `${cat.name} budget is now ${money(cat.budget)} a month.`;
    render();
  });
}

function wireGoals() {
  document.querySelectorAll(".goal-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const goal = state.goals.find((g) => g.id === form.dataset.goal);
      const amount = Number(new FormData(form).get("amount"));
      if (!goal || !(amount > 0)) return;
      goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      save();
      render();
    });
  });
  document.getElementById("goalForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = String(data.get("name")).trim();
    const target = Number(data.get("target"));
    if (!name || !(target > 0)) return;
    state.goals.push({
      id: newId("g"),
      name,
      target: Math.round(target),
      saved: 0,
      note: String(data.get("note") ?? "").trim() || "A new goal for the household.",
    });
    save();
    document.getElementById("goalMsg").textContent = `Goal “${name}” created. Add your first dollars above.`;
    render();
  });
}

function wireBills() {
  document.getElementById("billForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = String(data.get("name")).trim();
    const amount = Number(data.get("amount"));
    const dueDay = Number(data.get("dueDay"));
    if (!name || !(amount > 0) || !(dueDay >= 1 && dueDay <= 28)) return;
    state.bills.push({
      id: newId("b"),
      name,
      amount: Math.round(amount * 100) / 100,
      dueDay,
      category: String(data.get("category")),
      paid: false,
    });
    state.bills.sort((a, b) => a.dueDay - b.dueDay);
    save();
    document.getElementById("billMsg").textContent = `Bill “${name}” added, due on the ${dueDay}th.`;
    render();
  });
}

// ---------- delegated actions (edit / delete / pay) ----------

mount.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;

  if (action === "delete-tx") {
    const t = state.transactions.find((x) => x.id === id);
    if (t && confirm(`Delete “${t.payee} — ${money(t.amount)}” from the ledger?`)) {
      state.transactions = state.transactions.filter((x) => x.id !== id);
      save();
      render();
    }
  }

  if (action === "edit-tx") {
    const t = state.transactions.find((x) => x.id === id);
    if (!t) return;
    const wrap = document.getElementById("txFormWrap");
    if (wrap) wrap.open = true;
    const form = document.getElementById("txForm");
    form.querySelector("#fDate").value = t.date;
    form.querySelector("#fPayee").value = t.payee;
    form.querySelector("#fAmount").value = t.amount.toFixed(2);
    form.querySelector("#fCat").value = t.category;
    form.querySelector("#fNote").value = t.note ?? "";
    editingTxId = t.id;
    document.getElementById("txMsg").textContent = `Editing “${t.payee}” — save to update it, or clear the form to add a new one.`;
    form.querySelector("#fPayee").focus();
    window.scrollTo(0, form.getBoundingClientRect().top + window.scrollY - 80);
  }

  if (action === "pay-bill") {
    const b = state.bills.find((x) => x.id === id);
    if (!b) return;
    b.paid = true;
    save();
    render();
  }
});

window.addEventListener("hashchange", render);
render();
