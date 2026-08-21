import type { SimulationParams } from "../lib/wealthSimulation";

type Scenario = {
  slot: "A" | "B" | "C";
  name: string;
  params: SimulationParams | null;
};

type Props = {
  scenarios: Scenario[];
  onLoad: (slot: "A" | "B" | "C") => void;
  onClear: (slot: "A" | "B" | "C") => void;
};

export function ScenarioPanel({ scenarios, onLoad, onClear }: Props) {
  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">情景比较</p>
          <h2>已保存情景</h2>
        </div>
      </div>
      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <div className="scenario-card" key={scenario.slot}>
            <strong>{scenario.name}</strong>
            {scenario.params ? (
              <span>
                r {(scenario.params.returnRate * 100).toFixed(1)}% · h {(scenario.params.incomeGrowthRate * 100).toFixed(1)}% · g {(scenario.params.expenseGrowthRate * 100).toFixed(1)}%
              </span>
            ) : (
              <span>尚未保存</span>
            )}
            <div>
              <button type="button" disabled={!scenario.params} onClick={() => onLoad(scenario.slot)}>
                载入
              </button>
              <button type="button" disabled={!scenario.params} onClick={() => onClear(scenario.slot)}>
                清除
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
