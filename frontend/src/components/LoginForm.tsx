/**
 * LoginForm component
 *
 */

import { useState, FormEvent } from "react";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(username, password);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Login form">
      <h1>Sign in</h1>

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          disabled={isLoading}
          data-testid="username-input"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          disabled={isLoading}
          data-testid="password-input"
        />
      </div>

      <button type="submit" disabled={isLoading} data-testid="submit-button">
        {isLoading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
