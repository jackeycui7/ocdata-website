"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type FieldDef = { name: string; type: string; required: boolean };

const FIELD_TYPES = ["string", "integer", "number", "boolean", "datetime", "string[]"];
const REFRESH_OPTIONS = [
  { value: "", label: "None" },
  { value: "1d", label: "Every day" },
  { value: "7d", label: "Every 7 days" },
  { value: "30d", label: "Every 30 days" },
];

export default function CreateDatasetPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [domains, setDomains] = useState<string[]>([""]);
  const [refresh, setRefresh] = useState("");
  const [fields, setFields] = useState<FieldDef[]>([
    { name: "", type: "string", required: true },
    { name: "", type: "string", required: true },
    { name: "", type: "string", required: true },
  ]);

  const requiredCount = fields.filter((f) => f.required && f.name.trim()).length;
  const validFields = fields.filter((f) => f.name.trim());

  const schemaJson = Object.fromEntries(
    validFields.map((f) => [f.name, { type: f.type, required: f.required }])
  );

  const canNext1 = name.trim() && domains.some((d) => d.trim());
  const canNext2 = validFields.length >= 3 && requiredCount >= 3;

  function addDomain() { setDomains([...domains, ""]); }
  function removeDomain(i: number) { setDomains(domains.filter((_, idx) => idx !== i)); }
  function updateDomain(i: number, v: string) { const d = [...domains]; d[i] = v; setDomains(d); }

  function addField() { setFields([...fields, { name: "", type: "string", required: false }]); }
  function removeField(i: number) { setFields(fields.filter((_, idx) => idx !== i)); }
  function updateField(i: number, patch: Partial<FieldDef>) {
    const f = [...fields]; f[i] = { ...f[i], ...patch }; setFields(f);
  }

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create DataSet</h1>
          <p className="text-text-muted text-sm mb-8">Define a new structured dataset for miners to crawl.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold border transition-colors ${
                  step >= s ? "bg-accent border-accent text-white" : "border-border text-text-dim"
                }`}>{s}</div>
                <span className={`text-xs font-mono ${step >= s ? "text-text" : "text-text-dim"}`}>
                  {s === 1 ? "Basic Info" : s === 2 ? "Schema" : "Review"}
                </span>
                {s < 3 && <div className={`w-12 h-px ${step > s ? "bg-accent" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-dim mb-2">DataSet Name</label>
                <input
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. LinkedIn Profiles"
                  className="w-full bg-bg-surface border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-dim mb-2">Description</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  rows={3} placeholder="What data will miners collect?"
                  className="w-full bg-bg-surface border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-dim mb-2">Source Domains</label>
                <div className="space-y-2">
                  {domains.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={d} onChange={(e) => updateDomain(i, e.target.value)}
                        placeholder="e.g. linkedin.com"
                        className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
                      />
                      {domains.length > 1 && (
                        <button onClick={() => removeDomain(i)} className="px-3 text-text-dim hover:text-danger transition-colors text-sm">✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addDomain} className="mt-2 text-xs text-accent hover:text-accent-light transition-colors">+ Add domain</button>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-dim mb-2">Refresh Interval</label>
                <select
                  value={refresh} onChange={(e) => setRefresh(e.target.value)}
                  className="bg-bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
                >
                  {REFRESH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  disabled={!canNext1} onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-accent to-cyan text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >Next: Schema</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">Fields</div>
                  <div className="space-y-2">
                    {fields.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-bg-surface border border-border rounded-lg p-2.5">
                        <input
                          value={f.name} onChange={(e) => updateField(i, { name: e.target.value })}
                          placeholder="field_name"
                          className="flex-1 bg-transparent text-sm font-mono focus:outline-none min-w-0"
                        />
                        <select
                          value={f.type} onChange={(e) => updateField(i, { type: e.target.value })}
                          className="bg-bg-elevated border border-border rounded px-2 py-1 text-xs font-mono focus:outline-none"
                        >
                          {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <label className="flex items-center gap-1 text-xs text-text-dim cursor-pointer shrink-0">
                          <input
                            type="checkbox" checked={f.required}
                            onChange={(e) => updateField(i, { required: e.target.checked })}
                            className="accent-accent"
                          />
                          Req
                        </label>
                        {fields.length > 3 && (
                          <button onClick={() => removeField(i)} className="text-text-dim hover:text-danger transition-colors text-sm px-1">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={addField} className="mt-2 text-xs text-accent hover:text-accent-light transition-colors">+ Add field</button>
                  {requiredCount < 3 && (
                    <p className="mt-2 text-xs text-warn">At least 3 required fields needed ({requiredCount}/3)</p>
                  )}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-3">JSON Preview</div>
                  <pre className="bg-bg-surface border border-border rounded-lg p-4 text-xs font-mono text-text-muted overflow-auto max-h-[400px]">
                    {JSON.stringify(schemaJson, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-border hover:border-accent transition-colors">Back</button>
                <button
                  disabled={!canNext2} onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-accent to-cyan text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >Next: Review</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border border-border rounded-lg divide-y divide-border">
                <div className="px-6 py-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-1">Name</div>
                  <div className="text-sm font-medium">{name}</div>
                </div>
                {description && (
                  <div className="px-6 py-4">
                    <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-1">Description</div>
                    <div className="text-sm text-text-muted">{description}</div>
                  </div>
                )}
                <div className="px-6 py-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-1">Domains</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {domains.filter((d) => d.trim()).map((d) => (
                      <span key={d} className="px-2 py-0.5 bg-bg-elevated border border-border rounded text-xs font-mono">{d}</span>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-1">Refresh</div>
                  <div className="text-sm">{refresh || "None"}</div>
                </div>
                <div className="px-6 py-4">
                  <div className="text-xs font-mono uppercase tracking-wider text-text-dim mb-1">Schema ({validFields.length} fields)</div>
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs font-mono text-text-dim">
                          <th className="text-left py-1 pr-4">Field</th>
                          <th className="text-left py-1 pr-4">Type</th>
                          <th className="text-left py-1">Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validFields.map((f) => (
                          <tr key={f.name} className="border-t border-border-subtle">
                            <td className="py-1.5 pr-4 font-mono text-xs">{f.name}</td>
                            <td className="py-1.5 pr-4 font-mono text-xs text-text-muted">{f.type}</td>
                            <td className="py-1.5 text-xs">{f.required ? <span className="text-accent">Yes</span> : <span className="text-text-dim">No</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-bg-surface border border-warn/20 rounded-lg p-4 flex items-start gap-3">
                <span className="text-warn text-lg">⚠</span>
                <div className="text-sm text-text-muted">
                  Creating a DataSet costs <span className="font-mono font-medium text-text">50 $AWP</span>. The fee is charged upon approval; rejected submissions are refunded.
                  <span className="block mt-1 text-xs text-text-dim">Wallet connection required to submit.</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-border hover:border-accent transition-colors">Back</button>
                <button
                  disabled
                  className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-accent to-cyan text-white disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Connect wallet to submit"
                >Connect Wallet to Submit</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
