export function ModelNotes() {
  return (
    <section className="panel notes">
      <div className="section-header">
        <div>
          <p className="eyebrow">模型说明</p>
          <h2>如何理解 K</h2>
        </div>
      </div>
      <p>资本贡献比 K = 年资本收益 ÷ 年主动储蓄。</p>
      <ul>
        <li>K &lt; 1：财富增长主要依赖主动储蓄。</li>
        <li>K = 1：资本收益和主动储蓄贡献相当。</li>
        <li>K &gt; 1：资本收益已经超过主动储蓄。</li>
      </ul>
      <p className="disclaimer">本工具仅用于情景模拟和学习。年化收益率不是保证收益，实际市场收益存在巨大年度波动，收入和生活支出也不会严格按照固定增长率变化。资本贡献比不是“财富自由指标”。所有计算都在浏览器本地完成。</p>
    </section>
  );
}
