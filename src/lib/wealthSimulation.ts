export type SimulationParams = {
  initialWealth: number;
  initialIncome: number;
  initialExpense: number;
  returnRate: number;
  incomeGrowthRate: number;
  expenseGrowthRate: number;
  years: number;
  events: LifeEvent[];
};

export type LifeEvent = {
  id: string;
  year: number;
  label: string;
  incomeMode: "none" | "set" | "changePercent";
  incomeValue: number;
  expenseMode: "none" | "set" | "changeAmount";
  expenseValue: number;
  oneTimeIncome: number;
  oneTimeExpense: number;
  newIncomeGrowthRate: number | null;
  newExpenseGrowthRate: number | null;
};

export type YearlyResult = {
  year: number;
  startWealth: number;
  income: number;
  expense: number;
  saving: number;
  savingRate: number | null;
  capitalReturn: number;
  contributionRatio: number | null;
  endWealth: number;
  appliedEvents: string[];
};

export type SimulationResult = {
  rows: YearlyResult[];
  finalWealth: number;
  totalSavings: number;
  totalCapitalReturn: number;
  firstKAtLeastOne: YearlyResult | null;
};

export const defaultParams: SimulationParams = {
  initialWealth: 33000,
  initialIncome: 100000,
  initialExpense: 72000,
  returnRate: 0.06,
  incomeGrowthRate: 0.05,
  expenseGrowthRate: 0.03,
  years: 30,
  events: [],
};

export function simulateWealth(params: SimulationParams): SimulationResult {
  let wealth = finiteNumber(params.initialWealth);
  let income = finiteNumber(params.initialIncome);
  let expense = finiteNumber(params.initialExpense);
  let incomeGrowthRate = finiteNumber(params.incomeGrowthRate);
  let expenseGrowthRate = finiteNumber(params.expenseGrowthRate);
  const returnRate = finiteNumber(params.returnRate);
  const years = Math.max(1, Math.floor(finiteNumber(params.years)));
  const rows: YearlyResult[] = [];

  for (let year = 1; year <= years; year += 1) {
    const appliedEvents = params.events
      .filter((event) => event.year === year)
      .sort((a, b) => a.id.localeCompare(b.id));

    for (const event of appliedEvents) {
      if (event.incomeMode === "set") income = finiteNumber(event.incomeValue);
      if (event.incomeMode === "changePercent") income *= 1 + finiteNumber(event.incomeValue);
      if (event.expenseMode === "set") expense = finiteNumber(event.expenseValue);
      if (event.expenseMode === "changeAmount") expense += finiteNumber(event.expenseValue);
      if (event.newIncomeGrowthRate !== null) incomeGrowthRate = finiteNumber(event.newIncomeGrowthRate);
      if (event.newExpenseGrowthRate !== null) expenseGrowthRate = finiteNumber(event.newExpenseGrowthRate);
    }

    const adjustedIncome = income + appliedEvents.reduce((sum, event) => sum + finiteNumber(event.oneTimeIncome), 0);
    const adjustedExpense = expense + appliedEvents.reduce((sum, event) => sum + finiteNumber(event.oneTimeExpense), 0);
    const saving = adjustedIncome - adjustedExpense;
    const capitalReturn = returnRate * wealth;
    const contributionRatio = saving > 0 ? capitalReturn / saving : null;
    const savingRate = adjustedIncome > 0 ? saving / adjustedIncome : null;
    const endWealth = wealth + saving + capitalReturn;

    rows.push({
      year,
      startWealth: wealth,
      income: adjustedIncome,
      expense: adjustedExpense,
      saving,
      savingRate,
      capitalReturn,
      contributionRatio,
      endWealth,
      appliedEvents: appliedEvents.map((event) => event.label).filter(Boolean),
    });

    wealth = endWealth;
    income *= 1 + incomeGrowthRate;
    expense *= 1 + expenseGrowthRate;
  }

  return {
    rows,
    finalWealth: rows.at(-1)?.endWealth ?? wealth,
    totalSavings: rows.reduce((sum, row) => sum + row.saving, 0),
    totalCapitalReturn: rows.reduce((sum, row) => sum + row.capitalReturn, 0),
    firstKAtLeastOne: rows.find((row) => row.contributionRatio !== null && row.contributionRatio >= 1) ?? null,
  };
}

function finiteNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}
