import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPlainMoney } from "../lib/format";
import type { SimulationResult } from "../lib/wealthSimulation";

type Props = {
  result: SimulationResult;
};

export function ContributionChart({ result }: Props) {
  const data = result.rows.map((row) => ({
    year: `第${row.year}年`,
    saving: row.saving,
    capitalReturn: row.capitalReturn,
    contributionRatio: row.contributionRatio,
  }));
  const crossing = result.firstKAtLeastOne;

  return (
    <section className="panel chart-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">图表</p>
          <h2>财富增长的两个发动机</h2>
        </div>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 22, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 10000)}万`} tick={{ fontSize: 12 }} width={58} />
            <Tooltip formatter={(value, name) => (name === "资本贡献比 K" ? Number(value).toFixed(2) : formatPlainMoney(Number(value)))} />
            <Legend />
            <Line type="monotone" dataKey="saving" name="年主动储蓄" stroke="#059669" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="capitalReturn" name="年资本收益" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            {crossing ? <ReferenceDot x={`第${crossing.year}年`} y={crossing.capitalReturn} r={6} fill="#dc2626" stroke="#fff" label="K = 1" /> : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
