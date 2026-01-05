describe('Campanhas Page', () => {
  beforeEach(() => {
    cy.visit('/campanhas');
  });

  it('should load the campanhas page', () => {
    cy.url().should('include', '/campanhas');
  });

  it('should display search bar', () => {
    cy.getByTestId('search-bar').should('exist');
  });

  it('should display sort button', () => {
    cy.getByTestId('sort-button').should('exist');
  });

  it('should wait for content to load', () => {
    cy.get('body', { timeout: 10000 }).should('be.visible');
  });

  it('should display campaigns or empty state', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('Nenhuma campanha encontrada')) {
        cy.contains('Nenhuma campanha encontrada').should('be.visible');
      } else {
        cy.get('article').should('have.length.greaterThan', 0);
      }
    });
  });

  it('should be able to search campaigns', () => {
    cy.getByTestId('search-bar').type('teste');
    cy.wait(1000);
    cy.get('body').should('be.visible');
  });

  it('should toggle sort order', () => {
    cy.getByTestId('sort-button').should('contain', 'Mais recentes');
    cy.getByTestId('sort-button').click();
    cy.wait(500);
    cy.getByTestId('sort-button').should('contain', 'Mais antigos');
  });
});