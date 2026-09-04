const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}))?/;

export function entryTimestamp(value) {
  const match = DATE_TIME_PATTERN.exec(String(value ?? '').trim());
  if (!match) return 0;
  const [, year, month, day, hour = '00', minute = '00'] = match;
  const timestamp = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function localDateStamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function localDateTimeStamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${localDateStamp(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
