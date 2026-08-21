export function formatMoney(value: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPlainMoney(value: number): string {
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "N/A";
  return `${(value * 100).toFixed(2)}%`;
}

export function formatRatio(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "主动储蓄<=0";
  return value.toFixed(2);
}
