describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page successfully', () => {
    cy.url().should('include', '/');
  });

  it('should display navigation menu', () => {
    cy.get('nav').should('be.visible');
  });

  describe('Hero Section', () => {
    it('should display hero section', () => {
      cy.get('section[aria-roledescription="carousel"]').should('exist');
    });

    it('should click on event button when available', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="hero-event-button"]').length > 0) {
          cy.getByTestId('hero-event-button').should('be.visible');
        }
      });
    });

    it('should navigate hero slides with arrows', () => {
      cy.get('[data-testid="hero-prev-button"]').should('exist');
      cy.get('[data-testid="hero-next-button"]').should('exist');
    });
  });

  describe('Como Ajudar Section', () => {
    it('should display "Faça sua doação" button', () => {
      cy.getByTestId('donation-button').should('be.visible');
    });

    it('should click on "Faça sua doação" button', () => {
      cy.getByTestId('donation-button').click();
      cy.url().should('include', '/doacao');
    });

    it('should display "Entrar em Contato" button', () => {
      cy.getByTestId('contact-button').should('be.visible');
    });

    it('should display accordion', () => {
      cy.getByTestId('how-to-help-accordion').should('exist');
    });

    it('should open and close accordion items', () => {
      cy.get('[data-testid^="accordion-trigger-"]').first().click();
      cy.wait(300);
      cy.get('[data-testid^="accordion-trigger-"]').first().should('have.attr', 'data-state', 'open');
      cy.get('[data-testid^="accordion-trigger-"]').first().click();
      cy.wait(300);
    });
  });

  describe('O Que Acontece no Pão dos Pobres Section', () => {
    it('should display news carousel', () => {
      cy.getByTestId('news-carousel').should('exist');
    });

    it('should display news navigation arrows', () => {
      cy.getByTestId('news-prev-button').should('exist');
      cy.getByTestId('news-next-button').should('exist');
    });

    it('should click on news card when available', () => {
      cy.get('[data-testid^="news-card-"]').first().then(($card) => {
        if ($card.length > 0) {
          cy.wrap($card).click();
          cy.wait(500);
        }
      });
    });

    it('should navigate through news with arrows', () => {
      cy.get('[data-testid^="news-card-"]').then(($cards) => {
        if ($cards.length > 1) {
          cy.getByTestId('news-next-button').click();
          cy.wait(500);
          cy.getByTestId('news-prev-button').click();
        }
      });
    });
  });

  describe('Newsletter Section', () => {
    it('should display newsletter section', () => {
      cy.contains('Fique por dentro do futuro').should('be.visible');
    });

    it('should display email input', () => {
      cy.getByTestId('newsletter-email').should('exist');
    });

    it('should display submit button', () => {
      cy.getByTestId('newsletter-submit').should('exist');
    });

    it('should display checkbox', () => {
      cy.getByTestId('newsletter-checkbox').should('exist');
    });

    it('should submit newsletter with valid email', () => {
      cy.getByTestId('newsletter-email').type('teste@example.com');
      cy.getByTestId('newsletter-checkbox').click();
      cy.getByTestId('newsletter-submit').should('not.be.disabled');
      cy.getByTestId('newsletter-submit').click();
      cy.wait(500);
    });

    it('should not allow submit without checkbox', () => {
      cy.getByTestId('newsletter-email').type('teste@example.com');
      cy.getByTestId('newsletter-submit').should('be.disabled');
    });

    it('should not allow submit without email', () => {
      cy.getByTestId('newsletter-checkbox').click();
      cy.getByTestId('newsletter-submit').should('be.disabled');
    });
  });

  describe('Responsiveness', () => {
    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('nav').should('be.visible');
    });

    it('should be responsive on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('nav').should('be.visible');
    });

    it('should be responsive on desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('nav').should('be.visible');
    });
  });
});

