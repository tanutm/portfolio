// 1-bit diagrams authored from resume facts only. No metrics.
const F = "var(--font-pixel), monospace";

function Arrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <g stroke="#000" strokeWidth="2" fill="#000" shapeRendering="crispEdges">
      <line x1={x} y1={y1} x2={x} y2={y2 - 5} />
      <polygon points={`${x - 5},${y2 - 6} ${x + 5},${y2 - 6} ${x},${y2}`} />
    </g>
  );
}

function Box({ y, h = 30, label, inv }: { y: number; h?: number; label: string; inv?: boolean }) {
  return (
    <g shapeRendering="crispEdges">
      <rect x="10" y={y} width="300" height={h} fill={inv ? "#000" : "#fff"} stroke="#000" strokeWidth="2" />
      <text x="160" y={y + h / 2 + 5} textAnchor="middle" fontFamily={F} fontSize="14" fontWeight="700" fill={inv ? "#fff" : "#000"}>
        {label}
      </text>
    </g>
  );
}

function Flow({ steps, invIndex, title, desc, caption, id }: { steps: string[]; invIndex: number; title: string; desc: string; caption: string; id: string }) {
  const h = 4 + steps.length * 52 - 22;
  return (
    <figure className="fig">
      <svg viewBox={`0 0 320 ${h}`} role="img" aria-labelledby={`${id}-t ${id}-d`}>
        <title id={`${id}-t`}>{title}</title>
        <desc id={`${id}-d`}>{desc}</desc>
        {steps.map((s, i) => (
          <g key={s}>
            <Box y={4 + i * 52} h={30} label={s} inv={i === invIndex} />
            {i < steps.length - 1 && <Arrow x={160} y1={34 + i * 52} y2={56 + i * 52} />}
          </g>
        ))}
      </svg>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function ArchDiagram() {
  return (
    <figure className="fig">
      <svg viewBox="0 0 320 372" role="img" aria-labelledby="arch-t arch-d">
        <title id="arch-t">Agent architecture</title>
        <desc id="arch-d">A brief goes to one orchestrator agent, which calls a small set of facade tools, through a guarded operations layer, into the platform's many backend operations.</desc>
        <Box y={4} label="BRIEF" />
        <Arrow x={160} y1={34} y2={52} />
        <Box y={52} label="ORCHESTRATOR AGENT" inv />
        <Arrow x={160} y1={82} y2={100} />
        <g shapeRendering="crispEdges">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={10 + i * 21.5} y="100" width="17" height="30" fill={i === 13 ? "#fff" : "#000"} stroke="#000" strokeWidth="2" />
          ))}
          <text x="160" y="150" textAnchor="middle" fontFamily={F} fontSize="13" fontWeight="700">FACADE TOOLS (CAPPED PER REQUEST)</text>
        </g>
        <Arrow x={160} y1={156} y2={174} />
        <g shapeRendering="crispEdges">
          <rect x="10" y="174" width="300" height="72" fill="#fff" stroke="#000" strokeWidth="2" strokeDasharray="6 4" />
          <text x="160" y="196" textAnchor="middle" fontFamily={F} fontSize="14" fontWeight="700">GUARDED OPERATIONS LAYER</text>
          <text x="160" y="217" textAnchor="middle" fontFamily={F} fontSize="12">permissions · rate limits</text>
          <text x="160" y="235" textAnchor="middle" fontFamily={F} fontSize="12">idempotency · audit</text>
        </g>
        <Arrow x={160} y1={246} y2={264} />
        <g shapeRendering="crispEdges">
          <rect x="10" y="264" width="300" height="40" fill="#000" />
          {Array.from({ length: 24 }).map((_, i) => (
            <rect key={i} x={16 + i * 12.2} y="270" width="7" height="28" fill="#fff" />
          ))}
        </g>
        <text x="160" y="326" textAnchor="middle" fontFamily={F} fontSize="14" fontWeight="700">BACKEND OPERATIONS</text>
        <text x="160" y="350" textAnchor="middle" fontFamily={F} fontSize="12">tenant IDs overwritten · unknown methods fail closed</text>
      </svg>
      <figcaption>Fig. 1 · One agent, a few guarded tools, many operations.</figcaption>
    </figure>
  );
}

export function QueueFlow() {
  return (
    <Flow
      id="qf"
      invIndex={3}
      steps={["CHECKOUT ORDER", "RULE LAYER (sets review band)", "RISK MODEL (returns · reversals)", "REVIEW QUEUE (advisory only)", "DAILY OPS EMAIL"]}
      title="Order reversal review queue"
      desc="An order passes a rule layer that sets a review band, then a risk model that scores returns for prepaid orders and reversals for cash on delivery. The result is an advisory review queue sent to the daily ops email."
      caption="Fig. 2 · Rules and a model decide what to review. Nothing is held or cancelled automatically."
    />
  );
}

export function SowPipeline() {
  return (
    <Flow
      id="sow"
      invIndex={3}
      steps={["CLIENT BRIEF", "INTAKE AGENT (minimum input)", "PER-SECTION AGENTS (draft)", "REVIEW STEP (flags issues)", "STATEMENT OF WORK"]}
      title="SOW generation pipeline"
      desc="A client brief passes an intake agent, per-section drafting agents and a review step that flags inconsistencies, hallucinated content, gaps and leftover placeholders, producing a Statement of Work."
      caption="Fig. 3 · LangGraph multi-agent flow that turns a brief into a Statement of Work."
    />
  );
}

export function PaperDiagram() {
  return (
    <Flow
      id="pp"
      invIndex={3}
      steps={["COTTON LEAF IMAGE", "CNN (features)", "RANDOM FOREST (classify)", "DISEASE DIAGNOSIS"]}
      title="Hybrid CNN and Random Forest"
      desc="Cotton images pass through a CNN for features, then a Random Forest classifier that diagnoses the disease."
      caption="Fig. 4 · IEEE AUTOCOM, multiclass cotton disease diagnosis."
    />
  );
}
