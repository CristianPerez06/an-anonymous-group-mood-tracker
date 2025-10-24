import { useState, useEffect } from "react";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof, type SemaphoreProof } from "@semaphore-protocol/proof";
import type {
  RootResponse,
  WitnessResponse,
  JoinResponse,
  MoodResponse,
} from "@app/shared";

interface UserProps {}

const User = ({}: UserProps) => {
  const [id, setId] = useState<Identity>();
  const [index, setIndex] = useState<number>();
  const [mood, setMood] = useState("happy");
  const [scope, setScope] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const API = "http://localhost:4000";

  const loadGroups = async () => {
    try {
      const res = await fetch(`${API}/group`);
      const data = await res.json();
      if (res.ok) {
        setGroups(data);
        if (data.length > 0 && !selectedGroup) {
          setSelectedGroup(data[0].id);
        }
      } else {
        setStatus(`Failed to load groups: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setStatus(
        `Failed to load groups: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  async function join() {
    if (!id || !selectedGroup) return;
    setStatus("Joining…");
    try {
      const res: Response = await fetch(
        `${API}/group/${selectedGroup}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commitment: id.commitment.toString() }),
        }
      );
      const j: JoinResponse = await res.json();
      if (res.ok) {
        setIndex(j.index);
        setStatus(`Joined ✅ index=${j.index}`);
      } else {
        setStatus(`Join failed: ${j.error}`);
      }
    } catch (error) {
      setStatus(
        `Join failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async function submit() {
    if (!id) {
      setStatus("Please wait for identity to be created");
      return;
    }
    if (!selectedGroup) {
      setStatus("Please select a group first");
      return;
    }
    if (index == null) {
      setStatus("Please join a group first");
      return;
    }

    setStatus("Generating proof…");

    // Get the current root from the API
    const rootRes: Response = await fetch(`${API}/group/${selectedGroup}/root`);
    const rootData: RootResponse = await rootRes.json();
    const { root: merkleRoot } = rootData;

    // Get the witness for your specific index
    const witnessRes: Response = await fetch(
      `${API}/group/${selectedGroup}/witness/${index}`
    );
    const witness: WitnessResponse = await witnessRes.json();

    if (witness.error) {
      setStatus(`Failed to get witness: ${witness.error}`);
      return;
    }

    // Generate proof with the witness data
    const proofData: SemaphoreProof = await generateProof(
      id,
      witness as any,
      mood,
      scope
    );

    // Extract the proof array and public signals
    const proof = proofData.points; // The proof array
    const publicSignals = {
      merkleRoot,
      nullifier: proofData.nullifier,
      message: proofData.message,
      scope: proofData.scope,
    };

    const r: Response = await fetch(`${API}/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof, publicSignals, rawMessage: mood }),
    });
    const j: MoodResponse = await r.json();

    console.log(j);
    setStatus(r.ok ? "Submitted ✅" : `Rejected`);
  }

  useEffect(() => {
    let stored = localStorage.getItem("id-export");
    let identity = stored ? new Identity(stored) : new Identity();
    if (!stored) localStorage.setItem("id-export", identity.toString());
    setId(identity);
    loadGroups();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Semaphore Mood Tracker</h1>
      <p>
        {id
          ? id.commitment.toString().slice(0, 18) + "…"
          : "Creating identity…"}
      </p>

      <div>
        {groups.length > 0 ? (
          <>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{ marginRight: 8, padding: 8 }}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.id} (Size: {group.size})
                </option>
              ))}
            </select>
            <button onClick={join} style={{ marginRight: 8 }}>
              Join group
            </button>
          </>
        ) : (
          <p style={{ marginRight: 8, display: "inline" }}>
            No groups available. Ask an admin to create a group first.
          </p>
        )}
        <button onClick={loadGroups}>Refresh groups</button>
      </div>

      <div>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{ marginRight: 8 }}
        >
          <option value="happy">happy</option>
          <option value="neutral">neutral</option>
          <option value="sad">sad</option>
        </select>
        <input
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button
          onClick={submit}
          disabled={!id || !selectedGroup || index == null}
          style={{
            opacity: !id || !selectedGroup || index == null ? 0.5 : 1,
            cursor:
              !id || !selectedGroup || index == null
                ? "not-allowed"
                : "pointer",
          }}
        >
          Submit mood
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 8,
          backgroundColor: "#f0f0f0",
          borderRadius: 4,
          color: "#333",
        }}
      >
        <p>
          <strong>Status:</strong>
        </p>
        <p>Identity: {id ? "✅ Created" : "⏳ Creating..."}</p>
        <p>
          Group:{" "}
          {selectedGroup
            ? `✅ Selected: ${selectedGroup}`
            : "❌ No group selected"}
        </p>
        <p>
          Joined:{" "}
          {index != null
            ? `✅ Joined ${selectedGroup} (index: ${index})`
            : "❌ Not joined"}
        </p>
        <p>
          Ready to submit:{" "}
          {id && selectedGroup && index != null ? "✅ Yes" : "❌ No"}
        </p>
      </div>

      <p>{status}</p>
    </div>
  );
};

export default User;
