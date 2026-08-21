import { RotateCcw, Save } from "lucide-react";
import type { SimulationParams } from "../lib/wealthSimulation";

type Props = {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
  onReset: () => void;
  onSaveScenario: (slot: "A" | "B" | "C") => void;
};

export function InputPanel({ params, onChange, onReset, onSaveScenario }: Props) {
  const setNumber = (key: keyof SimulationParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <section className="panel input-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">输入参数</p>
          <h2>基础假设</h2>
        </div>
        <button className="icon-button" type="button" onClick={onReset} title="恢复默认值" aria-label="恢复默认值">
          <RotateCcw size={18} />
        </button>
      </div>

      <NumberField label="初始净资产" suffix="元" value={params.initialWealth} onChange={(value) => setNumber("initialWealth", value)} />
      <NumberField label="初始年收入" suffix="元" value={params.initialIncome} onChange={(value) => setNumber("initialIncome", value)} />
      <NumberField label="初始年生活支出" suffix="元" value={params.initialExpense} onChange={(value) => setNumber("initialExpense", value)} />
      <PercentField label="投资年化收益率" value={params.returnRate} min={-0.1} max={0.2} onChange={(value) => setNumber("returnRate", value)} />
      <PercentField label="收入年增长率" value={params.incomeGrowthRate} min={-0.1} max={0.2} onChange={(value) => setNumber("incomeGrowthRate", value)} />
      <PercentField label="支出年增长率" value={params.expenseGrowthRate} min={-0.1} max={0.2} onChange={(value) => setNumber("expenseGrowthRate", value)} />

      <label className="field">
        <span>模拟年数</span>
        <select value={params.years} onChange={(event) => setNumber("years", Number(event.target.value))}>
          {[10, 20, 30, 40].map((year) => (
            <option key={year} value={year}>
              {year} 年
            </option>
          ))}
        </select>
      </label>

      <div className="scenario-save">
        <span>保存当前参数为</span>
        {(["A", "B", "C"] as const).map((slot) => (
          <button key={slot} type="button" onClick={() => onSaveScenario(slot)}>
            <Save size={15} />
            情景{slot}
          </button>
        ))}
      </div>
    </section>
  );
}

function NumberField({ label, suffix, value, onChange }: { label: string; suffix: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input-with-suffix">
        <input type="number" min="0" step="1000" value={Math.round(value)} onChange={(event) => onChange(Number(event.target.value))} />
        <em>{suffix}</em>
      </div>
    </label>
  );
}

function PercentField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="field percent-field">
      <span>{label}</span>
      <div className="percent-row">
        <input type="range" min={min * 100} max={max * 100} step="0.1" value={value * 100} onChange={(event) => onChange(Number(event.target.value) / 100)} />
        <div className="input-with-suffix compact">
          <input type="number" step="0.1" value={(value * 100).toFixed(1)} onChange={(event) => onChange(Number(event.target.value) / 100)} />
          <em>%</em>
        </div>
      </div>
    </div>
  );
}
