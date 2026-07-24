const data = JSON.parse(document.getElementById('lbData').textContent);
const tools = data.toolData;
const models = data.modelData;
const tableWrap = document.getElementById('lbTableWrap');
const cards = document.getElementById('lbCards');
let currentTab = 'tools';
let currentView = 'table';
let sortKey = null;
let sortDirection = 0;
let filters = {};

const toolCols = [
  ['name', '产品'], ['vendor', '厂商'], ['type', '类型'], ['baseModels', '底层模型'],
  ['contextWindow', '上下文'], ['minPrice', '最低价'], ['bestPlan', '推荐方案'],
  ['features', '特性'], ['pricingUrl', '官网'], ['launchYear', '发布']
];
const modelCols = [
  ['name', '模型'], ['provider', '提供商'], ['architecture', '架构'], ['params', '总参数'], ['activeParams', '激活参数'], ['contextLength', '上下文'],
  ['inputPrice', '输入 $/M'], ['outputPrice', '输出 $/M'], ['knowledgeCutoff', '知识截止'],
  ['codingScore', 'Coding'], ['caps', '能力']
];

function formatNumber(value) {
  if (value == null || value === '') return '—';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value;
}

function formatPrice(value) {
  if (value == null || value === '') return '—';
  if (typeof value === 'string') return value;
  return `$${value < 1 ? value.toFixed(2) : value.toFixed(2)}`;
}

function formatParams(row) {
  if (!row.params) return '未公开';
  return row.activeParams ? `${row.params} / ${row.activeParams} active` : row.params;
}

function value(row, key) {
  if (currentTab === 'tools') {
    if (key === 'features') return (row.features || []).slice(0, 3).join(', ');
    if (key === 'bestPlan') return `<strong>${row.bestPlan}</strong><small>${row.bestPlanDesc || ''}</small>`;
    if (key === 'pricingUrl') return `<a href="${row.pricingUrl}" target="_blank" rel="noopener">↗</a>`;
    return row[key] || '—';
  }
  if (key === 'architecture') return row.architecture || '—';
  if (key === 'params') return `<span title="${row.paramSource || '来源未记录'}">${row.params || '未公开'}</span>`;
  if (key === 'activeParams') return row.activeParams || '—';
  if (key === 'contextLength') return formatNumber(row.contextLength);
  if (key === 'inputPrice' || key === 'outputPrice') return formatPrice(row[key]);
  if (key === 'knowledgeCutoff') return row[key] || '—';
  if (key === 'codingScore') return row[key] ?? '—';
  if (key === 'caps') return [row.hasVision && '👁', row.hasTools && '🔧', row.hasReasoning && '🧠'].filter(Boolean).join(' ') || '—';
  return row[key] || '—';
}

function rawValue(row, key) {
  if (currentTab === 'tools') {
    if (key === 'features') return (row.features || []).join(' ');
    if (key === 'bestPlan') return `${row.bestPlan || ''} ${row.bestPlanDesc || ''}`;
    if (key === 'pricingUrl') return row.pricingUrl || '';
    return row[key] ?? '';
  }
  if (key === 'contextLength') return row.contextLength ?? 0;
  if (key === 'inputPrice' || key === 'outputPrice') return row[key] ?? 0;
  if (key === 'codingScore') return row[key] ?? -1;
  if (key === 'caps') return [row.hasVision && '视觉', row.hasTools && '工具', row.hasReasoning && '推理'].filter(Boolean).join(' ');
  return row[key] ?? '';
}

function isNumericColumn(key) {
  return currentTab === 'tools'
    ? ['contextWindow', 'minPrice', 'launchYear'].includes(key)
    : ['contextLength', 'inputPrice', 'outputPrice', 'codingScore'].includes(key);
}

function numericValue(row, key) {
  const raw = String(rawValue(row, key));
  if (key === 'contextWindow') return parseFloat(raw) * (raw.toLowerCase().includes('m') ? 1000 : 1);
  if (key === 'minPrice' || key === 'inputPrice' || key === 'outputPrice' || key === 'codingScore') {
    const match = raw.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }
  return Number(raw) || 0;
}

function matchesFilter(row, key) {
  const query = (filters[key] || '').trim().toLowerCase();
  if (!query) return true;
  if (!isNumericColumn(key)) return String(rawValue(row, key)).toLowerCase().includes(query);

  const comparison = query.match(/^(>=|<=|>|<|=)?\s*(-?\d+(?:\.\d+)?)/);
  if (!comparison) return String(rawValue(row, key)).toLowerCase().includes(query);
  const actual = numericValue(row, key);
  const expected = Number(comparison[2]);
  switch (comparison[1] || '=') {
    case '>': return actual > expected;
    case '>=': return actual >= expected;
    case '<': return actual < expected;
    case '<=': return actual <= expected;
    default: return actual === expected;
  }
}

function filteredAndSortedRows() {
  const rows = (currentTab === 'tools' ? tools : models).filter(row =>
    (currentTab === 'tools' ? toolCols : modelCols).every(([key]) => matchesFilter(row, key))
  );
  if (!sortKey || !sortDirection) return rows;
  const numeric = isNumericColumn(sortKey);
  return rows.sort((left, right) => {
    const a = numeric ? numericValue(left, sortKey) : String(rawValue(left, sortKey)).toLowerCase();
    const b = numeric ? numericValue(right, sortKey) : String(rawValue(right, sortKey)).toLowerCase();
    if (a === b) return 0;
    return (a > b ? 1 : -1) * sortDirection;
  });
}

function renderTable() {
  const cols = currentTab === 'tools' ? toolCols : modelCols;
  const rows = filteredAndSortedRows();
  const header = cols.map(([key, label]) => {
    const arrow = sortKey === key && sortDirection === 1 ? ' ↑' : sortKey === key && sortDirection === -1 ? ' ↓' : '';
    return `<th class="lb-th lb-sortable" data-key="${key}">${label}<span class="lb-arrow">${arrow || '↕'}</span></th>`;
  }).join('');
  const filterRow = cols.map(([key, label]) => `<th class="lb-filter-cell"><input class="lb-filter-input" data-filter-key="${key}" value="${String(filters[key] || '').replace(/"/g, '&quot;')}" placeholder="筛选 ${label}" aria-label="筛选${label}"></th>`).join('');
  const body = rows.length
    ? rows.map(row => `<tr>${cols.map(([key]) => `<td>${value(row, key)}</td>`).join('')}</tr>`).join('')
    : `<tr><td class="lb-no-results" colspan="${cols.length}">没有匹配的数据</td></tr>`;
  tableWrap.innerHTML = `<table class="lb-table"><thead><tr>${header}</tr><tr class="lb-filter-row">${filterRow}</tr></thead><tbody>${body}</tbody></table>`;

  tableWrap.querySelectorAll('.lb-sortable').forEach(headerCell => headerCell.addEventListener('click', () => {
    const key = headerCell.dataset.key;
    if (sortKey !== key) {
      sortKey = key;
      sortDirection = 1;
    } else if (sortDirection === 1) {
      sortDirection = -1;
    } else {
      sortKey = null;
      sortDirection = 0;
    }
    renderTable();
  }));
  tableWrap.querySelectorAll('.lb-filter-input').forEach(input => input.addEventListener('input', () => {
    filters[input.dataset.filterKey] = input.value;
    renderTable();
    const next = tableWrap.querySelector(`[data-filter-key="${input.dataset.filterKey}"]`);
    next?.focus();
    next?.setSelectionRange(next.value.length, next.value.length);
  }));
}

function renderCards() {
  const rows = currentTab === 'tools' ? tools : models;
  cards.innerHTML = `<div class="note-list">${rows.map(row => {
    if (currentTab === 'tools') {
      return `<div class="note-card lb-card"><div class="lb-card-head"><span class="lb-card-name">${row.name}</span><span class="lb-card-vendor">${row.vendor}</span></div><div class="lb-card-row"><span>${row.type}</span><span class="lb-card-context">${row.contextWindow || '—'}</span></div><div class="lb-card-models">${row.baseModels}</div><div class="lb-card-price">最低 ${row.minPrice} · ${row.bestPlan}</div><div class="note-tags">${(row.features || []).slice(0, 4).map(item => `<span class="note-tag">${item}</span>`).join('')}</div></div>`;
    }
    const caps = [row.hasVision && '👁 视觉', row.hasTools && '🔧 工具', row.hasReasoning && '🧠 推理'].filter(Boolean);
    return `<div class="note-card lb-card"><div class="lb-card-head"><span class="lb-card-name">${row.name}</span><span class="lb-card-vendor">${row.provider}</span></div><div class="lb-card-row"><span>参数 ${formatParams(row)}</span><span>上下文 ${formatNumber(row.contextLength)}</span></div><div class="lb-card-row">输入/输出：${formatPrice(row.inputPrice)} / ${formatPrice(row.outputPrice)}</div><div class="lb-card-meta">知识截止 ${row.knowledgeCutoff || '—'} · Coding ${row.codingScore ?? '—'}</div><div class="note-tags">${caps.map(item => `<span class="note-tag">${item}</span>`).join('')}</div></div>`;
  }).join('')}</div>`;
}

function render() {
  tableWrap.style.display = currentView === 'table' ? '' : 'none';
  cards.style.display = currentView === 'card' ? '' : 'none';
  if (currentView === 'table') renderTable();
  else renderCards();
}

document.querySelectorAll('#lbTabs .sub-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('#lbTabs .sub-tab').forEach(item => item.classList.toggle('active', item === tab));
  currentTab = tab.dataset.tab;
  sortKey = null;
  sortDirection = 0;
  filters = {};
  render();
}));

document.querySelectorAll('.lb-view-btn').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.lb-view-btn').forEach(item => item.classList.toggle('active', item === button));
  currentView = button.dataset.view;
  render();
}));

render();
