import { useEffect, useMemo, useState } from "react";
import { ContributionChart } from "./components/ContributionChart";
import { EventEditor } from "./components/EventEditor";
import { InputPanel } from "./components/InputPanel";
import { ModelNotes } from "./components/ModelNotes";
import { RatioChart } from "./components/RatioChart";
import { ScenarioPanel } from "./components/ScenarioPanel";
import { SummaryCards } from "./components/SummaryCards";
import { WealthChart } from "./components/WealthChart";
import { YearlyTable } from "./components/YearlyTable";
import { defaultParams, simulateWealth, type SimulationParams } from "./lib/wealthSimulation";

type ScenarioSlot = "A" | "B" | "C";
type SavedScenario = {
  slot: ScenarioSlot;
  name: string;
  color: string;
  params: SimulationParams | null;
};

const STORAGE_KEY = "wealth-simulator-state-v1";

const initialScenarios: SavedScenario[] = [
  { slot: "A", name: "情景A", color: "#0f766e", params: null },
  { slot: "B", name: "情景B", color: "#9333ea", params: null },
  { slot: "C", name: "情景C", color: "#c2410c", params: null },
];

export function App() {
  const [params, setParams] = useState<SimulationParams>(() => loadState()?.params ?? defaultParams);
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => loadState()?.scenarios ?? initialScenarios);
  const result = useMemo(() => simulateWealth(params), [params]);

  const scenarioLines = useMemo(
    () =>
      scenarios
        .filter((scenario): scenario is SavedScenario & { params: SimulationParams } => scenario.params !== null)
        .map((scenario) => ({
          key: `scenario${scenario.slot}`,
          name: scenario.name,
          color: scenario.color,
          result: simulateWealth(scenario.params),
        })),
    [scenarios],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ params, scenarios }));
  }, [params, scenarios]);

  const saveScenario = (slot: ScenarioSlot) => {
    setScenarios((current) =>
      current.map((scenario) => (scenario.slot === slot ? { ...scenario, params: structuredClone(params) } : scenario)),
    );
  };

  const loadScenario = (slot: ScenarioSlot) => {
    const scenario = scenarios.find((item) => item.slot === slot);
    if (scenario?.params) setParams(structuredClone(scenario.params));
  };

  const clearScenario = (slot: ScenarioSlot) => {
    setScenarios((current) => current.map((scenario) => (scenario.slot === slot ? { ...scenario, params: null } : scenario)));
  };

  const resetDefaults = () => {
    setParams(defaultParams);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">本地浏览器工具</p>
          <h1>个人财富增长模拟器</h1>
        </div>
        <p>按年度推演主动储蓄、资本收益与 K 值变化，适合做学习和情景分析。</p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <InputPanel params={params} onChange={setParams} onReset={resetDefaults} onSaveScenario={saveScenario} />
          <ScenarioPanel scenarios={scenarios} onLoad={loadScenario} onClear={clearScenario} />
        </aside>

        <div className="content">
          <SummaryCards result={result} />
          <div className="charts-grid">
            <WealthChart result={result} scenarios={scenarioLines} />
            <ContributionChart result={result} />
          </div>
          <RatioChart result={result} />
          <EventEditor params={params} onChange={setParams} />
          <YearlyTable result={result} />
          <ModelNotes />
        </div>
      </div>
    </main>
  );
}

function loadState(): { params: SimulationParams; scenarios: SavedScenario[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      params: { ...defaultParams, ...parsed.params, events: parsed.params?.events ?? [] },
      scenarios: mergeScenarios(parsed.scenarios),
    };
  } catch {
    return null;
  }
}

function mergeScenarios(value: unknown): SavedScenario[] {
  if (!Array.isArray(value)) return initialScenarios;
  return initialScenarios.map((base) => {
    const saved = value.find((item): item is Partial<SavedScenario> => isScenarioLike(item) && item.slot === base.slot);
    return { ...base, ...saved };
  });
}

function isScenarioLike(value: unknown): value is Partial<SavedScenario> {
  return typeof value === "object" && value !== null && "slot" in value;
}
