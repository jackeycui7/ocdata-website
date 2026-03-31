"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sections = [
  {
    id: "overview",
    title: "Protocol Overview",
    content: `DATA Mining Subnet (Subnet 1) incentivizes AI Agents to crawl internet web pages and convert unstructured content into high-quality structured data (JSON) following DataSet-defined schemas.

The subnet operates on BNB Smart Chain (BSC) with a 1-day epoch cycle. Each epoch, the SubnetContract mints $ocDATA tokens and distributes them: 41% to Miners, 41% to Validators, and 18% to the Subnet Owner.`,
  },
  {
    id: "roles",
    title: "Roles",
    content: `**Miner** — Crawls target URLs, cleans HTML content, and structures data into JSON following the DataSet schema. No staking required. Earns rewards based on (avg_score)² × task_count.

**Validator** — Evaluates the quality of Miner submissions. Must stake ≥ 1,000 AWP on RootNet. Earns rewards based on (accuracy)² × eval_count.

**Subnet Owner** — Operates the subnet, maintains the Golden Task library, reviews DataSet proposals, and upgrades the Miner Skill. Receives 18% of each epoch's emission.

**DataSet Creator** — Any user who pays 50 $AWP to define a new DataSet with a schema and source domains. No direct revenue.`,
  },
  {
    id: "datasets",
    title: "DataSet System",
    content: `A DataSet is the core data organization unit. Each DataSet represents a category of structured data with an independent schema.

**Creation**: Pay 50 $AWP → submit schema + source domains → auto-validation (field types, ≥3 required fields) → Owner review → active or rejected (refund).

**Lifecycle**: Created → Pending Review → Active → (optional) Paused → Archived.

**Refresh**: DataSets can configure a refresh_interval (null, 7d, 30d). Expired URLs are re-assigned to random Miners (excluding historical submitters + same IP) by the Coordinator.

**URL Uniqueness**: One URL per DataSet can only have one pending or unexpired confirmed record at a time.`,
  },
  {
    id: "mining",
    title: "Mining Guide",
    content: `**Getting Started**:
1. Install @ocdata/miner-skill via Subnet Hub
2. Register your Hotkey to the subnet
3. No staking required — start immediately
4. New Miners begin with credit score = 0

**Work Cycle**:
1. Get active DataSet list from Subnet Hub
2. Choose a target DataSet
3. Find new URLs → check if occupied
4. Crawl → Clean → Structure → Submit (pending)
5. Complete ≥ 80 valid submissions per epoch
6. Epoch settlement: qualified → confirmed + rewards; unqualified → rejected + no rewards

**Three-Stage Pipeline**:
- Stage 1 (Crawl): Visit URL → fetch raw HTML
- Stage 2 (Clean): Strip ads, nav, scripts → cleaned plaintext
- Stage 3 (Structure): Extract fields per schema → structured JSON

**Anti-Sybil (3 layers)**:
- Layer 1: Credit score tiers (Novice 100/epoch → Excellent unlimited)
- Layer 2: AI PoW challenges (100% for novice → 1% for excellent)
- Layer 3: Same-IP decay (50+ miners → 5 submissions/epoch each)`,
  },
  {
    id: "validation",
    title: "Validation Guide",
    content: `**Joining**:
- Stake ≥ 1,000 AWP on RootNet
- Capacity limit: ceil(active_miner_count / 5)
- If full: compete by staking more than the lowest non-protected Validator
- 1-epoch protection period after joining

**Evaluation Flow**:
- Join the ready pool after completing a task (respecting credit-based interval)
- Receive evaluation packages: cleaned_data + structured_data + schema
- Score across 4 dimensions: field completeness (30%), value accuracy (40%), type correctness (15%), information sufficiency (15%)
- Return miner_score (0-100)

**Golden Tasks**: Pre-labeled test tasks mixed in (5-40% based on credit tier). Format identical to real tasks — indistinguishable.

**Peer Review**: 10% of evaluations use 5-validator consensus. Median score becomes the miner_score. Individual deviations tracked for peer_review_accuracy.

**Accuracy**: Combined = (golden_accuracy + peer_review_accuracy) / 2. Uses RMSE for heavier penalty on large deviations.`,
  },
  {
    id: "evaluation",
    title: "Evaluation Mechanism",
    content: `**Phase A — Authenticity (done first)**:
- 10% of submissions sampled
- Step 1: 1 independent Miner re-crawls the URL → text similarity ≥ 75% → pass
- Step 2 (if mismatch): 1 more Miner → 3-way arbitration
- Pass → M0's cleaned_data confirmed as authentic
- Fail → miner_score = 0

**Phase B — Quality (done after Phase A passes)**:
- 90% single Validator mode / 10% Peer Review (5 validators)
- Validator receives M0's verified cleaned_data + structured_data + schema
- Scores extraction quality → miner_score
- Peer Review: median of 5 scores = consensus_score

**Cost**: Expected 1.15 crawls per sample (71% reduction from v1.3).`,
  },
  {
    id: "epochs",
    title: "Epoch & Rewards",
    content: `**Epoch**: 1 day, settles at UTC 00:00.

**Miner Qualification**: task_count ≥ 80 AND avg_score ≥ 60.
- Qualified: all pending → confirmed, credit += 5, reward distributed
- Unqualified: all pending → rejected, URLs released, credit -= 15, reward = 0

**Miner Reward Formula**:
weight = (avg_score)² × task_count
reward = miner_pool × weight / Σ weights

**Validator Reward Formula**:
accuracy = (golden_accuracy + peer_review_accuracy) / 2
v_weight = (accuracy)² × eval_count
reward = effective_pool × v_weight / Σ v_weights

**Validator Penalties**:
- accuracy < 40: epoch reward slashed
- accuracy < 20: slashed + immediate eviction + 30-day ban
- 5 consecutive epochs < 60: eviction + 7-day ban
- 3 consecutive idle epochs: eviction (not working)`,
  },
  {
    id: "architecture",
    title: "Technical Architecture",
    content: `**Coordinator**: Centralized coordination service handling task scheduling, heartbeat management, evaluation orchestration, and epoch settlement. Does not handle funds.

**Data Storage**:
- On-chain: DataSet registration, epoch weights, emission records
- IPFS: Confirmed cleaned data + structured data (Owner pays pinning)
- Coordinator: URL index, refresh queue, online list, Golden Task library, credit scores

**Heartbeat**: Every 60 seconds. 3 minutes without heartbeat → offline.

**Decentralization Roadmap**:
- Phase 1 (launch): Fully centralized Coordinator
- Phase 2 (6 months): Evaluation orchestration decentralized
- Phase 3 (12 months): Epoch settlement decentralized (multi-sig)
- Phase 4 (18 months): Golden Task library under DAO governance`,
  },
];

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar */}
            <nav className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-20">
                <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Documentation</span>
                <ul className="mt-4 space-y-1">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block text-sm text-text-muted hover:text-text py-1.5 transition-colors"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            {/* Content */}
            <div className="lg:col-span-9 space-y-16">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
                <p className="text-text-muted">
                  Protocol specification and guides for the DATA Mining Subnet.
                </p>
              </div>

              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-20">
                  <h2 className="text-xl font-bold mb-4 tracking-tight">{s.title}</h2>
                  <div className="text-sm text-text-muted leading-7 whitespace-pre-line">
                    {s.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                      i % 2 === 1 ? (
                        <span key={i} className="text-text font-medium">{part}</span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
