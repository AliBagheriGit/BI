import { CurrencyUnit, TempUnit, Language } from '../types/bi-bas';

// Format temperature with unit
export function formatTemp(celsius: number, unit: TempUnit = 'C', lang: Language = 'fa'): string {
  const val = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  const formatted = val.toFixed(1);
  const symbol = unit === 'C' ? '°C' : '°F';
  return `${toFarsiDigits(formatted, lang)} ${symbol}`;
}

// Convert numbers to Persian digits if language is Persian
export function toFarsiDigits(input: string | number, lang: Language = 'fa'): string {
  if (lang !== 'fa') return String(input);
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (w) => farsiDigits[+w]);
}

// Format currency
export function formatCurrency(
  amountToman: number,
  currency: CurrencyUnit = 'IRR',
  lang: Language = 'fa'
): string {
  if (currency === 'USD') {
    const usd = (amountToman / 60000).toFixed(1);
    return `$${usd}`;
  }
  // Toman format
  const formatted = Math.round(amountToman).toLocaleString();
  const label = lang === 'fa' ? 'تومان' : 'Toman';
  return `${toFarsiDigits(formatted, lang)} ${label}`;
}

// Format power / energy
export function formatPower(kw: number, lang: Language = 'fa'): string {
  const formatted = kw.toFixed(1);
  const unit = lang === 'fa' ? 'کیلووات' : 'kW';
  return `${toFarsiDigits(formatted, lang)} ${unit}`;
}

// Export array of objects as CSV
export function exportToCsv(data: Record<string, unknown>[], filename: string) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((field) => JSON.stringify(row[field] ?? '')).join(',')
  );
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export data as JSON file
export function exportToJson(data: unknown, filename: string) {
  const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', jsonContent);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Class name joiner
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

