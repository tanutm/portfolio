"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  profile, skills, seleric, relinns, education, publication, certifications,
} from "@/lib/content";

import { ArchDiagram, QueueFlow, SowPipeline, PaperDiagram } from "./Diagrams";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

const LAYERS = [
  { id: "top", menu: "Home", name: "Input" },
  { id: "operations", menu: "Platform", name: "Complexity" },
  { id: "tools", menu: "Agent", name: "Structure" },
  { id: "queue", menu: "Queue", name: "Decision" },
  { id: "internship", menu: "Intern", name: "Pipeline" },
  { id: "foundations", menu: "Skills", name: "Foundations" },
  { id: "contact", menu: "Contact", name: "Output" },
];

function Photo({ src, alt, credit }: { src: string; alt: string; credit: string }) {
  return (
    <figure className="fig photo-fig">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
    </figure>
  );
}

const SHOTS = [
  {
    n: 1, label: "Chat-to-canvas workspace",
    alt: "Chat-to-canvas workspace: assistant chat, character asset library and an artboard canvas with generated character sheets",
    blurb: "Describe what you want in chat and the agent builds it on a shared canvas.",
    features: [
      "Assistant chat that shows each step the agent takes as it works",
      "Generates full character sheets: profile, turnaround, face and expressions",
      "Assets panel keeps characters reusable across every ad",
      "Artboards on a zoomable canvas, with move and undo",
      "Choice of image and video models, plus revision and artboard counters",
    ],
  },
  {
    n: 6, label: "Product images on the canvas",
    alt: "Canvas with ten generated product images of dog paw shoes and dogs, plus the assistant and product assets panel",
    blurb: "One request turns a product's reference photos into a full set of product page images.",
    features: [
      "Product library with an angles sheet and rebuild option",
      "The agent reads the request and asks to confirm references before generating",
      "A full set of studio, close-up and lifestyle shots with different breeds",
      "Variants are laid out side by side on the canvas for review",
    ],
  },
  {
    n: 7, label: "Video ad on the canvas",
    alt: "Canvas laying out a video ad: script options, a storyboard, shots, a storyboard sheet, keyframes, clips and the final video, beside the assistant chat and product assets",
    blurb: "Ask for a video ad and the whole production appears on the canvas, step by step.",
    features: [
      "Three script directions to choose from, then the chosen one laid out as a storyboard",
      "Shot-by-shot boards, a storyboard sheet and keyframes for every shot",
      "A clip for each shot, then the finished video",
      "The agent asks which direction to use and waits for approval before continuing",
      "Product library keeps the real product in every frame",
    ],
  },
  {
    n: 8, label: "Production board",
    alt: "Production board dialog listing finished stages: storyboard sheet, keyframes, clips, voice-over, music and final film, with shot previews below",
    blurb: "A single board tracks every stage of a video from storyboard to final film.",
    features: [
      "Stages shown in order: storyboard sheet, keyframes, how each shot is made, clips, voice-over, music and final film",
      "Each stage shows its status and what it cost to produce",
      "The final film is checked before it is marked done",
      "Shot previews with their length and how each one was made",
    ],
  },
  {
    n: 2, label: "Brand sheet",
    alt: "Brand page showing identity fields, logo and an approved brand sheet with palette, fonts and tone",
    blurb: "A brand is read from its website, then checked and approved by a person.",
    features: [
      "Identity fields: name, industry, tagline, value proposition, target audience",
      "Imagery and layout style, plus logo upload",
      "Brand sheet with palette, fonts and tone, versioned and approved",
      "A brand is only used once it is approved",
      "Shortcuts to find products and generate a campaign",
    ],
  },
  {
    n: 3, label: "Campaign ideas",
    alt: "Campaign page listing campaign goals and generated campaign ideas with concepts and key messages",
    blurb: "Pick a goal and get campaign ideas written around the brand's real products.",
    features: [
      "Goals: product launch, lead generation, awareness, engagement, thought leadership, direct sales",
      "Optional direction and product choice, or let the agent choose",
      "Idea cards, then concepts with a headline and key message",
      "Ideas are tied to named products from the brand",
    ],
  },
  {
    n: 5, label: "Insights",
    alt: "Insights page with brand analysis inputs for market research, competitors, ad results and a plan",
    blurb: "Understand a brand, its market and competitors, then plan what to make next.",
    features: [
      "Market research with sources, and competitor checks",
      "Results from your own delivered ads",
      "A plan for the near term and the months ahead",
      "A missing number is shown as a gap, never an estimate",
    ],
  },
  {
    n: 4, label: "Publish",
    alt: "Publish page with Facebook, Instagram and LinkedIn connections",
    blurb: "Connect the team's accounts; posts are prepared for manual publishing.",
    features: [
      "Facebook, Instagram and LinkedIn connections",
      "Connections are shared by everyone in the brand",
      "Posts are prepared for manual publishing and always need approval",
    ],
  },
];

function Gallery() {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState<number | null>(null);
  const openAt = (k: number) => {
    setI(k);
    ref.current?.showModal();
  };
  const go = (d: number) => setI((k) => (k === null ? k : (k + d + SHOTS.length) % SHOTS.length));
  const cur = i === null ? null : SHOTS[i];
  return (
    <>
      <div className="gallery" role="group" aria-label="Screenshots of the platform">
        {SHOTS.map((sh, k) => (
          <button key={sh.n} className="shot" onClick={() => openAt(k)} aria-label={`Open ${sh.label}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/work/s${sh.n}-full.jpg`} alt={sh.alt} loading="lazy" />
            <span>{sh.label}</span>
          </button>
        ))}
      </div>
      <p className="gallery-hint">Click a screen to open the gallery with its features.</p>
      <dialog
        ref={ref}
        className="viewer"
        aria-label="Platform gallery"
        onClose={() => setI(null)}
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        {cur && (
          <div className="vwin">
            <div className="titlebar">
              <button className="closebox" aria-label="Close gallery" onClick={() => ref.current?.close()} />
              <b>{cur.label} ({(i ?? 0) + 1}/{SHOTS.length})</b>
            </div>
            <div className="vbody">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="vimg" src={`/work/s${cur.n}-full.jpg`} alt={cur.alt} />
              <div className="vinfo">
                <h3>{cur.label}</h3>
                <p>{cur.blurb}</p>
                <ul>
                  {cur.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="vnav">
                  <button className="btn" onClick={() => go(-1)} aria-label="Previous screen">&larr; Prev</button>
                  <button className="btn" onClick={() => go(1)} aria-label="Next screen">Next &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

const CERT_IMGS = ["/certs/ibm.png", "/certs/powerbi.jpg", "/certs/python.jpg", "/certs/eda.jpg"];

type TabDef = { id: string; label: string; body: React.ReactNode };

function Tabs({ id, tabs }: { id: string; tabs: TabDef[] }) {
  const [i, setI] = useState(0);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setI((k) => (k + 1) % tabs.length);
    if (e.key === "ArrowLeft") setI((k) => (k - 1 + tabs.length) % tabs.length);
  };
  return (
    <div className="tabbed">
      <div className="tabs" role="tablist" aria-label="Sections of this window" onKeyDown={onKey}>
        {tabs.map((t, k) => (
          <button
            key={t.id}
            role="tab"
            id={`${id}-tab-${t.id}`}
            aria-selected={i === k}
            aria-controls={`${id}-panel`}
            tabIndex={i === k ? 0 : -1}
            className="tab"
            onClick={() => setI(k)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tabpanel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${tabs[i].id}`}>
        {tabs[i].body}
      </div>
    </div>
  );
}

const FEATS = [
  { t: "Conversational agent", how: "One orchestrator agent with a closed set of tools. It asks before it guesses and shows every step as a trace.", use: "You type what you want, watch each step as it happens, and undo anything you don't like." },
  { t: "Brief to delivery", how: "A staged pipeline of brief, plan, media, consistency checks, final QA and packaging, with approval gates.", use: "You watch the work move across the canvas and approve only at the points that matter." },
  { t: "Create and edit images", how: "Generate variants, then quick-edit, upscale, remove backgrounds, mask-edit or expand. Edits never overwrite.", use: "You click an image to tweak, upscale, erase or extend it, and step back to any earlier version." },
  { t: "Magic Write and layout", how: "The model writes only the copy. A deterministic layout engine places it.", use: "Headlines and offers arrive placed cleanly and ready to use, with no overlaps to fix." },
  { t: "Product accuracy", how: "Reference and angle sheets from real photos are the source of truth, with a re-render when a shot drifts.", use: "Your real product shows up in every shot, not a lookalike." },
  { t: "Quality assurance", how: "Judges for brand, brief, copy, layout and platform rules, plus a claim check and a whole-set pass for look and duplicates.", use: "You are warned before an invented claim, an off-brand image or a duplicate reaches the client." },
  { t: "Video", how: "Script directions, storyboards, keyframes, clips, voiceover, music and subtitles.", use: "You review the script and storyboard first, and redo one shot without losing the rest." },
  { t: "Brand and campaigns", how: "A brand kit built from a website address, campaign concepts from a goal, and copy adapted into many languages.", use: "You paste a website address, review the brand it builds, then pick from campaign ideas." },
  { t: "Skills", how: "Reusable one-click workflows for listing images, social ads, posters and banners, plus custom skills.", use: "You start from a one-click workflow, and save your own for next time." },
  { t: "Characters", how: "A persona becomes a reusable cast with turnarounds, expressions and wardrobe, appearance locked across ads.", use: "You describe a person once, then reuse them consistently in any ad." },
  { t: "Research and insights", how: "Market and competitor research and performance analysis, with every claim tied to a source.", use: "You can see the source behind every claim." },
  { t: "Publishing", how: "Connects Facebook, Instagram and LinkedIn. Posts are prepared for manual publishing and need approval.", use: "You connect your accounts, review a ready-to-post package, approve it, and publish." },
  { t: "Built for teams", how: "Multi-tenant accounts, a guarded operations layer, SSRF protection and an audit trail.", use: "You work in your company's own space, your data stays separate, and every action can be traced." },
];

function Features() {
  const [mode, setMode] = useState<"how" | "use">("use");
  return (
    <div>
      <div className="seg" role="group" aria-label="Feature view">
        <button className="tab" aria-pressed={mode === "use"} onClick={() => setMode("use")}>What you experience</button>
        <button className="tab" aria-pressed={mode === "how"} onClick={() => setMode("how")}>How it works</button>
      </div>
      <ul className="featgrid">
        {FEATS.map((f) => (
          <li key={f.t}>
            <h4>{f.t}</h4>
            <p>{mode === "use" ? f.use : f.how}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Win({
  id, title, children, wide, className = "",
}: { id: string; title: string; children: React.ReactNode; wide?: boolean; className?: string }) {
  const [shaded, setShaded] = useState(false);
  return (
    <div className={`win ${wide ? "wide" : ""} ${className}`} role="region" aria-labelledby={`${id}-t`}>
      <div className="titlebar">
        <button
          className="closebox"
          aria-label={shaded ? `Expand ${title}` : `Collapse ${title}`}
          aria-expanded={!shaded}
          onClick={() => setShaded((s) => !s)}
        />
        <b id={`${id}-t`}>{title}</b>
      </div>
      {!shaded && <div className="content">{children}</div>}
    </div>
  );
}

export default function Immersive() {
  const [p, setP] = useState(0);
  const [photo, setPhoto] = useState(false);
  useEffect(() => {
    const im = new window.Image();
    im.onload = () => setPhoto(true);
    im.src = "/photo.png";
  }, []);
  const onSection = useCallback((v: number) => setP(v), []);
  const active = Math.min(LAYERS.length - 1, Math.round(p));
  const pct = Math.round((p / (LAYERS.length - 1)) * 100);

  return (
    <>
      <Scene onSection={onSection} />

      <header className="menubar">
        <a className="apple" href="#top" aria-label="Top">■</a>
        <a className="who" href="#top">Tripti Mandal</a>
        <nav aria-label="Sections">
          {LAYERS.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} aria-current={i === active ? "true" : undefined}>{l.menu}</a>
          ))}
        </nav>
        <span className="status" aria-hidden="true">
          LAYER {String(active + 1).padStart(2, "0")}/{String(LAYERS.length).padStart(2, "0")} · {LAYERS[active].name.toUpperCase()}
        </span>
      </header>

      <main>
        <section id="top" data-sec className="sec">
          <Win id="w-top" title="About Tripti.txt">
            <div className="heroTop">
              <div>
                <p className="role">{profile.role}</p>
                <h1>Tripti<br />Mandal</h1>
              </div>
              {photo && (
                <img className="photo" src="/photo.png" alt="Portrait of Tripti Mandal, rendered in one-bit pixels" width={256} height={256} />
              )}
            </div>
            <p className="lede">I build LLM agent systems that run in production: tool-calling agents, context engineering, evals and guardrails.</p>
            <p className="links">
              <a className="btn" href={`mailto:${profile.email}`}>Email me</a>
              <a href={profile.github}>GitHub</a>
              <a href={profile.linkedin}>LinkedIn</a>
            </p>
            <h3>Two projects, built end to end</h3>
            <ul className="glance" aria-label="Projects">
              <li><b>Agent workspace</b>A chat-to-canvas studio where one agent turns a brief into finished ad creatives.</li>
              <li><b>Risk review queue</b>Rules and a model that flag risky checkout orders for a human to review.</li>
            </ul>
          </Win>
        </section>

        <section id="operations" data-sec className="sec">
          <Win id="w-ops" title="Seleric Systems: Platform">
            <h2>A brief in.<br />Finished creatives out.</h2>
            <p className="role">Project 1 of 2 · Built end to end</p>
            <Tabs
              id="ops"
              tabs={[
                {
                  id: "overview",
                  label: "Overview",
                  body: (
                    <>
                      <p>At {seleric.company}, I built and own this multi-tenant ad workspace end to end, from the agent and backend to the canvas interface. Several brands use it.</p>
                      <p>You chat with one orchestrator agent. It plans the work, calls its tools and shows its reasoning live on the canvas, then builds the result onto editable boards.</p>
                      <p className="meta">{seleric.client}. {seleric.title}, {seleric.dates}.</p>
                      <p className="tags">{seleric.projects[0].stack}</p>
                    </>
                  ),
                },
                { id: "features", label: "Features", body: <Features /> },
                {
                  id: "built",
                  label: "What I built",
                  body: (
                    <ul className="feat">
                      <li><b>The orchestrator agent</b> on the OpenAI Agents SDK, with a live reasoning trace and a closed set of tools.</li>
                      <li><b>A guarded operations layer</b> and a small set of facade tools in front of the whole backend.</li>
                      <li><b>Tiered image QA</b> that stops off-brand and duplicate creatives before delivery.</li>
                      <li><b>Spend tracking</b> that measures the cost of every accepted creative.</li>
                      <li><b>Multi-tenant security</b> with isolation tests that run against real services.</li>
                    </ul>
                  ),
                },
                { id: "screens", label: "Screens", body: <Gallery /> },
              ]}
            />
          </Win>
        </section>

        <section id="tools" data-sec className="sec">
          <Win id="w-tools" title="Agent.app">
            <h2>One agent,<br />guarded tools.</h2>
            <p>The hard part was letting a single agent act across the whole backend without losing control of it.</p>
            <Photo src="/img/racks.png" alt="Rows of server racks in a data center, rendered in black and white dither" credit="" />
            <Tabs
              id="agent"
              tabs={[
                { id: "diagram", label: "Diagram", body: <ArchDiagram /> },
                {
                  id: "details",
                  label: "Details",
                  body: (
                    <ul className="facts">
                      <li><b>Facade tools.</b> The backend sits behind a small set of tools with permissions, rate limits, idempotency and an audit trail, and every request is capped by a deterministic scorer.</li>
                      <li><b>Lean context.</b> Long skill playbooks became short digests, so the agent carries far less per request.</li>
                      <li><b>Tiered image QA.</b> Cheap pixel checks first, then a multi-look vision comparison, then a vote before any paid repair.</li>
                      <li><b>Tenant-safe.</b> Tenant IDs are overwritten, unknown methods fail closed, and an SSRF guard and confirm-before-spend protect the platform.</li>
                      <li><b>Measured spend.</b> Cost per accepted creative comes from the per-call audit trail.</li>
                    </ul>
                  ),
                },
              ]}
            />
          </Win>
        </section>

        <section id="queue" data-sec className="sec">
          <Win id="w-queue" title="Review Queue">
            <h2>A queue that<br />knows its limits.</h2>
            <p className="role">Project 2 of 2 · Built end to end</p>
            <p>{seleric.projects[1].name}: a review-only checkout queue for e-commerce. It is advisory, so prepaid orders are never held and no order is cancelled automatically.</p>
            <Tabs
              id="queue"
              tabs={[
                { id: "flow", label: "Flow", body: <QueueFlow /> },
                {
                  id: "report",
                  label: "Daily report",
                  body: (
                    <>
                      <a className="reportlink" href="/work/report-full.jpg" target="_blank" rel="noreferrer" aria-label="Open the daily report email at full size in a new tab">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/work/report-full.jpg" alt="Daily order risk report email with a scored-orders spreadsheet attached, summary tiles for orders, mean risk, high and medium risk orders and cash on delivery versus prepaid, and an executive summary table" loading="lazy" />
                      </a>
                      <ul className="feat">
                        <li><b>Lands in the inbox every day</b> as an email with the scored orders attached as a spreadsheet.</li>
                        <li><b>Reads at a glance.</b> Summary tiles for orders reviewed, average risk, high and medium bands, and cash on delivery versus prepaid.</li>
                        <li><b>Clear about its limits.</b> It says the percentage is queue position, not the chance of a reversal, and that it is for review ranking only: nothing is auto-cancelled, auto-blocked or auto-held.</li>
                        <li><b>Executive summary</b> table for the reporting period.</li>
                      </ul>
                    </>
                  ),
                },
                {
                  id: "built",
                  label: "What I built",
                  body: (
                    <>
                      <ul className="facts">
                        <li><b>Rules first.</b> A scenario-based rule layer sets each order&apos;s review band.</li>
                        <li><b>Dual-head model.</b> LightGBM predicts returns for prepaid orders and any reversal for cash on delivery.</li>
                        <li><b>Built to be trusted.</b> Point-in-time-safe features, matured labels and a chronological split.</li>
                        <li><b>Daily ops report.</b> Per-order SHAP factors and data-quality checks.</li>
                        <li><b>Monitored.</b> Drift, calibration and accuracy alerts in MLflow, with monthly retraining.</li>
                      </ul>
                      <p className="tags">{seleric.projects[1].stack}</p>
                    </>
                  ),
                },
                {
                  id: "lesson",
                  label: "What didn't work",
                  body: (
                    <p className="honest">Models for cash-on-delivery orders alone showed no lift over a rule baseline, so I kept them out of production and handle that risk with rule bands and a phone confirmation before dispatch.</p>
                  ),
                },
              ]}
            />
          </Win>
        </section>

        <section id="internship" data-sec className="sec">
          <Win id="w-intern" title="Relinns Technologies">
            <h2>Before that:<br />three pipelines.</h2>
            <p className="meta"><a href={relinns.url}>{relinns.company}</a> · {relinns.title} · {relinns.dates}</p>
            <Photo src="/img/board.png" alt="Close-up of a green circuit board, rendered in black and white dither" credit="" />
            <Tabs
              id="intern"
              tabs={[
                {
                  id: "sql",
                  label: "NL-to-SQL",
                  body: <p>A multi-agent text-to-SQL system that retrieves the relevant schema with FAISS, so questions about data get answered faster.</p>,
                },
                {
                  id: "sow",
                  label: "SOW generator",
                  body: (
                    <>
                      <p>A LangGraph pipeline that turns a client brief into a Statement of Work, and cut preparation time and manual revisions.</p>
                      <SowPipeline />
                    </>
                  ),
                },
                {
                  id: "voice",
                  label: "Voice agent",
                  body: <p>A real-time voice agent pilot on Twilio, OpenAI and WebRTC that keeps context through a call, so callers repeat themselves less.</p>,
                },
              ]}
            />
          </Win>
        </section>

        <section id="foundations" data-sec className="sec">
          <div className="stack">
            <Win id="w-skills" title="Skills.db">
              {skills.map((s) => (
                <p key={s.group} className="sk"><b>{s.group}</b>{s.items.join(" · ")}</p>
              ))}
            </Win>
            <Win id="w-edu" title="Education & Research">
              <Tabs
                id="edu"
                tabs={[
                  {
                    id: "edu",
                    label: "Education",
                    body: <p className="sk"><b>{education.degree}</b>{education.school}, {education.place}. {education.dates}.</p>,
                  },
                  {
                    id: "research",
                    label: "Research",
                    body: (
                      <>
                        <p className="sk"><b><a href={publication.url}>{publication.title}</a></b>{publication.venue}, {publication.date}. A hybrid CNN and Random Forest model for multiclass cotton disease diagnosis.</p>
                        <PaperDiagram />
                      </>
                    ),
                  },
                  {
                    id: "certs",
                    label: "Certifications",
                    body: (
                      <ul className="certgrid">
                        {certifications.map((c, k) => (
                          <li key={c.name}>
                            <a href={c.url} target="_blank" rel="noreferrer" aria-label={`${c.name}, ${c.issuer}. Opens the credential in a new tab`}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={CERT_IMGS[k]} alt={`${c.name} certificate`} loading="lazy" />
                              <span><b>{c.name}</b>{c.issuer}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ]}
              />
            </Win>
          </div>
        </section>

        <section id="contact" data-sec className="sec end">
          <Win id="w-contact" title="New Message">
            <h2>Let&apos;s build something that holds up.</h2>
            <p className="links big"><a className="btn" href={`mailto:${profile.email}`}>{profile.email}</a></p>
            <p className="links">
              <a href={profile.linkedin}>LinkedIn</a>
              <a href={profile.github}>GitHub</a>
            </p>
          </Win>
        </section>
      </main>
    </>
  );
}
