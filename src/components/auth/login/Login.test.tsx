import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { LoginComponent } from "./Login";

// 🧩 mock all external dependencies
jest.mock("@/queries/auth.queries", () => ({
  useLogin: () => ({
    mutateAsync: jest.fn(() =>
      Promise.resolve({ user: { email: "admin@aginsurance.com" } })
    ),
    isPending: false,
  }),
}));

const mockPush = jest.fn();
jest.mock("@/hooks/useProgressBarNavigator", () => ({
  __esModule: true,
  default: () => ({
    push: mockPush,
  }),
}));

const mockSetUser = jest.fn();
jest.mock("@/store/authStore", () => ({
  useAuthStore: () => ({
    setUser: mockSetUser,
  }),
}));

jest.mock("@/supabse-client", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(() =>
        Promise.resolve({
          data: { full_name: "John Doe", email: "admin@aginsurance.com" },
          error: null,
        })
      ),
    })),
  },
}));

// Mock toast functions
const mockToast = {
  promise: jest.fn(),
  error: jest.fn(),
  success: jest.fn(),
};
jest.mock("sonner", () => ({
  toast: mockToast,
}));

// Mock lucide-react icons (they’re just SVGs)
jest.mock("lucide-react", () => ({
  Eye: () => <svg data-testid="eye-icon" />,
  EyeOff: () => <svg data-testid="eyeoff-icon" />,
  Car: () => <svg data-testid="car-icon" />,
}));

describe("LoginComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form properly", () => {
    render(<LoginComponent />);
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/admin@aginsurance.com/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<LoginComponent />);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const toggleButton = screen.getAllByRole("button")[0]; // first button is toggle

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("submits form and calls toast.promise", async () => {
    render(<LoginComponent />);

    fireEvent.change(screen.getByPlaceholderText(/admin@aginsurance.com/i), {
      target: { value: "admin@aginsurance.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(mockToast.promise).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringContaining("Welcome back John Doe")
      );
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard/overview");
    expect(mockSetUser).toHaveBeenCalled();
  });
});
