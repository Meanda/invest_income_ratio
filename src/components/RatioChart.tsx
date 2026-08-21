import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SimulationResult } from "../lib/wealthSimulation";

export function RatioChart({ result }: { result: SimulationResult }) {
  const data = result.rows.map((row) => ({
    year: `第${row.year}年`,
    contributionRatio: row.contributionRatio,
  }));

  return (
    <section className="panel chart-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">图表</p>
          <h2>资本贡献比 K</h2>
        </div>
      </div>
      <div className="chart-box short">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 18, right: 22, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={46} />
            <Tooltip formatter={(value) => Number(value).toFixed(2)} />
            <ReferenceLine y={1} stroke="#dc2626" strokeDasharray="4 4" label="K=1" />
            <Line type="monotone" dataKey="contributionRatio" name="资本贡献比 K" stroke="#7c3aed" strokeWidth={3} dot={false} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
