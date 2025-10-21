import { useState, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";
import type {
  RootResponse,
  WitnessResponse,
  JoinResponse,
  MoodResponse,
} from "@app/shared";

const API = "http://localhost:4000";

export default function App() {
  const [id, setId] = useState<Identity>();
  const [index, setIndex] = useState<number>();
  const [mood, setMood] = useState("happy");
  const [scope, setScope] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("");

  async function join() {
    if (!id) return;
    setStatus("Joining…");
    const res: Response = await fetch(`${API}/groups/default/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commitment: id.commitment }),
    });
    const j: JoinResponse = await res.json();
    if (res.ok) {
      setIndex(j.index);
      setStatus(`Joined ✅ index=${j.index}`);
    } else setStatus(`Join failed: ${j.error}`);
  }

  async function submit() {
    debugger;
    if (!id || index == null) return;

    setStatus("Generating proof…");

    // Get the current root from the API
    const rootRes: Response = await fetch(`${API}/groups/default/root`);
    const rootData: RootResponse = await rootRes.json();
    const { root }: { root: string } = rootData;

    // Get the witness for your specific index
    const witnessRes: Response = await fetch(
      `${API}/groups/default/witness/${index}`
    );
    const witness: WitnessResponse = await witnessRes.json();

    if (witness.error) {
      setStatus(`Failed to get witness: ${witness.error}`);
      return;
    }

    // Generate proof with the witness data
    const proof: any = await generateProof(id, witness as any, mood, scope);

    // Set the merkle root from the API
    const publicSignals: { merkleRoot: string } = { merkleRoot: root };

    const r: Response = await fetch(`${API}/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof, publicSignals, rawMessage: mood }),
    });
    const j: MoodResponse = await r.json();

    setStatus(r.ok ? "Submitted ✅" : `Rejected: ${j.error}`);
  }

  useEffect(() => {
    let stored = localStorage.getItem("id-export");
    let identity = stored ? new Identity(stored) : new Identity();
    if (!stored) localStorage.setItem("id-export", identity.toString());
    setId(identity);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Semaphore Mood Tracker</h1>
      <p>
        {id
          ? id.commitment.toString().slice(0, 18) + "…"
          : "Creating identity…"}
      </p>

      <button onClick={join}>Join group</button>
      <select value={mood} onChange={(e) => setMood(e.target.value)}>
        <option value="happy">happy</option>
        <option value="neutral">neutral</option>
        <option value="sad">sad</option>
      </select>
      <input value={scope} onChange={(e) => setScope(e.target.value)} />
      <button onClick={submit}>Submit mood</button>

      <p>{status}</p>
    </div>
  );
}
