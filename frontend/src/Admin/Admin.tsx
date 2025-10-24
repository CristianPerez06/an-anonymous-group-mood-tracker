import { useState } from "react";

interface AdminProps {}

const Admin = ({}: AdminProps) => {
  const [status, setStatus] = useState("");
  const [groupCreated, setGroupCreated] = useState(false);
  const [groupName, setGroupName] = useState("default");
  const [lastCreatedGroup, setLastCreatedGroup] = useState("");

  const API = "http://localhost:4000";

  async function createGroup() {
    if (!groupName.trim()) {
      setStatus("Please enter a group name");
      return;
    }

    setStatus("Creating group…");
    try {
      const res: Response = await fetch(`${API}/group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: groupName, depth: 20 }),
      });
      const data = await res.json();
      if (res.ok) {
        setGroupCreated(true);
        setLastCreatedGroup(groupName);
        setStatus(
          `Group "${groupName}" created ✅ id=${data.id}, size=${data.size}`
        );
      } else {
        setStatus(`Group creation failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setStatus(
        `Group creation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Admin Dashboard</h1>
      <p>Admin can create groups for users to join.</p>

      <div>
        <input
          type="text"
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
            if (groupCreated) {
              setGroupCreated(false);
            }
            setStatus("");
          }}
          placeholder="Enter group name"
          style={{ padding: 8, marginRight: 8, border: "1px solid #ccc" }}
        />
        <button onClick={createGroup}>Create group</button>
      </div>

      {groupCreated && (
        <p>Group "{lastCreatedGroup}" created successfully ✅</p>
      )}

      <p>{status}</p>
    </div>
  );
};

export default Admin;
