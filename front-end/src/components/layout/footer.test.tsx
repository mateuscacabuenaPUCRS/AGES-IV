// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Footer } from "./footer";

vi.mock("react-router-dom", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("Footer component", () => {
  it("renders the institution name", () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/Fundação Pão dos Pobres de Santo Antônio/i)).toBeInTheDocument();
  });

  it("renders the complete address", () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/R\. da República, 801/i)).toBeInTheDocument();
    expect(getByText(/Cidade Baixa/i)).toBeInTheDocument();
    expect(getByText(/Porto Alegre, RS/i)).toBeInTheDocument();
    expect(getByText(/CEP: 90050-321/i)).toBeInTheDocument();
  });

  it("renders the business hours", () => {
    const { getByText } = render(<Footer />);
    expect(getByText(/Segunda à Sexta/i)).toBeInTheDocument();
    expect(getByText(/8h às 12h \| 13h às 17h/i)).toBeInTheDocument();
  });

  it("has correct links and attributes for social icons", () => {
    const { getByLabelText } = render(<Footer />);

    const email = getByLabelText(/enviar e-mail/i);
    const whatsapp = getByLabelText(/abrir whatsapp/i);
    const linkedin = getByLabelText(/abrir linkedin/i);

    expect(email).toHaveAttribute("href", "mailto:relacaoinstitucional@paodospobres.com.br");
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/555134336900");
    expect(linkedin).toHaveAttribute(
      "href",
      "https://www.linkedin.com/company/fundacao-pao-dos-pobres/"
    );

    [whatsapp, linkedin].forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("displays current year in the copyright", () => {
    const { getByText } = render(<Footer />);
    const year = new Date().getFullYear();
    expect(
      getByText(`Copyright © ${year} - Pão dos Pobres. Todos os direitos reservados.`)
    ).toBeInTheDocument();
  });
});
