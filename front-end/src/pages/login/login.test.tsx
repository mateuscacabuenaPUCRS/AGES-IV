// @vitest-environment happy-dom
import "@testing-library/jest-dom/vitest";
import { render, fireEvent, waitFor, within } from "@testing-library/react";
import type React from "react";
import { vi, describe, it, expect, beforeEach } from "vitest";

const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("@/hooks/useUser", () => ({
  useUser: () => ({ setUser: vi.fn() }),
}));

const loginMock = vi.fn();
vi.mock("@/services/auth", () => ({
  login: (..._args: unknown[]) => loginMock(..._args),
}));

vi.mock("./components/loginLayout", () => ({
  default: (props: {
    headerText?: string;
    headerSubtext?: string;
    FooterHref?: string;
    children?: React.ReactNode;
  }) => (
    <div>
      <div>{props.headerText}</div>
      <div>{props.children}</div>
      {props.FooterHref && (
        <button data-testid="anon-btn" onClick={() => navigateMock(props.FooterHref)}>
          {props.FooterHref === "/doacao" ? "Fazer doação anônima" : "Já tem uma conta? Acesse."}
        </button>
      )}
    </div>
  ),
}));

vi.mock("./components/registration/personalFields", () => ({
  default: () => <div>MockPersonalFields</div>,
}));

import LoginContent from "./components/login/loginContent";
import Login from "./login";

describe("Login interactions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("redirects to home when a donor logs in", async () => {
    loginMock.mockResolvedValueOnce({ role: "DONOR", id: "1", email: "a@b.com" });

    const { container } = render(<LoginContent onRegisterClick={() => {}} />);
    const c = within(container);

    fireEvent.change(c.getByPlaceholderText("Digite seu e-mail"), {
      target: { value: "donor@example.com" },
    });
    fireEvent.change(c.getByPlaceholderText("Digite sua senha"), {
      target: { value: "password" },
    });

    fireEvent.click(c.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => expect(loginMock).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("redirects to dashboard when an administrator logs in", async () => {
    loginMock.mockResolvedValueOnce({ role: "ADMIN", id: "2", email: "admin@example.com" });

    const { container } = render(<LoginContent onRegisterClick={() => {}} />);
    const c = within(container);

    fireEvent.change(c.getByPlaceholderText("Digite seu e-mail"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(c.getByPlaceholderText("Digite sua senha"), {
      target: { value: "password" },
    });

    fireEvent.click(c.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => expect(loginMock).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith("/dashboard");
  });

  it("renders registration component when clicking Sign up", async () => {
    const { container } = render(<Login />);
    const c = within(container);

    fireEvent.click(c.getByTestId("register-button"));

    await waitFor(() => expect(c.getByText("MockPersonalFields")).toBeInTheDocument());
  });

  it("redirects to donation screen when clicking Make anonymous donation", async () => {
    const { container } = render(<Login />);
    const c = within(container);

    fireEvent.click(c.getByTestId("anon-btn"));

    expect(navigateMock).toHaveBeenCalledWith("/doacao");
  });
});
