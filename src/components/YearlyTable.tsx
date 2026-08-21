import { formatMoney, formatPercent, formatRatio } from "../lib/format";
import type { SimulationResult } from "../lib/wealthSimulation";

export function YearlyTable({ result }: { result: SimulationResult }) {
  return (
    <section className="panel table-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">年度明细</p>
          <h2>完整模拟表</h2>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>年份</th>
              <th>年初净资产</th>
              <th>年收入</th>
              <th>年生活支出</th>
              <th>年主动储蓄</th>
              <th>储蓄率</th>
              <th>年资本收益</th>
              <th>资本贡献比</th>
              <th>年末净资产</th>
              <th>事件</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.year}>
                <td>第 {row.year} 年</td>
                <td>{formatMoney(row.startWealth)}</td>
                <td>{formatMoney(row.income)}</td>
                <td>{formatMoney(row.expense)}</td>
                <td className={row.saving < 0 ? "negative" : ""}>{formatMoney(row.saving)}</td>
                <td>{formatPercent(row.savingRate)}</td>
                <td>{formatMoney(row.capitalReturn)}</td>
                <td>{formatRatio(row.contributionRatio)}</td>
                <td>{formatMoney(row.endWealth)}</td>
                <td>{row.appliedEvents.join("、") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
