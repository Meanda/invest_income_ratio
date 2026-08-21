import { formatMoney } from "../lib/format";
import type { SimulationResult } from "../lib/wealthSimulation";

type Props = {
  result: SimulationResult;
};

export function SummaryCards({ result }: Props) {
  const crossing = result.firstKAtLeastOne;

  return (
    <section className="summary-grid" aria-label="关键结论">
      <MetricCard label="期末总资产" value={formatMoney(result.finalWealth)} />
      <MetricCard label="累计主动储蓄" value={formatMoney(result.totalSavings)} />
      <MetricCard label="累计资本收益" value={formatMoney(result.totalCapitalReturn)} />
      <MetricCard label="K 首次 >= 1" value={crossing ? `第 ${crossing.year} 年` : "尚未达到"} />
      <MetricCard label="该年年初资产" value={crossing ? formatMoney(crossing.startWealth) : "N/A"} />
      <MetricCard label="该年资本收益" value={crossing ? formatMoney(crossing.capitalReturn) : "N/A"} />
      <MetricCard label="该年主动储蓄" value={crossing ? formatMoney(crossing.saving) : "N/A"} />
      <div className="metric-card note-card">
        <span>判断</span>
        <strong>{crossing ? "资本收益已追上主动储蓄" : "模拟期内资本收益尚未超过主动储蓄。"}</strong>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
