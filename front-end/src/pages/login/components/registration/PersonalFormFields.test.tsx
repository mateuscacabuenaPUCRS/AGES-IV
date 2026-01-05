import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PersonalFormFields from "./PersonalFormFields";

describe("PersonalFormFields component", () => {
  it("renders labels and placeholders", () => {
    const form = {
      nomeCompleto: "",
      dataNascimento: undefined,
      genero: "",
      cpf: "",
      telefone: "",
    };

    const onChange = vi.fn();

    render(<PersonalFormFields form={form} errors={{}} onChange={onChange} />);

    expect(screen.getByLabelText("Nome Completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Data de Nascimento")).toBeInTheDocument();
    expect(screen.getByLabelText("Gênero")).toBeInTheDocument();
    expect(screen.getByLabelText("CPF")).toBeInTheDocument();
    expect(screen.getByLabelText("Telefone")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Digite seu nome completo")).toBeInTheDocument();
    expect(screen.getByText("Selecione sua data de nascimento")).toBeInTheDocument();
    expect(screen.getByText("Selecione seu gênero")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("000.000.000-00")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("(11) 99999-9999")).toBeInTheDocument();
  });

  it("calls onChange when typing and formats CPF", () => {
    const form = {
      nomeCompleto: "",
      dataNascimento: new Date(),
      genero: "",
      cpf: "",
      telefone: "",
    };

    const onChange = vi.fn();

    render(<PersonalFormFields form={form} errors={{}} onChange={onChange} />);

    const nameInput = screen.getByLabelText("Nome Completo") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Vitor Silva" } });
    expect(onChange).toHaveBeenCalledWith("nomeCompleto", "Vitor Silva");

    const cpfInput = screen.getByLabelText("CPF") as HTMLInputElement;
    fireEvent.change(cpfInput, { target: { value: "12345678901" } });
    expect(onChange).toHaveBeenCalledWith("cpf", "123.456.789-01");
  });

  it("shows min length error for nomeCompleto when provided via errors prop", () => {
    const form = {
      nomeCompleto: "ab",
      dataNascimento: undefined,
      genero: "",
      cpf: "",
      telefone: "",
    };

    const errors: Partial<Record<"nomeCompleto", string>> = {
      nomeCompleto: "Nome deve ter no mínimo 3 caracteres",
    };

    render(<PersonalFormFields form={form} errors={errors} onChange={() => {}} />);

    expect(screen.getByText("Nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  });
});
