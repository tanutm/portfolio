// Single source of truth: every fact below comes from docs/resume.txt.
export const profile = {
  name: "Tripti Mandal",
  role: "AI Engineer",
  email: "mtripti357@gmail.com",
  linkedin: "https://linkedin.com/in/tripti-mandal-3a247b233",
  github: "https://github.com/tanutm",
  summary:
    "AI Engineer with 1+ year experience building production LLM agent systems: tool-calling agents, context engineering, evals and guardrails. Shipped a multi-tenant agentic ad-creative workspace and a review-queue risk system for e-commerce checkout.",
};

export const skills = [
  { group: "LLM & Agents", items: ["OpenAI Agents SDK", "Function Calling", "Multi-Agent Orchestration (LangGraph)", "RAG (FAISS)", "LLM-as-Judge", "Guardrails"] },
  { group: "Machine Learning", items: ["Data Cleaning", "Feature Engineering", "scikit-learn", "MLflow"] },
  { group: "Languages & Backend", items: ["Python", "TypeScript", "SQL", "FastAPI", "Pydantic", "React", "WebSockets", "Docker", "ffmpeg"] },
  { group: "Data & Cloud", items: ["Azure OpenAI", "MongoDB", "ClickHouse", "MySQL", "pandas", "NumPy"] },
];

export const highlights = [
  { value: "8", label: "brands adopted the multi-tenant ad workspace; one produces 150+ creatives per week" },
  { value: "352 → 14", label: "backend operations exposed through 14 facade tools behind a guarded operations layer" },
  { value: ">90%", label: "skill-context reduction: 8–10K-token playbooks replaced by ~600-token digests" },
  { value: "800+", label: "automated tests, run against real ffmpeg and Mongo" },
];

export const seleric = {
  company: "Seleric Systems",
  title: "AI Engineer",
  dates: "Aug 2025 – Present",
  client: "Client engagement: Space Pepper Studios (via Tervigon Collective)",
  projects: [
    {
      name: "AI Ad-Creative Platform",
      stack: "Python, FastAPI, OpenAI Agents SDK, React, MongoDB, ClickHouse, Azure OpenAI, ffmpeg",
      bullets: [
        "Built and own a multi-tenant chat-to-canvas ad workspace where one orchestrator agent (OpenAI Agents SDK) turns a brief into generated, edited and delivered creatives with a live reasoning trace on the canvas; adopted by 8 brands, one producing 150+ creatives per week.",
        "Scaled one agent across 352 backend operations by exposing them through 14 facade tools behind a guarded operations layer (permissions, rate limits, idempotency, audit), and capped every request at 15 tools with a deterministic, model-free scorer; replacing 8–10K-token skill playbooks with ~600-token digests cut skill context by over 90%.",
        "Stopped off-brand and duplicate creatives before delivery with tiered image QA (cheap pixel checks, then a 3-look vision comparison where 2+ looks must agree, then 2-vote confirmation before any paid repair); flagged off-look frames and duplicates in 2/2 real-model trials each, with exact checks (CIEDE2000 colour, dHash) done in code, not by the judge.",
        "Made spend measurable by tracking cost per accepted creative (credits spent ÷ approved or exported deliverables) from the per-call audit trail, reported by creative type with first-pass QA-gate pass rate as a guard metric.",
        "Secured the platform for multiple tenants by overwriting client-supplied tenant IDs in the DB proxy (unknown methods fail closed), adding confirm-before-spend and an SSRF guard, and backing it with cross-tenant isolation suites within 800+ automated tests run against real ffmpeg and Mongo.",
      ],
    },
    {
      name: "Order Reversal Review Queue",
      stack: "Python, LightGBM, scikit-learn, ClickHouse, MLflow",
      bullets: [
        "Shipped a review-only checkout queue for one brand to the daily ops email: a 44-scenario P0–P5 rule layer sets the review band, and a dual-head LightGBM (prepaid: customer return; COD: any reversal) drives the review flag and expected-loss estimate. Point-in-time-safe features, 45-day label maturity, chronological split on 15,413 mature orders.",
        "On a 3,083-order holdout (28% base rate), the top 20% by score captured 29% of reversals at ~40% precision (AUC 0.672, 95% CI 0.65–0.69); the review flag (59% of orders) catches 80% of reversals.",
        "Validated the model against a COD-first rule baseline; COD-only models showed no lift (AUC 0.51–0.55) and were kept out of production, so COD risk is handled by rule bands (P0–P1 trigger phone confirmation before dispatch). The queue is advisory only: prepaid orders are never held and no order is auto-cancelled. Early live check (554 paid orders, labels still maturing): High-risk band reversal rate 22% vs 12% overall.",
        "Built a daily ops report (per-order SHAP factors, data-quality checks) with PSI, calibration and AUC alerts in MLflow. Caught AUC drift (0.68 → 0.65, Jul–Sep) as product mix shifted toward footwear (12 features at PSI ≥ 0.25) and set up monthly retraining in response.",
      ],
    },
  ],
};

export const relinns = {
  company: "Relinns Technologies",
  url: "https://relinns.com/",
  title: "AI/ML Engineer Intern",
  dates: "Dec 2024 – Aug 2025",
  items: [
    { name: "NL-to-SQL Agent (POC, BotPenguin)", text: "Built a multi-agent text-to-SQL system with FAISS schema retrieval; cut latency 35% across 50+ benchmark queries." },
    { name: "SOW Generation (LangGraph)", text: "Built a multi-agent pipeline that turns a client brief into a Statement of Work: an intake agent collects the minimum input, per-section agents draft, and a review step flags inconsistencies, hallucinated content, gaps and leftover placeholders. Cut preparation time 60% and manual revisions 70%." },
    { name: "Voice Agent Pilot (Twilio, OpenAI, WebRTC)", text: "Built a real-time voice agent with 95%+ completion over 100+ simulated calls; context retention cut repeated prompts 40%." },
  ],
};

export const education = {
  school: "Swami Vivekanand Institute of Engineering & Technology",
  degree: "B.Tech in Computer Science & Engineering",
  cgpa: "CGPA: 8.72/10",
  place: "Banur, Punjab",
  dates: "Aug 2021 – Aug 2025",
};

export const publication = {
  title: "Cotton Diseases Multiclassification: CNN and Random Forest Approach",
  venue: "2024 International Conference on Automation and Computation (AUTOCOM) | IEEE",
  date: "Mar 2024",
  url: "https://doi.org/10.1109/AUTOCOM60220.2024.10486176",
  text: "Designed a hybrid CNN-Random Forest model reaching 96–98% accuracy for multiclass cotton disease diagnosis.",
};

export const certifications = [
  { name: "IBM Data Science Professional Certificate", issuer: "IBM", date: "Jun 2024", url: "https://www.credly.com/badges/60d1f076-8a3a-4254-bed9-1bbfdfe70e8c/linked_in_profile" },
  { name: "Microsoft Power BI Data Analyst", issuer: "Microsoft", date: "Apr 2024", url: "https://www.coursera.org/account/accomplishments/records/AEEPJXMFMU4Z" },
  { name: "Programming in Python", issuer: "Meta", date: "Jan 2024", url: "https://www.coursera.org/account/accomplishments/records/PH6XURREWLFL" },
  { name: "EDA with Python and Pandas", issuer: "Coursera", date: "Jan 2024", url: "https://www.coursera.org/account/accomplishments/records/M46QFXRU7AAT" },
];
