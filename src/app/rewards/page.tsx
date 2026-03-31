"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RewardsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-text-dim">Account</span>
            <h1 className="text-3xl font-bold mt-2 tracking-tight">My Rewards</h1>
          </div>

          {/* Connect wallet prompt */}
          <div className="border border-border rounded-lg p-16 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-lg bg-bg-surface-2 border border-border flex items-center justify-center mx-auto mb-6">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="6" width="16" height="12" rx="2" stroke="#4e4e62" strokeWidth="1.5"/>
                  <path d="M14 12h.01" stroke="#4e4e62" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#4e4e62" strokeWidth="1.5"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">Connect your wallet</h2>
              <p className="text-text-muted text-sm mb-6">
                Connect your wallet to view your mining rewards, claim $ocDATA tokens, and track your epoch history.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-bg bg-text rounded-lg hover:bg-text-muted transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>

          {/* Preview of what they'll see */}
          <div className="mt-10 opacity-40 pointer-events-none select-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden mb-8">
              {[
                { label: "Total Earned", value: "—" },
                { label: "Claimable", value: "—" },
                { label: "Claimed", value: "—" },
              ].map((s) => (
                <div key={s.label} className="bg-bg-surface p-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-2">{s.label}</div>
                  <div className="font-mono text-2xl font-semibold">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-surface flex items-center justify-between">
                <h2 className="text-sm font-semibold">Reward History</h2>
                <button className="px-4 py-1.5 text-xs font-semibold text-bg bg-text rounded-lg" disabled>
                  Claim All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs font-mono uppercase tracking-wider text-text-dim">
                      <th className="text-left px-6 py-3">Epoch</th>
                      <th className="text-left px-4 py-3">Role</th>
                      <th className="text-right px-4 py-3">Score</th>
                      <th className="text-right px-4 py-3">Reward</th>
                      <th className="text-center px-4 py-3">Status</th>
                      <th className="text-right px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {[142, 141, 140].map((ep) => (
                      <tr key={ep}>
                        <td className="px-6 py-3 font-mono tabular-nums">#{ep}</td>
                        <td className="px-4 py-3 text-xs text-text-muted">—</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">—</td>
                        <td className="px-4 py-3 font-mono text-xs tabular-nums text-right">—</td>
                        <td className="px-4 py-3 text-center text-xs text-text-dim">—</td>
                        <td className="px-6 py-3 text-right text-xs text-text-dim">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
