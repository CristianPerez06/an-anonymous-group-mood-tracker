import { Link } from "react-router-dom";

interface HomeProps {}

const Home = ({}: HomeProps) => {
  return (
    <div style={{ padding: 24, textAlign: "center", color: "#333" }}>
      <h1 style={{ color: "#333" }}>Anonymous Group Mood Tracker</h1>
      <p style={{ fontSize: 18, marginBottom: 32 }}>
        Welcome to the Anonymous Group Mood Tracker. Choose your role to get
        started.
      </p>

      <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
        <Link
          to="/admin"
          style={{
            padding: "16px 32px",
            backgroundColor: "#dc3545",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Admin Dashboard
        </Link>

        <Link
          to="/user"
          style={{
            padding: "16px 32px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          User Dashboard
        </Link>
      </div>

      <div
        style={{
          marginTop: 48,
          textAlign: "left",
          maxWidth: 600,
          margin: "48px auto 0",
        }}
      >
        <h2 style={{ color: "#333" }}>Role Permissions</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginTop: 24,
          }}
        >
          <div
            style={{
              border: "1px solid #dc3545",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#fff5f5",
            }}
          >
            <h3 style={{ color: "#dc3545", marginTop: 0 }}>Admin</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Create and manage groups</li>
              <li>View group details and statistics</li>
              <li>Monitor mood data and aggregates</li>
              <li>Access advanced analytics</li>
            </ul>
            <div
              style={{
                marginTop: 12,
                padding: 8,
                backgroundColor: "#ffe6e6",
                borderRadius: 4,
              }}
            >
              <strong>Cannot:</strong> Enroll in groups or send mood signals
            </div>
          </div>

          <div
            style={{
              border: "1px solid #007bff",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#f0f8ff",
            }}
          >
            <h3 style={{ color: "#007bff", marginTop: 0 }}>User</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>Join existing groups</li>
              <li>Send anonymous mood signals</li>
              <li>View basic mood data</li>
            </ul>
            <div
              style={{
                marginTop: 12,
                padding: 8,
                backgroundColor: "#e6f3ff",
                borderRadius: 4,
              }}
            >
              <strong>Cannot:</strong> Create groups, access admin functions, or
              advanced analytics
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            padding: 16,
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
          }}
        >
          <h3 style={{ color: "#333" }}>About This Application</h3>
          <p>
            This is an anonymous group mood tracking application built with
            Semaphore protocol. Users can anonymously submit their mood without
            revealing their identity, while maintaining privacy through
            zero-knowledge proofs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
