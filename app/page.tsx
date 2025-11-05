"use client";

import { FormEvent, useMemo, useState } from "react";

type AgentRun = {
  role: "system" | "planner" | "actor" | "critic" | "terminator";
  content: string;
  step: number;
};

type AgentResult = {
  transcript: AgentRun[];
  outcome: string;
  completed: boolean;
};

const placeholderPrompts = [
  "Design a morning routine that balances focus and rest.",
  "Plan a product launch checklist for a new AI feature.",
  "Devise a weekly learning schedule for mastering TypeScript.",
  "Draft a social media strategy for showcasing an open-source project."
];

export default function Page() {
  const [goal, setGoal] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentResult | null>(null);

  const placeholder = useMemo(
    () => placeholderPrompts[Math.floor(Math.random() * placeholderPrompts.length)],
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (working) return;
    const trimmedGoal = goal.trim() || placeholder;
    setWorking(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: trimmedGoal })
      });
      if (!response.ok) {
        throw new Error(`Agent run failed with status ${response.status}`);
      }
      const payload = (await response.json()) as AgentResult;
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Agent run failed.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <header>
          <h1 className="title">Self-Calling AI Agent</h1>
          <p className="subtitle">
            Autonomous problem solver that loops through planner, actor, critic, and terminator personas.
            Provide a goal, then watch the agent coordinate with itself to converge on the best outcome.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="controls" aria-label="Agent goal form">
          <input
            className="promptInput"
            name="goal"
            placeholder={placeholder}
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            disabled={working}
            aria-label="Goal prompt"
          />
          <button className="primaryButton" type="submit" disabled={working}>
            {working ? "Running..." : "Launch Agent"}
          </button>
        </form>

        <section className="grid" aria-live="polite">
          <div className="panel">
            <div className="logHeader">
              <h3>Agent Transcript</h3>
              <span>{result?.transcript.length ?? 0} turns</span>
            </div>
            <div className="transcript">
              {(result?.transcript ?? []).map((entry) => (
                <article key={`${entry.role}-${entry.step}`} className="entry">
                  <header className="entryHeader">
                    <span className="entryRole">{entry.role}</span>
                    <span>Step {entry.step}</span>
                  </header>
                  <div className="entryBody">{entry.content}</div>
                </article>
              ))}
              {working && (
                <article className="entry">
                  <header className="entryHeader">
                    <span className="entryRole">agent</span>
                    <span>processing…</span>
                  </header>
                  <div className="entryBody">Spinning up self-referential loop…</div>
                </article>
              )}
              {!working && (result?.transcript?.length ?? 0) === 0 && (
                <article className="entry">
                  <header className="entryHeader">
                    <span className="entryRole">system</span>
                    <span>ready</span>
                  </header>
                  <div className="entryBody">
                    Submit a prompt to watch the self-calling agent reason, act, and critique in real time.
                  </div>
                </article>
              )}
            </div>
          </div>
          <div className="panel">
            <h3>Run Summary</h3>
            {result ? (
              <>
                <p>{result.outcome}</p>
                <p>Completed: {result.completed ? "Yes" : "No (max depth reached)"}</p>
              </>
            ) : (
              <p>
                The agent orchestrates multiple specialist personas to break down goals, execute plans, and
                self-critique until it converges or reaches the safety limit.
              </p>
            )}
            <h3>Personas</h3>
            <ul>
              <li>
                <strong>Planner</strong>: decomposes objectives and requests execution from the actor.
              </li>
              <li>
                <strong>Actor</strong>: performs concrete steps and synthesizes partial results.
              </li>
              <li>
                <strong>Critic</strong>: audits outcomes, flags gaps, and queues follow-up plans.
              </li>
              <li>
                <strong>Terminator</strong>: decides when the loop can stop safely.
              </li>
            </ul>
          </div>
        </section>

        {result?.completed && (
          <div className="statusBanner">Agent satisfied with outcome ✅</div>
        )}
        {error && <div className="statusBanner error">{error}</div>}
      </div>
    </div>
  );
}
