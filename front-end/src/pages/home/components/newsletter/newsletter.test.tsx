import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Newsletter } from "./newsletter";
import * as useNewsletterHook from "./useNewsletter";

vi.mock("@/components/ui/modal", () => ({
  default: (props: { isOpen: boolean; variant: string }) => {
    return props.isOpen ? <div data-testid={props.variant} /> : null;
  },
}));

const mockSubscribe = vi.fn();

beforeEach(() => {
  vi.spyOn(useNewsletterHook, "useNewsletter").mockReturnValue({
    subscribe: mockSubscribe,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Newsletter Component", () => {
  describe("Renderização inicial", () => {
    it("deve renderizar o formulário com o botão de inscrição desabilitado", () => {
      render(<Newsletter />);
      expect(screen.getByRole("button", { name: /inscrever-se/i })).toBeDisabled();
    });
  });

  describe("Validação de formulário", () => {
    it("deve habilitar o botão quando o email é preenchido e os termos são aceitos", () => {
      render(<Newsletter />);

      const emailInput = screen.getByPlaceholderText("Email");
      const termsCheckbox = screen.getByLabelText("Aceito os termos e condições");
      const submitButton = screen.getByRole("button", { name: /inscrever-se/i });

      fireEvent.change(emailInput, { target: { value: "teste@valido.com" } });
      fireEvent.click(termsCheckbox);

      expect(submitButton).toBeEnabled();
    });

    it("deve exibir erro de validação (Zod) para email inválido e não chamar a API", async () => {
      render(<Newsletter />);

      const emailInput = screen.getByPlaceholderText("Email");
      const termsCheckbox = screen.getByLabelText("Aceito os termos e condições");
      const submitButton = screen.getByRole("button", { name: /inscrever-se/i });

      fireEvent.change(emailInput, { target: { value: "email-invalido" } });
      fireEvent.click(termsCheckbox);
      fireEvent.click(submitButton);

      expect(await screen.findByText("Email inválido")).toBeInTheDocument();
      expect(mockSubscribe).not.toHaveBeenCalled();
    });
  });

  describe("Submissão de formulário", () => {
    it("deve chamar o subscribe, exibir modal de sucesso e limpar os campos", async () => {
      mockSubscribe.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<Newsletter />);

      const emailInput = screen.getByPlaceholderText("Email");
      const termsCheckbox = screen.getByLabelText("Aceito os termos e condições");
      const submitButton = screen.getByRole("button", { name: /inscrever-se/i });

      fireEvent.change(emailInput, { target: { value: "teste@gmail.com" } });
      fireEvent.click(termsCheckbox);
      fireEvent.click(submitButton);

      expect(mockSubscribe).toHaveBeenCalledWith(
        "teste@gmail.com",
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
      expect(await screen.findByTestId("newsletter-success")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toHaveValue("");
      expect(screen.getByLabelText("Aceito os termos e condições")).not.toBeChecked();
    });

    it("deve chamar o subscribe, exibir modal de erro e NÃO limpar os campos", async () => {
      const MENSAGEM_ERRO_API = "Este email já está cadastrado.";
      mockSubscribe.mockImplementation((_, options) => {
        options.onError(MENSAGEM_ERRO_API);
      });

      render(<Newsletter />);

      const emailInput = screen.getByPlaceholderText("Email");
      const termsCheckbox = screen.getByLabelText("Aceito os termos e condições");
      const submitButton = screen.getByRole("button", { name: /inscrever-se/i });

      fireEvent.change(emailInput, { target: { value: "ja.cadastrado@gmail.com" } });
      fireEvent.click(termsCheckbox);
      fireEvent.click(submitButton);

      expect(mockSubscribe).toHaveBeenCalled();
      expect(await screen.findByTestId("newsletter-error")).toBeInTheDocument();
      expect(await screen.findByText(MENSAGEM_ERRO_API)).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toHaveValue("ja.cadastrado@gmail.com");
    });
  });
});
