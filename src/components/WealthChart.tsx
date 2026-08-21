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

type ScenarioLine = {
  key: string;
  name: string;
  color: string;
  result: SimulationResult;
};

type Props = {
  result: SimulationResult;
  scenarios: ScenarioLine[];
};

export function WealthChart({ result, scenarios }: Props) {
  const maxYears = Math.max(result.rows.length, ...scenarios.map((scenario) => scenario.result.rows.length));
  const data = Array.from({ length: maxYears }, (_, index) => {
    const year = index + 1;
    const point: Record<string, number | string | null> = {
      year: `第${year}年`,
      current: result.rows[index]?.startWealth ?? null,
    };

    scenarios.forEach((scenario) => {
      point[scenario.key] = scenario.result.rows[index]?.startWealth ?? null;
    });

    return point;
  });

  const crossing = result.firstKAtLeastOne;

  return (
    <section className="panel chart-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">图表</p>
          <h2>财富增长曲线</h2>
        </div>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 22, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 10000)}万`} tick={{ fontSize: 12 }} width={58} />
            <Tooltip formatter={(value) => formatPlainMoney(Number(value))} labelStyle={{ color: "#111827" }} />
            <Legend />
            <Line type="monotone" dataKey="current" name="当前参数" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            {scenarios.map((scenario) => (
              <Line key={scenario.key} type="monotone" dataKey={scenario.key} name={scenario.name} stroke={scenario.color} strokeWidth={2} dot={false} />
            ))}
            {crossing ? <ReferenceDot x={`第${crossing.year}年`} y={crossing.startWealth} r={5} fill="#dc2626" stroke="#fff" label="K=1" /> : null}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
