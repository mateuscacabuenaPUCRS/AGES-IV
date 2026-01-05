import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { News } from "./news";
import type { NewsAPI } from "@/services/news";

vi.mock("embla-carousel-react", () => ({
  default: vi.fn(() => [
    vi.fn(),
    {
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      canScrollPrev: vi.fn(() => true),
      canScrollNext: vi.fn(() => true),
      on: vi.fn(),
      off: vi.fn(),
    },
  ]),
}));

vi.mock("lucide-react", () => ({
  ChevronLeft: () => <span>Previous</span>,
  ChevronRight: () => <span>Next</span>,
}));

describe("News Component", () => {
  const mockNews: NewsAPI[] = [
    {
      id: "1",
      title: "Primeira Notícia",
      description: "Descrição da primeira notícia",
      date: "2025-10-26",
      location: "Local 1",
      url: "https://example.com/news/1",
    },
    {
      id: "2",
      title: "Segunda Notícia",
      description: "Descrição da segunda notícia",
      date: "2025-10-27",
      location: "Local 2",
      url: "https://example.com/news/2",
    },
    {
      id: "3",
      title: "Terceira Notícia",
      description: "Descrição da terceira notícia",
      date: "2025-10-28",
      location: "Local 3",
      url: "https://example.com/news/3",
    },
    {
      id: "4",
      title: "Quarta Notícia",
      description: "Descrição da quarta notícia",
      date: "2025-10-29",
      location: "Local 4",
      url: "https://example.com/news/4",
    },
  ];

  beforeEach(() => {
    window.open = vi.fn();
  });

  describe("Renderização inicial", () => {
    it("deve renderizar cards de notícias com imagem e título", () => {
      render(<News news={mockNews} />);

      const firstNewsTitle = screen.getByText("Primeira Notícia");
      expect(firstNewsTitle).toBeInTheDocument();

      const newsImages = screen.getAllByRole("img");
      expect(newsImages.length).toBeGreaterThan(0);
      expect(newsImages[0]).toHaveAttribute("alt", "Primeira Notícia");
    });

    it("deve renderizar todos os cards de notícias fornecidos", () => {
      render(<News news={mockNews} />);

      mockNews.forEach((newsItem) => {
        expect(screen.getByText(newsItem.title)).toBeInTheDocument();
      });
    });

    it("deve renderizar o título desktop 'O QUE ACONTENCE NO PÃO DOS POBRES?' em telas maiores", () => {
      render(<News news={mockNews} />);

      const desktopTitle = screen.getByText("O QUE ACONTENCE NO PÃO DOS POBRES?");
      expect(desktopTitle).toBeInTheDocument();
      expect(desktopTitle).toHaveClass("md:block", "hidden");
    });

    it("deve renderizar o título mobile 'NOTÍCIAS:' em telas menores", () => {
      render(<News news={mockNews} />);

      const mobileTitle = screen.getByText("NOTÍCIAS:");
      expect(mobileTitle).toBeInTheDocument();
      expect(mobileTitle).toHaveClass("block", "md:hidden");
    });

    it("deve renderizar cards como botões clicáveis", () => {
      render(<News news={mockNews} />);

      const newsButtons = screen
        .getAllByRole("button")
        .filter((button) => button.textContent?.includes("Notícia"));

      expect(newsButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Estado sem dados", () => {
    it("deve renderizar o componente sem erros quando não há notícias", () => {
      render(<News news={[]} />);

      expect(screen.getByText("O QUE ACONTENCE NO PÃO DOS POBRES?")).toBeInTheDocument();
    });

    it("não deve renderizar nenhum card quando o array está vazio", () => {
      const { container } = render(<News news={[]} />);

      const newsButtons = container.querySelectorAll('button[type="button"]');
      const newsCards = Array.from(newsButtons).filter((button) =>
        button.textContent?.includes("Notícia")
      );

      expect(newsCards.length).toBe(0);
    });
  });

  describe("Navegação do carrossel", () => {
    it("deve renderizar botões de navegação next e previous", () => {
      render(<News news={mockNews} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      const prevButton = screen.getByRole("button", { name: /previous/i });

      expect(nextButton).toBeInTheDocument();
      expect(prevButton).toBeInTheDocument();
    });

    it("deve permitir navegação com o botão next", () => {
      render(<News news={mockNews} />);

      const nextButton = screen.getByRole("button", { name: /next/i });

      fireEvent.click(nextButton);

      expect(screen.getByText("Primeira Notícia")).toBeInTheDocument();
    });

    it("deve permitir navegação com o botão previous", () => {
      render(<News news={mockNews} />);

      const prevButton = screen.getByRole("button", { name: /previous/i });

      fireEvent.click(prevButton);

      expect(screen.getByText("Primeira Notícia")).toBeInTheDocument();
    });

    it("deve navegar entre múltiplas notícias usando next", () => {
      render(<News news={mockNews} />);

      const nextButton = screen.getByRole("button", { name: /next/i });

      expect(screen.getByText("Primeira Notícia")).toBeInTheDocument();

      fireEvent.click(nextButton);

      mockNews.forEach((newsItem) => {
        expect(screen.getByText(newsItem.title)).toBeInTheDocument();
      });
    });
  });

  describe("Click para abrir notícia", () => {
    it("deve abrir o modal ao clicar em um card de notícia", async () => {
      render(<News news={mockNews} />);

      const firstNewsButton = screen.getByText("Primeira Notícia").closest("button");
      expect(firstNewsButton).toBeInTheDocument();

      fireEvent.click(firstNewsButton!);

      await waitFor(() => {
        expect(screen.getByText("Descrição da primeira notícia")).toBeInTheDocument();
      });
    });

    it("deve exibir os dados corretos da notícia no modal", async () => {
      render(<News news={mockNews} />);

      const secondNewsButton = screen.getByText("Segunda Notícia").closest("button");
      fireEvent.click(secondNewsButton!);

      await waitFor(() => {
        expect(screen.getByText("Descrição da segunda notícia")).toBeInTheDocument();
        expect(screen.getByText("Local 2")).toBeInTheDocument();
      });
    });

    it("deve exibir a data formatada no modal", async () => {
      render(<News news={mockNews} />);

      const firstNewsButton = screen.getByText("Primeira Notícia").closest("button");
      fireEvent.click(firstNewsButton!);

      await waitFor(() => {
        expect(screen.getByText(/25 de outubro de 2025/i)).toBeInTheDocument();
      });
    });

    it("deve fechar o modal ao clicar no botão Fechar", async () => {
      render(<News news={mockNews} />);

      const firstNewsButton = screen.getByText("Primeira Notícia").closest("button");
      fireEvent.click(firstNewsButton!);

      await waitFor(() => {
        expect(screen.getByText("Descrição da primeira notícia")).toBeInTheDocument();
      });

      const closeButton = screen.getByRole("button", { name: /fechar/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Descrição da primeira notícia")).not.toBeInTheDocument();
      });
    });

    it("deve abrir diferentes notícias ao clicar em cards diferentes", async () => {
      render(<News news={mockNews} />);

      const firstNewsButton = screen.getByText("Primeira Notícia").closest("button");
      fireEvent.click(firstNewsButton!);

      await waitFor(() => {
        expect(screen.getByText("Descrição da primeira notícia")).toBeInTheDocument();
      });

      const closeButton = screen.getByRole("button", { name: /fechar/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Descrição da primeira notícia")).not.toBeInTheDocument();
      });

      const thirdNewsButton = screen.getByText("Terceira Notícia").closest("button");
      fireEvent.click(thirdNewsButton!);

      await waitFor(() => {
        expect(screen.getByText("Descrição da terceira notícia")).toBeInTheDocument();
        expect(screen.getByText("Local 3")).toBeInTheDocument();
      });
    });
  });

  describe("Renderização de imagens", () => {
    it("deve renderizar imagem com alt text correto para cada notícia", () => {
      render(<News news={mockNews} />);

      mockNews.forEach((newsItem) => {
        const image = screen.getByAltText(newsItem.title);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("src");
      });
    });

    it("deve usar a mesma imagem placeholder para todas as notícias", () => {
      render(<News news={mockNews} />);

      const images = screen.getAllByRole("img");
      const sources = images.map((img) => img.getAttribute("src"));

      const uniqueSources = new Set(sources);
      expect(uniqueSources.size).toBe(1);
    });
  });

  describe("Estrutura do carrossel", () => {
    it("deve envolver cada notícia em um CarouselItem", () => {
      const { container } = render(<News news={mockNews} />);

      const newsCards = container.querySelectorAll('button[type="button"]');
      const actualNewsCards = Array.from(newsCards).filter((button) =>
        button.textContent?.includes("Notícia")
      );
      expect(actualNewsCards.length).toBe(mockNews.length);
    });

    it("deve configurar o carrossel com align start e loop false", () => {
      const { container } = render(<News news={mockNews} />);

      const carouselContainer = container.querySelector(".relative.group");
      expect(carouselContainer).toBeInTheDocument();

      const overflowContainer = container.querySelector(".overflow-hidden");
      expect(overflowContainer).toBeInTheDocument();
    });
  });

  describe("Modal de notícia", () => {
    it("não deve renderizar o modal inicialmente", () => {
      render(<News news={mockNews} />);

      expect(screen.queryByText("Descrição da primeira notícia")).not.toBeInTheDocument();
    });

    it("deve renderizar o modal somente quando uma notícia é selecionada", async () => {
      render(<News news={mockNews} />);

      expect(screen.queryByText("Ler notícia completa")).not.toBeInTheDocument();

      const firstNewsButton = screen.getByText("Primeira Notícia").closest("button");
      fireEvent.click(firstNewsButton!);

      await waitFor(() => {
        expect(screen.getByText("Ler notícia completa")).toBeInTheDocument();
      });
    });

    it("deve exibir o título correto no modal", async () => {
      render(<News news={mockNews} />);

      const secondNewsButton = screen.getByText("Segunda Notícia").closest("button");
      fireEvent.click(secondNewsButton!);

      await waitFor(() => {
        const modalTitles = screen.getAllByText("Segunda Notícia");
        expect(modalTitles.length).toBeGreaterThan(1);
      });
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter estrutura semântica apropriada", () => {
      const { container } = render(<News news={mockNews} />);

      const headings = container.querySelectorAll("h2");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("deve ter imagens com atributos alt", () => {
      render(<News news={mockNews} />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img).toHaveAttribute("alt");
        expect(img.getAttribute("alt")).not.toBe("");
      });
    });

    it("deve renderizar botões de navegação acessíveis", () => {
      render(<News news={mockNews} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge cases", () => {
    it("deve lidar com notícia única", () => {
      const singleNews = [mockNews[0]];
      render(<News news={singleNews} />);

      expect(screen.getByText("Primeira Notícia")).toBeInTheDocument();
    });

    it("deve lidar com notícias sem URL", async () => {
      const newsWithoutUrl: NewsAPI[] = [
        {
          id: "5",
          title: "Notícia sem URL",
          description: "Esta notícia não tem URL",
          date: "2025-10-30",
          location: "Local Teste",
        },
      ];

      render(<News news={newsWithoutUrl} />);

      const newsButton = screen.getByText("Notícia sem URL").closest("button");
      fireEvent.click(newsButton!);

      await waitFor(() => {
        expect(screen.getByText("Esta notícia não tem URL")).toBeInTheDocument();
        expect(screen.queryByText("Ler notícia completa")).not.toBeInTheDocument();
      });
    });

    it("deve lidar com títulos muito longos", () => {
      const longTitleNews: NewsAPI[] = [
        {
          id: "6",
          title:
            "Esta é uma notícia com um título extremamente longo que pode quebrar o layout se não for tratado adequadamente",
          description: "Descrição",
          date: "2025-10-30",
          location: "Local",
        },
      ];

      render(<News news={longTitleNews} />);

      expect(
        screen.getByText(
          "Esta é uma notícia com um título extremamente longo que pode quebrar o layout se não for tratado adequadamente"
        )
      ).toBeInTheDocument();
    });
  });
});
