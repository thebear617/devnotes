const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try { return JSON.parse(trimmed); } catch { return trimmed.slice(1, -1); }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  return trimmed;
}

function splitTopLevel(value) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quote = '';
  let escaped = false;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (quote === '"' && escaped) escaped = false;
      else if (quote === '"' && char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '[' || char === '{') depth += 1;
    if (char === ']' || char === '}') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  const tail = value.slice(start).trim();
  if (tail || parts.length) parts.push(tail);
  return parts.filter(Boolean);
}

function findTopLevelColon(value) {
  let quote = '';
  let escaped = false;
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (quote === '"' && escaped) escaped = false;
      else if (quote === '"' && char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '[' || char === '{') depth += 1;
    if (char === ']' || char === '}') depth -= 1;
    if (char === ':' && depth === 0) return index;
  }
  return -1;
}

export function parseInlineValue(raw) {
  const value = raw.trim();
  if (!value) return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return unquote(value);
  }
  if (value.startsWith('[') && value.endsWith(']')) {
    return splitTopLevel(value.slice(1, -1)).map(parseInlineValue);
  }
  if (value.startsWith('{') && value.endsWith('}')) {
    const object = {};
    for (const part of splitTopLevel(value.slice(1, -1))) {
      const colon = findTopLevelColon(part);
      if (colon < 0) continue;
      const key = unquote(part.slice(0, colon));
      object[key] = parseInlineValue(part.slice(colon + 1));
    }
    return object;
  }
  return value;
}

export function parseFrontmatter(source) {
  const match = source.match(FRONTMATTER_PATTERN);
  if (!match) return { frontmatter: {}, body: source };

  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) frontmatter[field[1]] = parseInlineValue(field[2]);
  }
  return { frontmatter, body: match[2] };
}

function yamlValue(value) {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (Array.isArray(value) || (value && typeof value === 'object')) return JSON.stringify(value);
  return JSON.stringify(String(value ?? ''));
}

export function serializeMarkdown(frontmatter, body, fieldOrder, { omitEmpty = [] } = {}) {
  const order = [...fieldOrder, ...Object.keys(frontmatter).filter((field) => !fieldOrder.includes(field))];
  const lines = ['---'];
  for (const field of order) {
    const value = frontmatter[field];
    if (value === undefined || value === null) continue;
    if (omitEmpty.includes(field) && value === '') continue;
    lines.push(`${field}: ${yamlValue(value)}`);
  }
  lines.push('---', '', String(body || '').replace(/^\n+/, ''));
  return `${lines.join('\n')}\n`;
}

export function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}

export function isDateOrDateTime(value) {
  return /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2})?$/.test(String(value || ''));
}

export function validUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
