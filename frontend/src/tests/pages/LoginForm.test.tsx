/**
 * UNIT TESTS — LoginForm component
 * ==================================
 * Component unit tests render a component in isolation
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { LoginForm } from "../../components/LoginForm";

describe("LoginForm", () => {
  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  describe("initial render", () => {
    it("shows a username input", () => {
      render(<LoginForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    it("shows a password input", () => {
      render(<LoginForm onSubmit={vi.fn()} />);
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it("shows a submit button", () => {
      render(<LoginForm onSubmit={vi.fn()} />);
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("does not show an error message by default", () => {
      render(<LoginForm onSubmit={vi.fn()} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Error state
  // ---------------------------------------------------------------------------

  describe("error display", () => {
    it("shows the error message when error prop is provided", () => {
      render(<LoginForm onSubmit={vi.fn()} error="Invalid credentials" />);
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
    });

    it("does not show an alert when error is null", () => {
      render(<LoginForm onSubmit={vi.fn()} error={null} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  describe("loading state", () => {
    it("disables the submit button when loading", () => {
      render(<LoginForm onSubmit={vi.fn()} isLoading={true} />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("shows 'Signing in…' text while loading", () => {
      render(<LoginForm onSubmit={vi.fn()} isLoading={true} />);
      expect(screen.getByRole("button")).toHaveTextContent(/signing in/i);
    });

    it("disables inputs while loading", () => {
      render(<LoginForm onSubmit={vi.fn()} isLoading={true} />);
      expect(screen.getByTestId("username-input")).toBeDisabled();
      expect(screen.getByTestId("password-input")).toBeDisabled();
    });
  });

  // ---------------------------------------------------------------------------
  // User interactions
  // ---------------------------------------------------------------------------

  describe("form submission", () => {
    it("calls onSubmit with entered credentials", async () => {
      const onSubmit = vi.fn();
      render(<LoginForm onSubmit={onSubmit} />);

      await userEvent.type(screen.getByTestId("username-input"), "foo");
      await userEvent.type(screen.getByTestId("password-input"), "password123");
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      expect(onSubmit).toHaveBeenCalledOnce();
      expect(onSubmit).toHaveBeenCalledWith("foo", "password123");
    });

    it("does not call onSubmit when fields are empty", async () => {
      const onSubmit = vi.fn();
      render(<LoginForm onSubmit={onSubmit} />);

      // Click submit without filling in required fields
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("reflects typed text in the username field", async () => {
      render(<LoginForm onSubmit={vi.fn()} />);
      const input = screen.getByTestId("username-input");

      await userEvent.type(input, "foo");

      expect(input).toHaveValue("foo");
    });
  });
});
