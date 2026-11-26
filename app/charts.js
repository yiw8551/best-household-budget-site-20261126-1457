// Hearth & Ledger — charts.js
// One small job: build the site's charts as inline SVG from numbers.
// No library, no canvas, no network — just strings the views drop into the page.

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

// Donut of spending by category. `slices` are {name, spent, color}.
// The centre carries the total; the legend is rendered by the caller.
export function donutChart(slices, total) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 82;
  const inner = 56;
  let angle = -Math.PI / 2;
  const parts = slices
    .filter((s) => s.spent > 0)
    .map((s) => {
      const frac = s.spent / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const xi1 = cx + inner * Math.cos(a1);
      const yi1 = cy + inner * Math.sin(a1);
      const xi0 = cx + inner * Math.cos(a0);
      const yi0 = cy + inner * Math.sin(a0);
      return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${s.color}"><title>${esc(s.name)}: $${s.spent.toFixed(2)}</title></path>`;
    })
    .join("");
  const totalLabel = "$" + Math.round(total).toLocaleString("en-US");
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category, total ${totalLabel}">
    ${parts}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="24" font-weight="700" fill="#22312b">${totalLabel}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#5c6b64">spent in November</text>
  </svg>`;
}

// Grouped bar chart: income vs spending across months.
// `rows` are {month, income, spending}.
export function trendChart(rows) {
  const w = 640;
  const h = 260;
  const padL = 52;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...rows.flatMap((r) => [r.income, r.spending])) * 1.08;
  const plotW = w - padL - 12;
  const plotH = h - padT - padB;
  const slot = plotW / rows.length;
  const barW = Math.min(26, (slot - 18) / 2);
  const y = (v) => padT + plotH - (v / max) * plotH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + plotH * (1 - f);
    return `<line x1="${padL}" y1="${gy}" x2="${w - 12}" y2="${gy}" stroke="#e4dccb" stroke-width="1"/><text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#5c6b64">$${Math.round((max * f) / 1000)}k</text>`;
  }).join("");
  const bars = rows.map((r, i) => {
    const x = padL + i * slot + (slot - barW * 2 - 6) / 2;
    return `<rect x="${x.toFixed(1)}" y="${y(r.income).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.income)).toFixed(1)}" rx="3" fill="#1f4d3a"><title>${r.month} income $${r.income}</title></rect>
    <rect x="${(x + barW + 6).toFixed(1)}" y="${y(r.spending).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.spending)).toFixed(1)}" rx="3" fill="#e8a33d"><title>${r.month} spending $${r.spending}</title></rect>
    <text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="12" fill="#22312b">${r.month}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="Monthly income versus spending, June to November 2026">
    ${grid}${bars}
    <line x1="${padL}" y1="${padT + plotH}" x2="${w - 12}" y2="${padT + plotH}" stroke="#cfc6ae" stroke-width="1"/>
  </svg>`;
}

// Horizontal bars for the reports page: one row per category.
export function categoryBars(rows) {
  const max = Math.max(...rows.map((r) => r.spent), 1);
  return rows
    .map((r) => {
      const pct = Math.min(100, (r.spent / max) * 100);
      const over = r.spent > r.budget;
      return `<div class="catbar-row">
        <div class="catbar-label"><span class="dot" style="background:${r.color}"></span>${esc(r.name)}</div>
        <div class="bar catbar-track"><i style="width:${pct.toFixed(1)}%;background:${r.color}"></i></div>
        <div class="money catbar-value ${over ? "neg" : ""}">$${r.spent.toFixed(2)}</div>
      </div>`;
    })
    .join("");
}
