/**
 * API helpers for authentication.
 *
 * These functions call the backend directly using Playwright's APIRequestContext.
 * Keeping them here (instead of inside page objects) means:
 *  - Page objects stay focused on the browser UI
 *  - API calls can be reused across multiple spec files and page objects
 *  - If the API changes (e.g. endpoint path, payload shape), there is one place to fix
 */

import { type APIRequestContext } from "@playwright/test";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

/**
 * POST /api/login — exchange credentials for a JWT.
 * Throws if the request fails or credentials are invalid.
 */
export async function apiLogin(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<TokenResponse> {
  const response = await request.post(`${API_BASE_URL}/api/login`, {
    data: { username, password },
  });

  if (!response.ok()) {
    throw new Error(`API login failed: ${response.status()} ${await response.text()}`);
  }

  return response.json();
}
