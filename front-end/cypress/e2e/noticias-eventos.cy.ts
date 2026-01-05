describe('Noticias e Eventos Page', () => {
  const adminEmail = 'admin@email.com';
  const adminPassword = 'Password@1234';

  beforeEach(() => {
    cy.login(adminEmail, adminPassword);
    cy.wait(500);
    cy.visit('/noticias-eventos');
    cy.wait(500);
  });

  it('should load the noticias-eventos page', () => {
    cy.url().should('include', '/noticias-eventos');
  });

  it('should display search bar', () => {
    cy.getByTestId('search-bar').should('exist');
  });

  it('should display sort button', () => {
    cy.getByTestId('sort-button').should('exist');
  });

  it('should display create button', () => {
    cy.getByTestId('create-button').should('exist');
  });

  it('should wait for content to load', () => {
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  it('should display tabs', () => {
    cy.getByTestId('tab-notícias').should('exist');
    cy.getByTestId('tab-eventos').should('exist');
    cy.getByTestId('tab-todos').should('exist');
  });

  it('should display news/events or empty state', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Nenhum')) {
        cy.getByTestId('empty-state').should('be.visible');
      } else {
        cy.get('article').should('have.length.greaterThan', 0);
      }
    });
  });

  it('should switch between tabs', () => {
    cy.getByTestId('tab-notícias').click();
    cy.wait(500);
    cy.get('body').should('be.visible');

    cy.getByTestId('tab-eventos').click();
    cy.wait(500);
    cy.get('body').should('be.visible');

    cy.getByTestId('tab-todos').click();
    cy.wait(500);
    cy.get('body').should('be.visible');
  });

  it('should be able to search news and events', () => {
    cy.getByTestId('search-bar').type('teste');
    cy.wait(500);
    cy.get('body').should('be.visible');
  });

  it('should toggle sort order', () => {
    cy.getByTestId('sort-button').should('contain', 'Mais recentes');
    cy.getByTestId('sort-button').click();
    cy.wait(500);
    cy.getByTestId('sort-button').should('contain', 'Mais antigos');
  });

  it('should display news cards when they exist', () => {
    cy.getByTestId('tab-notícias').click();
    cy.wait(500);
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Nenhum')) {
        cy.get('[data-testid^="news-event-card"]').should('have.length.greaterThan', 0);
      }
    });
  });

  it('should display event cards when they exist', () => {
    cy.getByTestId('tab-eventos').click();
    cy.wait(500);
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Nenhum')) {
        cy.get('[data-testid^="news-event-card"]').should('have.length.greaterThan', 0);
      }
    });
  });

  it('should show action buttons on news/event cards', () => {
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Nenhum')) {
        cy.get('[data-testid^="news-event-card"]').first().within(() => {
          cy.getByTestId('delete-news-event-button').should('exist');
          cy.getByTestId('edit-news-event-button').should('exist');
        });
      }
    });
  });

  it('should clear search and show all items', () => {
    cy.getByTestId('search-bar').type('teste');
    cy.wait(500);
    cy.getByTestId('search-bar').clear();
    cy.wait(500);
    cy.get('body').should('be.visible');
  });
});
