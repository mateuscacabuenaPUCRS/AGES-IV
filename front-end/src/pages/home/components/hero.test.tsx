import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Hero, type HeroItem } from "./hero";

describe("Hero Component", () => {
  const mockItems: HeroItem[] = [
    {
      id: 1,
      imageUrl: "/image1.jpg",
      title: "deleo tepidus molestias",
      description: "Delibero repellat stipes nostrum.",
      location: "988 Julius Stravenue",
      date: "26 de outubro de 2025",
      time: "05:30",
      imageAlt: "Evento 1",
      buttonLabel: "Ir para o evento",
      buttonLink: "/events/1",
    },
    {
      id: 2,
      imageUrl: "/image2.jpg",
      title: "Segundo Evento",
      description: "Descrição do segundo evento",
      location: "Local 2",
      date: "27 de outubro de 2025",
      time: "14:00",
      imageAlt: "Evento 2",
      buttonLabel: "Ir para o evento",
      buttonLink: "/events/2",
    },
    {
      id: 3,
      imageUrl: "/image3.jpg",
      title: "Terceiro Evento",
      description: "Descrição do terceiro evento",
      location: "Local 3",
      date: "28 de outubro de 2025",
      time: "18:00",
      imageAlt: "Evento 3",
      buttonLabel: "Ir para o evento",
      buttonLink: "/events/3",
    },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    window.open = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Renderização inicial", () => {
    it("deve renderizar o primeiro slide por padrão", () => {
      render(<Hero items={mockItems} />);

      const firstImage = screen.getByAltText("Evento 1");
      expect(firstImage).toBeInTheDocument();
      expect(firstImage).toHaveAttribute("src", "/image1.jpg");

      expect(screen.getByText("deleo tepidus molestias")).toBeInTheDocument();

      expect(screen.getByText("Delibero repellat stipes nostrum.")).toBeInTheDocument();
    });

    it("deve renderizar o primeiro slide com loading eager", () => {
      render(<Hero items={mockItems} />);

      const firstImage = screen.getByAltText("Evento 1");
      expect(firstImage).toHaveAttribute("loading", "eager");
    });

    it("deve renderizar slides subsequentes com loading lazy", () => {
      render(<Hero items={mockItems} />);

      const secondImage = screen.getByAltText("Evento 2");
      expect(secondImage).toHaveAttribute("loading", "lazy");
    });
  });

  describe("Informações do card lateral", () => {
    it("deve exibir Local formatado corretamente", () => {
      const { container } = render(<Hero items={mockItems} />);

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toBeInTheDocument();
      expect(visibleSlide).toHaveTextContent("Local");
      expect(visibleSlide).toHaveTextContent("988 Julius Stravenue");
    });

    it("deve exibir Data formatada corretamente", () => {
      const { container } = render(<Hero items={mockItems} />);

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toBeInTheDocument();
      expect(visibleSlide).toHaveTextContent("Data");
      expect(visibleSlide).toHaveTextContent("26 de outubro de 2025");
    });

    it("deve exibir Horário formatado corretamente", () => {
      const { container } = render(<Hero items={mockItems} />);

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toBeInTheDocument();
      expect(visibleSlide).toHaveTextContent("Horário");
      expect(visibleSlide).toHaveTextContent("05:30");
    });

    it("não deve exibir o card lateral se não houver informações", () => {
      const itemsWithoutInfo: HeroItem[] = [
        {
          id: 1,
          imageUrl: "/image1.jpg",
          title: "Título sem informações",
          imageAlt: "Sem info",
        },
      ];

      render(<Hero items={itemsWithoutInfo} />);

      expect(screen.queryByText("Local")).not.toBeInTheDocument();
      expect(screen.queryByText("Data")).not.toBeInTheDocument();
      expect(screen.queryByText("Horário")).not.toBeInTheDocument();
    });
  });

  describe("Navegação com botões", () => {
    it("deve navegar para o próximo slide ao clicar no botão 'Próximo slide'", () => {
      const { container } = render(<Hero items={mockItems} />);

      let visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("deleo tepidus molestias");

      const nextButton = screen.getByLabelText("Próximo slide");
      fireEvent.click(nextButton);

      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");
    });

    it("deve navegar para o slide anterior ao clicar no botão 'Slide anterior'", () => {
      const { container } = render(<Hero items={mockItems} />);

      let visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("deleo tepidus molestias");

      const prevButton = screen.getByLabelText("Slide anterior");
      fireEvent.click(prevButton);

      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Terceiro Evento");
    });

    it("deve fazer navegação circular do último para o primeiro slide", () => {
      const { container } = render(<Hero items={mockItems} />);

      const nextButton = screen.getByLabelText("Próximo slide");

      fireEvent.click(nextButton);
      let visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");

      fireEvent.click(nextButton);
      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Terceiro Evento");

      fireEvent.click(nextButton);
      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("deleo tepidus molestias");
    });

    it("não deve renderizar botões de navegação quando showArrows é false", () => {
      render(<Hero items={mockItems} showArrows={false} />);

      expect(screen.queryByLabelText("Próximo slide")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Slide anterior")).not.toBeInTheDocument();
    });

    it("não deve renderizar botões quando há apenas um item", () => {
      render(<Hero items={[mockItems[0]]} />);

      expect(screen.queryByLabelText("Próximo slide")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Slide anterior")).not.toBeInTheDocument();
    });
  });

  describe("Indicadores de slide", () => {
    it("deve renderizar indicadores para cada slide", () => {
      render(<Hero items={mockItems} />);

      const indicators = screen.getAllByLabelText(/Ir para o slide \d+/);
      expect(indicators).toHaveLength(mockItems.length);
    });

    it("deve navegar para o slide correto ao clicar no indicador", () => {
      const { container } = render(<Hero items={mockItems} />);

      const thirdIndicator = screen.getByLabelText("Ir para o slide 3");
      fireEvent.click(thirdIndicator);

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Terceiro Evento");
    });

    it("não deve renderizar indicadores quando showIndicators é false", () => {
      render(<Hero items={mockItems} showIndicators={false} />);

      const indicators = screen.queryAllByLabelText(/Ir para o slide \d+/);
      expect(indicators).toHaveLength(0);
    });
  });

  describe("CTA 'Ir para o evento'", () => {
    it("deve navegar para a rota esperada ao clicar no botão", () => {
      const { container } = render(<Hero items={mockItems} />);

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      const eventButton = visibleSlide!.querySelector("button") as HTMLButtonElement;
      fireEvent.click(eventButton);

      expect(window.open).toHaveBeenCalledWith("/events/1");
    });

    it("deve navegar para a rota do slide correto após mudança de slide", () => {
      const { container } = render(<Hero items={mockItems} />);

      const nextButton = screen.getByLabelText("Próximo slide");
      fireEvent.click(nextButton);

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");

      const eventButton = visibleSlide!.querySelector("button") as HTMLButtonElement;
      fireEvent.click(eventButton);

      expect(window.open).toHaveBeenCalledWith("/events/2");
    });
  });

  describe("Autoplay", () => {
    it("deve avançar automaticamente para o próximo slide após 6 segundos", () => {
      const { container } = render(<Hero items={mockItems} />);

      let visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("deleo tepidus molestias");

      act(() => {
        vi.advanceTimersByTime(6000);
      });

      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");
    });

    it("deve continuar o autoplay do segundo para o terceiro slide", () => {
      const { container } = render(<Hero items={mockItems} />);

      act(() => {
        vi.advanceTimersByTime(6000);
      });
      let visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");

      act(() => {
        vi.advanceTimersByTime(6000);
      });
      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Terceiro Evento");
    });

    it("deve pausar o autoplay após interação do usuário e reiniciar após 15 segundos", () => {
      const { container } = render(<Hero items={mockItems} />);

      let visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("deleo tepidus molestias");

      const nextButton = screen.getByLabelText("Próximo slide");
      fireEvent.click(nextButton);

      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");

      act(() => {
        vi.advanceTimersByTime(6000);
      });
      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");

      act(() => {
        vi.advanceTimersByTime(9000);
      });

      act(() => {
        vi.advanceTimersByTime(6000);
      });

      visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Terceiro Evento");
    });

    it("não deve iniciar autoplay quando há apenas um item", () => {
      render(<Hero items={[mockItems[0]]} />);

      expect(screen.getByText("deleo tepidus molestias")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(6000);
      });

      expect(screen.getByText("deleo tepidus molestias")).toBeInTheDocument();
    });
  });

  describe("Navegação por teclado", () => {
    it("deve navegar para o próximo slide com a tecla ArrowRight", () => {
      const { container } = render(<Hero items={mockItems} />);

      const section = container.querySelector("section") as HTMLElement;
      section.focus();

      fireEvent.keyDown(section, { key: "ArrowRight" });

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Segundo Evento");
    });

    it("deve navegar para o slide anterior com a tecla ArrowLeft", () => {
      const { container } = render(<Hero items={mockItems} />);

      const section = container.querySelector("section") as HTMLElement;
      section.focus();

      fireEvent.keyDown(section, { key: "ArrowLeft" });

      const visibleSlide = container.querySelector('[aria-hidden="false"]');
      expect(visibleSlide).toHaveTextContent("Terceiro Evento");
    });
  });

  describe("Acessibilidade", () => {
    it("deve ter role carousel quando há múltiplos slides", () => {
      const { container } = render(<Hero items={mockItems} />);

      const carousel = container.querySelector('[aria-roledescription="carousel"]');
      expect(carousel).toBeInTheDocument();
    });

    it("não deve ter role carousel quando há apenas um slide", () => {
      const { container } = render(<Hero items={[mockItems[0]]} />);

      const carousel = container.querySelector('[aria-roledescription="carousel"]');
      expect(carousel).not.toBeInTheDocument();
    });

    it("deve marcar slides não visíveis como aria-hidden", () => {
      const { container } = render(<Hero items={mockItems} />);

      const slides = container.querySelectorAll('[aria-roledescription="slide"]');

      expect(slides[0]).toHaveAttribute("aria-hidden", "false");

      expect(slides[1]).toHaveAttribute("aria-hidden", "true");
      expect(slides[2]).toHaveAttribute("aria-hidden", "true");
    });

    it("deve ter labels descritivos nos botões de navegação", () => {
      render(<Hero items={mockItems} />);

      expect(screen.getByLabelText("Slide anterior")).toBeInTheDocument();
      expect(screen.getByLabelText("Próximo slide")).toBeInTheDocument();
    });
  });
});
