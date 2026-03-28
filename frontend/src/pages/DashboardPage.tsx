/**
 * DashboardPage — protected route
 *
 * Fetches the current user from /api/me and displays their name.
 * Redirects to / (home) if there is no token or the token is rejected.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, UserResponse } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    getMe(token)
      .then(setUser)
      .catch(() => {
        logout();
        navigate("/", { replace: true });
      })
      .finally(() => setIsLoading(false));
  }, [token, navigate, logout]);

  if (isLoading) {
    return <p>Loading…</p>;
  }

  return (
    <main style={{ maxWidth: 600, margin: "100px auto", padding: "0 16px" }}>
      <h1>Dashboard</h1>
      {user && (
        <p data-testid="welcome-message">
          Welcome, <strong>{user.full_name}</strong>!
        </p>
      )}
      <button onClick={logout} data-testid="logout-button">
        Log out
      </button>
    </main>
  );
}
