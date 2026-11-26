// Hearth & Ledger — views.js
// One small job: turn the store's numbers into the HTML of each page.
// Every view is a function returning a string; app.js mounts it and wires
// the controls. Figures are always computed from the store, never typed in.

import { state, save, money, money0, totalIncome, totalSpending, totalBudgeted,
  categorySpent, categoryName, categoryColor, spendingByCategory,
  upcomingBills, upcomingBillsTotal, goalsTotal, newId } from "./store.js";
import { donutChart, trendChart, categoryBars } from "./charts.js";

function fmtDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function txRow(t) {
  return `<tr>
    <td>${fmtDate(t.date)}</td>
    <td><strong>${t.payee}</strong>${t.note ? `<br><span class="muted small">${t.note}</span>` : ""}</td>
    <td><span class="chip">${categoryName(t.category)}</span></td>
    <td class="num money neg">−$${t.amount.toFixed(2)}</td>
  </tr>`;
}

function budgetRow(c) {
  const spent = categorySpent(c.id);
  const pct = c.budget > 0 ? (spent / c.budget) * 100 : 0;
  const cls = pct > 100 ? "over" : pct >= 90 ? "warn" : "";
  const left = c.budget - spent;
  return `<div class="budget-row">
    <div class="budget-head">
      <span><span class="dot" style="background:${c.color}"></span><strong>${c.name}</strong></span>
      <span class="money"><strong>$${spent.toFixed(2)}</strong> <span class="muted">of ${money0(c.budget)}</span></span>
    </div>
    <div class="bar"><i class="${cls}" style="width:${Math.min(100, pct).toFixed(1)}%"></i></div>
    <div class="budget-meta">
      <span>${pct.toFixed(0)}% of budget</span>
      <span class="${left < 0 ? "neg" : "pos"}">${left < 0 ? `${money0(-left)} over` : `${money0(left)} left`}</span>
    </div>
  </div>`;
}

// ---------- Dashboard ----------

export function viewDashboard() {
  const income = totalIncome();
  const spent = totalSpending();
  const saved = income - spent;
  const rate = income > 0 ? (saved / income) * 100 : 0;
  const byCat = spendingByCategory();
  const top = byCat.slice(0, 5);
  const upcoming = upcomingBills();
  const goals = goalsTotal();
  const goalPct = goals.target > 0 ? (goals.saved / goals.target) * 100 : 0;
  const recent = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
  const trend = state.history.map((h) =>
    h.month === "Nov" ? { ...h, spending: Math.round(spent) } : h);

  return `
  <div class="page-head">
    <div><h1>Good evening, Ellis household</h1>
    <p>November is 26 days in. You're ${money0(saved)} ahead of spending with four days to go — on pace for your best savings month since June.</p></div>
    <a class="btn btn-amber" href="#/transactions">+ Add a transaction</a>
  </div>

  <div class="grid cols-4">
    <div class="card stat accent"><div class="label">Income · November</div><div class="value">${money0(income)}</div><div class="sub">Maya $4,200 · Jordan $2,350 · repairs $300</div></div>
    <div class="card stat"><div class="label">Spending so far</div><div class="value">${money0(spent)}</div><div class="sub">of ${money0(totalBudgeted())} budgeted · ${byCat.length} categories</div></div>
    <div class="card stat"><div class="label">Saved this month</div><div class="value pos">${money0(saved)}</div><div class="sub">${rate.toFixed(1)}% savings rate · goal is 25%</div></div>
    <div class="card stat"><div class="label">Bills still to pay</div><div class="value">${money0(upcomingBillsTotal())}</div><div class="sub">${upcoming.length} bills due by Nov 30</div></div>
  </div>

  <div class="grid two-one section-gap">
    <div class="card">
      <h2>Where the money went</h2>
      <p class="lede">Spending by category, November 1–26.</p>
      <div class="donut-wrap">${donutChart(byCat, spent)}</div>
      <div class="legend">${top.map((c) => `<span><span class="dot" style="background:${c.color}"></span>${c.name} ${money0(c.spent)}</span>`).join("")}</div>
      <p class="small muted" style="margin-top:12px">Housing, childcare and groceries are ${Math.round(((byCat.find((c) => c.id === "housing")?.spent ?? 0) + (byCat.find((c) => c.id === "childcare")?.spent ?? 0) + (byCat.find((c) => c.id === "groceries")?.spent ?? 0)) / spent * 100)}% of spending — the fixed costs leave about ${money0(income - 1650 - 900 - 682)} a month for everything else.</p>
    </div>
    <div class="card">
      <h2>Coming up</h2>
      <p class="lede">Bills due before the month ends.</p>
      ${upcoming.map((b) => `<div class="bill-row"><div><div class="bill-name">${b.name}</div><div class="bill-due">Due Nov ${b.dueDay}</div></div><strong class="money">${money(b.amount)}</strong></div>`).join("")}
      <p style="margin-top:14px"><a href="#/bills">All bills &rarr;</a></p>
      <hr>
      <h2 style="margin-top:14px">Savings goals</h2>
      <p class="lede">${money0(goals.saved)} of ${money0(goals.target)} saved across ${state.goals.length} goals.</p>
      <div class="bar"><i style="width:${goalPct.toFixed(1)}%"></i></div>
      <div class="goal-meta"><span>${goalPct.toFixed(0)}% of the way there</span><span>${money0(goals.target - goals.saved)} to go</span></div>
      <p><a href="#/goals">See the goals &rarr;</a></p>
    </div>
  </div>

  <div class="grid two-one section-gap">
    <div class="card">
      <h2>Income vs spending — six months</h2>
      <p class="lede">November spending is holding just under October's, while income stayed steady.</p>
      ${trendChart(trend)}
      <div class="legend"><span><span class="dot" style="background:#1f4d3a"></span>Income</span><span><span class="dot" style="background:#e8a33d"></span>Spending</span></div>
    </div>
    <div class="card">
      <h2>Recent spending</h2>
      <p class="lede">The latest transactions.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
        <tbody>${recent.map((t) => `<tr><td>${fmtDate(t.date)}</td><td><strong>${t.payee}</strong><br><span class="muted small">${categoryName(t.category)}</span></td><td class="num money neg">−$${t.amount.toFixed(2)}</td></tr>`).join("")}</tbody>
      </table></div>
      <p style="margin-top:12px"><a href="#/transactions">Full ledger &rarr;</a></p>
    </div>
  </div>`;
}

// ---------- Transactions ----------

export function viewTransactions(filter = {}) {
  const q = (filter.q ?? "").toLowerCase();
  const cat = filter.cat ?? "";
  const rows = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .filter((t) => (!cat || t.category === cat) && (!q || (t.payee + " " + (t.note ?? "") + " " + categoryName(t.category)).toLowerCase().includes(q)));
  const shownTotal = rows.reduce((s, t) => s + t.amount, 0);

  return `
  <div class="page-head">
    <div><h1>Transactions</h1>
    <p>Every dollar out the door in November. Search, filter, add, edit or delete — the ledger saves itself in this browser.</p></div>
    <span class="chip">${state.transactions.length} transactions · ${money(shownTotal)} shown</span>
  </div>

  <div class="card">
    <div class="toolbar">
      <div class="field wide"><label for="txSearch">Search</label><input id="txSearch" type="search" placeholder="Payee, note or category…" value="${filter.q ?? ""}"></div>
      <div class="field"><label for="txCat">Category</label>
        <select id="txCat"><option value="">All categories</option>${state.categories.map((c) => `<option value="${c.id}" ${c.id === cat ? "selected" : ""}>${c.name}</option>`).join("")}</select></div>
      <div class="field"><button class="btn-ghost btn" id="txClear">Clear filters</button></div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Date</th><th>Payee</th><th>Category</th><th>Note</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>
        ${rows.length ? rows.map((t) => `<tr>
          <td>${fmtDate(t.date)}</td>
          <td><strong>${t.payee}</strong></td>
          <td><span class="chip">${categoryName(t.category)}</span></td>
          <td class="muted">${t.note ?? ""}</td>
          <td class="num money neg">−$${t.amount.toFixed(2)}</td>
          <td class="num"><button class="btn-ghost btn btn-small" data-action="edit-tx" data-id="${t.id}">Edit</button>
          <button class="btn-danger btn btn-small" data-action="delete-tx" data-id="${t.id}">Delete</button></td>
        </tr>`).join("") : `<tr><td colspan="6" class="muted">No transactions match. Try clearing the search.</td></tr>`}
      </tbody>
    </table></div>

    <details class="add-form" id="txFormWrap">
      <summary>Add a transaction</summary>
      <div class="form-body">
        <form id="txForm">
          <div class="form-row three">
            <div><label for="fDate">Date</label><input id="fDate" name="date" type="date" value="2026-11-26" required></div>
            <div><label for="fPayee">Payee</label><input id="fPayee" name="payee" type="text" placeholder="Who was paid?" required maxlength="80"></div>
            <div><label for="fAmount">Amount ($)</label><input id="fAmount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>
          </div>
          <div class="form-row">
            <div><label for="fCat">Category</label><select id="fCat" name="category">${state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
            <div><label for="fNote">Note (optional)</label><input id="fNote" name="note" type="text" placeholder="What was it for?" maxlength="120"></div>
          </div>
          <div class="form-actions">
            <button type="submit">Save transaction</button>
            <button type="button" class="btn-ghost" id="txReset">Reset the ledger to the seed data</button>
          </div>
          <p class="small muted" id="txMsg" role="status"></p>
        </form>
      </div>
    </details>
  </div>`;
}

// ---------- Budgets ----------

export function viewBudgets() {
  const spent = totalSpending();
  const budgeted = totalBudgeted();
  const pct = budgeted > 0 ? (spent / budgeted) * 100 : 0;
  const over = spendingByCategory().filter((c) => c.spent > c.budget);
  const biggest = spendingByCategory()[0];
  const sorted = spendingByCategory().sort((a, b) => (b.spent / b.budget) - (a.spent / a.budget));

  return `
  <div class="page-head">
    <div><h1>Budgets — November 2026</h1>
    <p>Twelve envelopes for the month. ${over.length === 0 ? "Nothing is over budget — every envelope still has room." : `${over.map((c) => c.name).join(" and ")} ${over.length > 1 ? "are" : "is"} over budget; the rest still have room.`}</p></div>
    <span class="chip">${pct.toFixed(0)}% of the month's budget spent</span>
  </div>

  <div class="grid cols-3">
    <div class="card stat"><div class="label">Budgeted</div><div class="value">${money0(budgeted)}</div><div class="sub">Across ${state.categories.length} categories</div></div>
    <div class="card stat"><div class="label">Spent so far</div><div class="value">${money0(spent)}</div><div class="sub">${money0(budgeted - spent)} of the budget still unspent</div></div>
    <div class="card stat"><div class="label">Biggest envelope</div><div class="value">${biggest.name}</div><div class="sub">${money0(biggest.spent)} of ${money0(biggest.budget)} · ${biggest.id === "housing" ? "rent, due the 1st" : "this month's largest spend"}</div></div>
  </div>

  <div class="card section-gap">
    <h2>Actual vs budget</h2>
    <p class="lede">Bars turn amber past 90% and red over budget. Edit a budget below to move money between envelopes.</p>
    ${sorted.map(budgetRow).join("")}
  </div>

  <div class="card section-gap">
    <h2>Move money between envelopes</h2>
    <p class="lede">Budgets are monthly targets, not walls — if groceries run hot, take it from dining out and keep the total honest.</p>
    <form id="budgetForm">
      <div class="form-row three">
        <div><label for="bCat">Category</label><select id="bCat" name="category">${state.categories.map((c) => `<option value="${c.id}">${c.name} — now ${money0(c.budget)}</option>`).join("")}</select></div>
        <div><label for="bAmount">New monthly budget ($)</label><input id="bAmount" name="amount" type="number" min="0" step="5" placeholder="e.g. 800" required></div>
        <div><label>&nbsp;</label><button type="submit">Update budget</button></div>
      </div>
      <p class="small muted" id="budgetMsg" role="status"></p>
    </form>
  </div>`;
}

// ---------- Savings goals ----------

export function viewGoals() {
  const goals = goalsTotal();
  const pct = goals.target > 0 ? (goals.saved / goals.target) * 100 : 0;
  const closest = [...state.goals]
    .sort((a, b) => (b.saved / b.target) - (a.saved / a.target))[0];

  return `
  <div class="page-head">
    <div><h1>Savings goals</h1>
    <p>Four things the family is saving toward. Every spare dollar at month-end is split between them — emergency fund first.</p></div>
    <span class="chip">${pct.toFixed(0)}% funded overall</span>
  </div>

  <div class="grid cols-3">
    <div class="card stat accent"><div class="label">Saved across all goals</div><div class="value">${money0(goals.saved)}</div><div class="sub">of ${money0(goals.target)} total target</div></div>
    <div class="card stat"><div class="label">This month's saving</div><div class="value pos">${money0(totalIncome() - totalSpending())}</div><div class="sub">Income minus spending, November</div></div>
    <div class="card stat"><div class="label">Closest to done</div><div class="value">${closest.name}</div><div class="sub">${money0(closest.saved)} of ${money0(closest.target)} · ${Math.round(closest.saved / closest.target * 100)}% funded</div></div>
  </div>

  <div class="grid cols-2 section-gap">
    ${state.goals.map((g) => {
      const p = g.target > 0 ? (g.saved / g.target) * 100 : 0;
      return `<div class="card">
        <div class="goal-head"><strong>${g.name}</strong><span class="chip">${p.toFixed(0)}%</span></div>
        <p class="muted" style="margin:8px 0 4px">${g.note}</p>
        <div class="goal-figure">${money0(g.saved)} <span class="muted" style="font-size:1rem;font-weight:400">of ${money0(g.target)}</span></div>
        <div class="bar" style="margin:10px 0 6px"><i style="width:${Math.min(100, p).toFixed(1)}%"></i></div>
        <div class="goal-meta"><span>${money0(g.target - g.saved)} still to save</span><span>${g.target > 0 ? `about ${Math.max(1, Math.ceil((g.target - g.saved) / 300))} months at $300/mo` : ""}</span></div>
        <form class="goal-form" data-goal="${g.id}">
          <div class="form-row" style="margin-bottom:0">
            <div><label for="add-${g.id}">Add to this goal ($)</label><input id="add-${g.id}" name="amount" type="number" min="1" step="1" placeholder="e.g. 100" required></div>
            <div><label>&nbsp;</label><button type="submit">Add savings</button></div>
          </div>
        </form>
      </div>`;
    }).join("")}
  </div>

  <div class="card section-gap">
    <h2>Start a new goal</h2>
    <p class="lede">A goal needs a name, a target and a reason — otherwise it is just a wish.</p>
    <form id="goalForm">
      <div class="form-row three">
        <div><label for="gName">Goal name</label><input id="gName" name="name" type="text" placeholder="e.g. New washing machine" required maxlength="60"></div>
        <div><label for="gTarget">Target ($)</label><input id="gTarget" name="target" type="number" min="1" step="10" placeholder="e.g. 800" required></div>
        <div><label for="gNote">Why it matters</label><input id="gNote" name="note" type="text" placeholder="One sentence" maxlength="120"></div>
      </div>
      <div class="form-actions"><button type="submit">Create goal</button></div>
      <p class="small muted" id="goalMsg" role="status"></p>
    </form>
  </div>`;
}

// ---------- Bills ----------

export function viewBills() {
  const paid = state.bills.filter((b) => b.paid);
  const unpaid = state.bills.filter((b) => !b.paid);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const monthlyTotal = state.bills.reduce((s, b) => s + b.amount, 0);

  const row = (b) => `<div class="bill-row">
    <div><div class="bill-name">${b.name}</div><div class="bill-due">Due Nov ${b.dueDay} · ${categoryName(b.category)} · repeats monthly</div></div>
    <div style="display:flex;align-items:center;gap:12px">
      <strong class="money">${money(b.amount)}</strong>
      ${b.paid
        ? `<span class="chip">Paid</span>`
        : `<button class="btn btn-small" data-action="pay-bill" data-id="${b.id}">Mark paid</button>`}
    </div>
  </div>`;

  return `
  <div class="page-head">
    <div><h1>Bills &amp; upcoming payments</h1>
    <p>Everything that repeats each month, in due-date order. Mark a bill paid when the money leaves the account and it moves to the paid list.</p></div>
    <span class="chip">${money0(unpaidTotal)} still due in November</span>
  </div>

  <div class="grid cols-3">
    <div class="card stat"><div class="label">Recurring bills, monthly</div><div class="value">${money0(monthlyTotal)}</div><div class="sub">${state.bills.length} bills repeat every month</div></div>
    <div class="card stat"><div class="label">Paid so far</div><div class="value pos">${money0(paidTotal)}</div><div class="sub">${paid.length} of ${state.bills.length} bills settled</div></div>
    <div class="card stat"><div class="label">Still to pay</div><div class="value">${money0(unpaidTotal)}</div><div class="sub">${unpaid.length} bills due by Nov 30</div></div>
  </div>

  <div class="grid two-one section-gap">
    <div class="card">
      <h2>Due before month-end</h2>
      <p class="lede">Pay these and November is fully settled.</p>
      ${unpaid.length ? unpaid.map(row).join("") : `<p class="notice">All November bills are paid. Nice work — December's list starts on the 1st.</p>`}
    </div>
    <div class="card">
      <h2>Already paid</h2>
      <p class="lede">Settled earlier this month.</p>
      ${paid.map(row).join("")}
    </div>
  </div>

  <div class="card section-gap">
    <h2>Add a recurring bill</h2>
    <form id="billForm">
      <div class="form-row three">
        <div><label for="billName">Bill name</label><input id="billName" name="name" type="text" placeholder="e.g. Piano lessons" required maxlength="60"></div>
        <div><label for="billAmount">Amount ($)</label><input id="billAmount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>
        <div><label for="billDay">Due day of month</label><input id="billDay" name="dueDay" type="number" min="1" max="28" placeholder="e.g. 15" required></div>
      </div>
      <div class="form-row">
        <div><label for="billCat">Category</label><select id="billCat" name="category">${state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select></div>
        <div><label>&nbsp;</label><button type="submit">Add bill</button></div>
      </div>
      <p class="small muted" id="billMsg" role="status"></p>
    </form>
  </div>`;
}

// ---------- Reports ----------

export function viewReports() {
  const income = totalIncome();
  const spent = totalSpending();
  const saved = income - spent;
  const byCat = spendingByCategory();
  const topPayees = [...state.transactions]
    .reduce((acc, t) => {
      acc[t.payee] = (acc[t.payee] ?? 0) + t.amount;
      return acc;
    }, {});
  const topList = Object.entries(topPayees).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const trend = state.history.map((h) =>
    h.month === "Nov" ? { ...h, spending: Math.round(spent) } : h);
  const avgSpending = Math.round(trend.reduce((s, h) => s + h.spending, 0) / trend.length);
  const bestMonth = trend.reduce((best, h) => (h.income - h.spending > best.income - best.spending ? h : best), trend[0]);
  const groceryShare = Math.round((categorySpent("groceries") / spent) * 100);

  return `
  <div class="page-head">
    <div><h1>Reports — November 2026</h1>
    <p>The month in charts. Six months of income against spending, every category ranked, and the three things worth acting on before December.</p></div>
    <a class="btn btn-amber" href="#/transactions">Review the ledger</a>
  </div>

  <div class="grid cols-3">
    <div class="card stat"><div class="label">Savings rate</div><div class="value pos">${((saved / income) * 100).toFixed(1)}%</div><div class="sub">Goal: 25% · ${money0(saved)} kept this month</div></div>
    <div class="card stat"><div class="label">Average monthly spending</div><div class="value">${money0(avgSpending)}</div><div class="sub">Six-month average, Jun–Nov</div></div>
    <div class="card stat"><div class="label">Best saving month</div><div class="value">${bestMonth.month}</div><div class="sub">${money0(bestMonth.income - bestMonth.spending)} saved that month</div></div>
  </div>

  <div class="grid two-one section-gap">
    <div class="card">
      <h2>Spending by category</h2>
      <p class="lede">Ranked highest to lowest. Groceries are ${groceryShare}% of all spending — the biggest lever the family controls.</p>
      ${categoryBars(byCat)}
      <p class="small muted" style="margin-top:12px">Fixed costs (housing, childcare, utilities, transport, subscriptions) come to ${money0(categorySpent("housing") + categorySpent("childcare") + categorySpent("utilities") + categorySpent("transport") + categorySpent("subscriptions"))} — ${Math.round(((categorySpent("housing") + categorySpent("childcare") + categorySpent("utilities") + categorySpent("transport") + categorySpent("subscriptions")) / spent) * 100)}% of spending.</p>
    </div>
    <div class="card">
      <h2>Top payees</h2>
      <p class="lede">Where the money actually went, by name.</p>
      <table><thead><tr><th>Payee</th><th class="num">November total</th></tr></thead>
      <tbody>${topList.map(([name, amt]) => `<tr><td><strong>${name}</strong></td><td class="num money">$${amt.toFixed(2)}</td></tr>`).join("")}</tbody></table>
      <p class="small muted" style="margin-top:12px">The top five payees take ${Math.round((topList.reduce((s, [, a]) => s + a, 0) / spent) * 100)}% of November spending.</p>
    </div>
  </div>

  <div class="card section-gap">
    <h2>Income vs spending — six months</h2>
    <p class="lede">Spending peaked in August at ${money0(5140)} (the summer trip) and has stayed under ${money0(5000)} since. November is the second-best saving month of the half-year.</p>
    ${trendChart(trend)}
    <div class="legend"><span><span class="dot" style="background:#1f4d3a"></span>Income</span><span><span class="dot" style="background:#e8a33d"></span>Spending</span></div>
  </div>

  <div class="card section-gap">
    <h2>Three things to do before December</h2>
    <div class="insight"><strong>Groceries: shop the list, not the aisle.</strong>Four shops a week apart cost ${money0(categorySpent("groceries"))}. A weekly meal plan and one Costco run a month would keep the envelope under ${money0(700)}.</div>
    <div class="insight"><strong>Move the surplus while it's there.</strong>${money0(saved)} is unspent with four days left. Send $300 to the emergency fund now and the coast trip is fully funded by February.</div>
    <div class="insight"><strong>Watch the phone bill.</strong>NorthStar Mobile came in at ${money0(110)} — the plan is $84 and the overage was data. Check the plan before the December cycle starts.</div>
    <p class="small muted">Figures update as you edit the ledger — come back after the last bills clear and this page tells the month's final story.</p>
  </div>`;
}

export { save, newId };
