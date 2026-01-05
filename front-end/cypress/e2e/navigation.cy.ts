describe('System Navigation - Anonymous User', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(1000);
  });

  describe('Navbar Navigation', () => {
    it('should navigate to Home page', () => {
      cy.get('nav').contains('Home').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should navigate to Campanhas page', () => {
      cy.get('nav').contains('Campanhas').click();
      cy.wait(500);
      cy.url().should('include', '/campanhas');
    });

    it('should navigate to Doar page', () => {
      cy.get('nav').contains('Doar').click();
      cy.wait(500);
      cy.url().should('include', '/doacao');
    });

    it('should navigate to Login page', () => {
      cy.get('nav').contains('Login').click();
      cy.wait(500);
      cy.url().should('include', '/login');
    });
  });

  describe('Home Page Navigation', () => {
    it('should navigate to donation page from hero button', () => {
      cy.get('button, a').contains('Faça sua doação').first().click();
      cy.wait(500);
      cy.url().should('include', '/doacao');
    });

    it('should navigate to campaigns from How to Help section', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Ver campanhas')) {
          cy.contains('Ver campanhas').first().click();
          cy.wait(500);
          cy.url().should('include', '/campanhas');
        }
      });
    });
  });

  describe('Footer Navigation', () => {
    it('should display footer', () => {
      cy.get('footer').should('be.visible');
    });

    it('should have social media links', () => {
      cy.get('footer').within(() => {
        cy.get('a[href*="facebook"], a[href*="instagram"], a[href*="linkedin"]')
          .should('have.length.at.least', 1);
      });
    });
  });

  describe('Logo Navigation', () => {
    it('should navigate to home when clicking logo', () => {
      cy.visit('/campanhas');
      cy.wait(500);
      
      cy.get('nav a[href="/"]').first().click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
});

describe('System Navigation - Logged Donor', () => {
  const donorEmail = 'donor@email.com';
  const donorPassword = 'Password@1234';

  beforeEach(() => {
    cy.login(donorEmail, donorPassword);
    cy.wait(2000);
  });

  describe('Authenticated Navbar Navigation', () => {
    it('should navigate to Home page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Home').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should navigate to Campanhas page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Campanhas').click();
      cy.wait(500);
      cy.url().should('include', '/campanhas');
    });

    it('should navigate to Doar page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Doar').click();
      cy.wait(500);
      cy.url().should('include', '/doacao');
    });

    it('should navigate to Perfil page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Doador').click();
      cy.wait(500);
      cy.url().should('include', '/perfil');
    });

    it('should not display Login button', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Login').should('not.exist');
    });
  });

  describe('Profile to Other Pages', () => {
    it('should navigate from profile to home', () => {
      cy.visit('/perfil');
      cy.wait(1000);
      
      cy.get('nav').contains('Home').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should navigate from profile to campaigns', () => {
      cy.visit('/perfil');
      cy.wait(1000);
      
      cy.get('nav').contains('Campanhas').click();
      cy.wait(500);
      cy.url().should('include', '/campanhas');
    });

    it('should navigate from profile to donation', () => {
      cy.visit('/perfil');
      cy.wait(1000);
      
      cy.get('nav').contains('Doar').click();
      cy.wait(500);
      cy.url().should('include', '/doacao');
    });
  });
});

describe('System Navigation - Admin', () => {
  const adminEmail = 'admin@email.com';
  const adminPassword = 'Password@1234';

  beforeEach(() => {
    cy.login(adminEmail, adminPassword);
    cy.wait(2000);
  });

  describe('Admin Navbar Navigation', () => {
    it('should navigate to Home page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Home').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should navigate to Dashboard page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Dashboard').click();
      cy.wait(500);
      cy.url().should('include', '/dashboard');
    });

    it('should navigate to Campanhas page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Campanhas').click();
      cy.wait(500);
      cy.url().should('include', '/campanhas');
    });

    it('should navigate to Notícias & Eventos page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Notícias & Eventos').click();
      cy.wait(500);
      cy.url().should('include', '/noticias-eventos');
    });

    it('should navigate to Perfil page', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Admin').click();
      cy.wait(500);
      cy.url().should('include', '/perfil');
    });

    it('should not display Doar button', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Doar').should('not.exist');
    });

    it('should not display Login button', () => {
      cy.visit('/');
      cy.wait(500);
      cy.get('nav').contains('Entrar').should('not.exist');
    });
  });

  describe('Admin Dashboard Navigation', () => {
    it('should navigate from dashboard to home', () => {
      cy.visit('/dashboard');
      cy.wait(1000);
      
      cy.get('nav').contains('Home').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should navigate from dashboard to campaigns', () => {
      cy.visit('/dashboard');
      cy.wait(500);
      
      cy.get('nav').contains('Campanhas').click();
      cy.wait(500);
      cy.url().should('include', '/campanhas');
    });

    it('should navigate from dashboard to profile', () => {
      cy.visit('/dashboard');
      cy.wait(500);
      
      cy.get('nav').contains('Admin').click();
      cy.wait(500);
      cy.url().should('include', '/perfil');
    });

    it('should navigate from dashboard to news & events', () => {
      cy.visit('/dashboard');
      cy.wait(1000);
      
      cy.get('nav').contains('Notícias & Eventos').click();
      cy.wait(500);
      cy.url().should('include', '/noticias-eventos');
    });
  });

  describe('Admin Complete Navigation Flow', () => {
    it('should navigate through all admin pages', () => {
      cy.visit('/');
      cy.wait(500);
      
      cy.get('nav').contains('Dashboard').click();
      cy.wait(500);
      cy.url().should('include', '/dashboard');
      
      cy.get('nav').contains('Campanhas').click();
      cy.wait(500);
      cy.url().should('include', '/campanhas');
      
      cy.get('nav').contains('Notícias & Eventos').click();
      cy.wait(500);
      cy.url().should('include', '/noticias-eventos');
      
      cy.get('nav').contains('Admin').click();
      cy.wait(500);
      cy.url().should('include', '/perfil');
      
      cy.get('nav').contains('Home').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
});

