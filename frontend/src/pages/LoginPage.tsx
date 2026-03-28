/**
 * LoginPage
 *
 * Connects the LoginForm to the useAuth hook.
 * Redirects to /dashboard after a successful login.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, skip the login page
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main style={{ maxWidth: 400, margin: "100px auto", padding: "0 16px" }}>
      <LoginForm onSubmit={login} isLoading={isLoading} error={error} />
    </main>
  );
}
