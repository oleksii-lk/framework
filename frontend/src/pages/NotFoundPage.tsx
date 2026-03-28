/**
 * NotFoundPage — rendered for any route that doesn't match.
 */

import { Link, useLocation } from "react-router-dom";

export function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <main style={{ maxWidth: 600, margin: "100px auto", padding: "0 16px" }}>
      <h1 data-testid="not-found-heading">404 — Page not found</h1>
      <p>
        <code>{pathname}</code> does not exist.
      </p>
      <Link to="/" data-testid="go-home-link">
        ← Go to home
      </Link>
    </main>
  );
}
