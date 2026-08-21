# 个人财富增长模拟器

一个用于学习和情景分析的本地浏览器小工具。所有计算在浏览器端完成，不需要登录、不需要后端，也不会上传用户输入数据。

## 项目结构

```text
.
├── index.html
├── package.json
├── tsconfig.json
└── src
    ├── App.tsx
    ├── main.tsx
    ├── styles.css
    ├── components
    │   ├── ContributionChart.tsx
    │   ├── EventEditor.tsx
    │   ├── InputPanel.tsx
    │   ├── ModelNotes.tsx
    │   ├── RatioChart.tsx
    │   ├── ScenarioPanel.tsx
    │   ├── SummaryCards.tsx
    │   ├── WealthChart.tsx
    │   └── YearlyTable.tsx
    └── lib
        ├── format.ts
        └── wealthSimulation.ts
```

## 实现方案

- `wealthSimulation.ts` 负责年度递推、人生事件应用、K 值判断和汇总结果。
- `InputPanel` 负责基础参数输入，百分比参数同时提供数字输入和滑块。
- `SummaryCards` 展示期末资产、累计主动储蓄、累计资本收益和 K 首次达到 1 的年份信息。
- `WealthChart` 展示财富曲线，并叠加已保存情景 A/B/C。
- `ContributionChart` 展示主动储蓄和资本收益，并标记第一次 `K = 1`。
- `RatioChart` 单独展示资本贡献比 K，避免和金额曲线混在一起难读。
- `EventEditor` 支持指定年份修改收入、支出、一次性收入/支出，以及之后的增长率。
- `ScenarioPanel` 支持保存、载入、清除情景 A/B/C。
- `localStorage` 自动保存上一次参数和情景。

## 本地运行

```bash
npm install
npm run dev
```

然后在浏览器打开终端显示的本地地址。

## 构建

```bash
npm run build
```
