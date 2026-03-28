/**
 * HomePage — public landing page, no authentication required
 */

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main style={{ maxWidth: 600, margin: "100px auto", padding: "0 16px" }}>
      <h1>Auth Testing Lab</h1>
      <p>A learning project for unit, integration, and e2e testing.</p>

      {isAuthenticated ? (
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to="/dashboard" data-testid="go-to-dashboard-link">
            Go to dashboard →
          </Link>
          <button onClick={logout} data-testid="home-logout-button">
            Log out
          </button>
        </div>
      ) : (
        <Link to="/login" data-testid="go-to-login-link">
          Sign in →
        </Link>
      )}
    </main>
  );
}
