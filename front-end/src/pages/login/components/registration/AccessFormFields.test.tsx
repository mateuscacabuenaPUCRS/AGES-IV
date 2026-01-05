import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AccessFormFields from "./AccessFormFields";

describe("AccessFormFields component", () => {
  it("renders inputs and shows password requirements when password present", () => {
    const form = {
      email: "",
      password: "Abcdef1!23",
      confirmPassword: "",
    };

    const onChange = vi.fn();

    render(<AccessFormFields form={form} errors={{}} onChange={onChange} />);

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar Senha")).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);

    const greenItems = listItems.filter((li) => li.className.includes("text-green-600"));
    expect(greenItems.length).toBeGreaterThanOrEqual(1);
  });

  it("calls onChange when typing in fields", () => {
    const form = { email: "", password: "", confirmPassword: "" };
    const onChange = vi.fn();

    render(<AccessFormFields form={form} errors={{}} onChange={onChange} />);

    const emailInput = screen.getByLabelText("E-mail") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    expect(onChange).toHaveBeenCalledWith("email", "user@example.com");

    const passwordInput = screen.getByLabelText("Senha") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Abcdef1!" } });
    expect(onChange).toHaveBeenCalledWith("password", "Abcdef1!");
  });
});
