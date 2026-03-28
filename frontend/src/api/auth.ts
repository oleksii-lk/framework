/**
 * API client for authentication endpoints.
 *
 * Keeping API calls in a dedicated module makes them easy to mock in tests,
 * and separates the "how to talk to the server" concern from UI logic.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  username: string;
  full_name: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * POST /api/login
 * Sends username + password as json body
 * Returns the JWT on success, throws ApiError on failure.
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.detail ?? "Login failed");
  }

  return response.json() as Promise<LoginResponse>;
}

/**
 * GET /api/me
 * Returns the currently logged-in user's profile.
 * Requires a valid JWT in the Authorization header.
 */
export async function getMe(token: string): Promise<UserResponse> {
  const response = await fetch(`${BASE_URL}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new ApiError(response.status, "Unauthorized");
  }

  return response.json() as Promise<UserResponse>;
}
