import { Plus, Trash2 } from "lucide-react";
import type { LifeEvent, SimulationParams } from "../lib/wealthSimulation";

type Props = {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
};

export function EventEditor({ params, onChange }: Props) {
  const updateEvent = (id: string, patch: Partial<LifeEvent>) => {
    onChange({
      ...params,
      events: params.events.map((event) => (event.id === id ? { ...event, ...patch } : event)),
    });
  };

  const removeEvent = (id: string) => {
    onChange({ ...params, events: params.events.filter((event) => event.id !== id) });
  };

  const addEvent = () => {
    const nextYear = Math.min(params.years, Math.max(1, params.events.length + 2));
    onChange({
      ...params,
      events: [
        ...params.events,
        {
          id: crypto.randomUUID(),
          year: nextYear,
          label: `事件 ${params.events.length + 1}`,
          incomeMode: "none",
          incomeValue: 0,
          expenseMode: "none",
          expenseValue: 0,
          oneTimeIncome: 0,
          oneTimeExpense: 0,
          newIncomeGrowthRate: null,
          newExpenseGrowthRate: null,
        },
      ],
    });
  };

  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">人生事件</p>
          <h2>特殊年份调整</h2>
        </div>
        <button className="primary-button" type="button" onClick={addEvent}>
          <Plus size={16} />
          新增事件
        </button>
      </div>

      <div className="event-list">
        {params.events.length === 0 ? <p className="empty">暂未添加事件。</p> : null}
        {params.events.map((event) => (
          <article className="event-row" key={event.id}>
            <div className="event-main">
              <label className="field">
                <span>名称</span>
                <input value={event.label} onChange={(e) => updateEvent(event.id, { label: e.target.value })} />
              </label>
              <label className="field mini">
                <span>年份</span>
                <input type="number" min="1" max={params.years} value={event.year} onChange={(e) => updateEvent(event.id, { year: Number(e.target.value) })} />
              </label>
              <ModeField
                label="收入调整"
                mode={event.incomeMode}
                value={event.incomeValue}
                options={[
                  ["none", "不修改"],
                  ["set", "改为金额"],
                  ["changePercent", "增减比例"],
                ]}
                onMode={(mode) => updateEvent(event.id, { incomeMode: mode as LifeEvent["incomeMode"] })}
                onValue={(value) => updateEvent(event.id, { incomeValue: value })}
                suffix={event.incomeMode === "changePercent" ? "%" : "元"}
              />
              <ModeField
                label="支出调整"
                mode={event.expenseMode}
                value={event.expenseValue}
                options={[
                  ["none", "不修改"],
                  ["set", "改为金额"],
                  ["changeAmount", "增减金额"],
                ]}
                onMode={(mode) => updateEvent(event.id, { expenseMode: mode as LifeEvent["expenseMode"] })}
                onValue={(value) => updateEvent(event.id, { expenseValue: value })}
                suffix="元"
              />
              <label className="field mini">
                <span>一次性收入</span>
                <input type="number" step="1000" value={event.oneTimeIncome} onChange={(e) => updateEvent(event.id, { oneTimeIncome: Number(e.target.value) })} />
              </label>
              <label className="field mini">
                <span>一次性支出</span>
                <input type="number" step="1000" value={event.oneTimeExpense} onChange={(e) => updateEvent(event.id, { oneTimeExpense: Number(e.target.value) })} />
              </label>
              <GrowthField label="之后收入增长率" value={event.newIncomeGrowthRate} onChange={(value) => updateEvent(event.id, { newIncomeGrowthRate: value })} />
              <GrowthField label="之后支出增长率" value={event.newExpenseGrowthRate} onChange={(value) => updateEvent(event.id, { newExpenseGrowthRate: value })} />
            </div>
            <button className="icon-button danger" type="button" onClick={() => removeEvent(event.id)} title="删除事件" aria-label="删除事件">
              <Trash2 size={17} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModeField({
  label,
  mode,
  value,
  options,
  onMode,
  onValue,
  suffix,
}: {
  label: string;
  mode: string;
  value: number;
  options: [string, string][];
  onMode: (mode: string) => void;
  onValue: (value: number) => void;
  suffix: string;
}) {
  const displayedValue = mode === "changePercent" ? value * 100 : value;
  return (
    <div className="field mode-field">
      <span>{label}</span>
      <div className="mode-grid">
        <select value={mode} onChange={(e) => onMode(e.target.value)}>
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
        <div className="input-with-suffix">
          <input
            type="number"
            step={mode === "changePercent" ? "1" : "1000"}
            disabled={mode === "none"}
            value={mode === "none" ? 0 : displayedValue}
            onChange={(e) => onValue(mode === "changePercent" ? Number(e.target.value) / 100 : Number(e.target.value))}
          />
          <em>{suffix}</em>
        </div>
      </div>
    </div>
  );
}

function GrowthField({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return (
    <label className="field mini">
      <span>{label}</span>
      <div className="input-with-suffix">
        <input
          type="number"
          step="0.1"
          placeholder="不变"
          value={value === null ? "" : (value * 100).toFixed(1)}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value) / 100)}
        />
        <em>%</em>
      </div>
    </label>
  );
}
