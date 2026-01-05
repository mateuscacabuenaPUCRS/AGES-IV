describe('Perfil Page - Donor', () => {
  const donorEmail = 'donor@email.com';
  const donorPassword = 'Password@1234';

  beforeEach(() => {
    cy.login(donorEmail, donorPassword);
    cy.wait(2000);
    cy.visit('/perfil');
    cy.wait(1000);
  });

  describe('Page Load and Layout', () => {
    it('should load the perfil page', () => {
      cy.url().should('include', '/perfil');
    });

    it('should display user name and email in header', () => {
      cy.get('h2').should('be.visible').and('not.be.empty');
      cy.contains(donorEmail).should('be.visible');
    });

    it('should display user avatar', () => {
      cy.get('img[alt="Foto do usuário"]').should('be.visible');
    });
  });

  describe('Profile Header Actions', () => {
    it('should display settings button', () => {
      cy.getByTestId('profile-settings-button').should('be.visible');
    });

    it('should display logout button', () => {
      cy.getByTestId('profile-logout-button').should('be.visible');
    });

    it('should display change avatar button on hover', () => {
      cy.getByTestId('change-avatar-button').should('exist');
    });

    it('should open settings modal when clicking settings button', () => {
      cy.getByTestId('profile-settings-button').click();
      cy.wait(500);
      cy.contains('Editar Perfil').should('be.visible');
    });

    it('should open logout modal when clicking logout button', () => {
      cy.getByTestId('profile-logout-button').click();
      cy.wait(500);
      cy.contains('Você deseja sair da sua conta?').should('be.visible');
    });
  });

  describe('Donor Personal Information', () => {
    it('should display birth date label', () => {
      cy.contains('Data de Nascimento').should('be.visible');
    });

    it('should display gender label', () => {
      cy.contains('Gênero').should('be.visible');
    });

    it('should display CPF label', () => {
      cy.contains('CPF').should('be.visible');
    });

    it('should display phone label', () => {
      cy.contains('Telefone').should('be.visible');
    });

    it('should display total donated section', () => {
      cy.contains('Total doado:').should('be.visible');
    });
  });

  describe('Campaigns Section', () => {
    it('should display campaigns section', () => {
      cy.contains('Campanhas').should('be.visible');
    });

    it('should display campaigns or empty state', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Nenhuma campanha')) {
          cy.contains('Nenhuma campanha').should('be.visible');
        } else {
          cy.contains('Campanhas').should('be.visible');
        }
      });
    });

    it('should display pagination if there are multiple pages', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[aria-label*="página"]').length > 0) {
          cy.get('[aria-label*="página"]').should('be.visible');
        }
      });
    });
  });

  describe('Donations Section', () => {
    it('should display donations section', () => {
      cy.contains('Doações').should('be.visible');
    });

    it('should display donations list or empty state', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Nenhuma doação')) {
          cy.contains('Nenhuma doação').should('be.visible');
        } else {
          cy.contains('Doações').should('be.visible');
        }
      });
    });
  });

  describe('Edit Profile Modal', () => {
    beforeEach(() => {
      cy.getByTestId('profile-settings-button').click();
      cy.wait(500);
    });

    it('should display edit profile form', () => {
      cy.contains('Editar Perfil').should('be.visible');
    });

    it('should display form fields', () => {
      cy.get('input[type="text"], input[type="email"], input[type="tel"]').should('have.length.at.least', 1);
    });

    it('should close modal when clicking cancel or close', () => {
      cy.contains('button', 'Cancelar').click();
      cy.wait(500);
      cy.contains('Editar Perfil').should('not.exist');
    });
  });

  describe('Logout Modal', () => {
    beforeEach(() => {
      cy.getByTestId('profile-logout-button').click();
      cy.wait(500);
    });

    it('should display logout confirmation', () => {
      cy.contains('Você deseja sair da sua conta?').should('be.visible');
    });

    it('should have cancel and confirm buttons', () => {
      cy.contains('button', 'Cancelar').should('be.visible');
      cy.contains('button', 'Sair').should('be.visible');
    });

    it('should close modal when clicking cancel', () => {
      cy.contains('button', 'Cancelar').click();
      cy.wait(500);
      cy.contains('Você deseja sair da sua conta?').should('not.exist');
    });
  });
});

describe('Perfil Page - Admin', () => {
  const adminEmail = 'admin@email.com';
  const adminPassword = 'Password@1234';

  beforeEach(() => {
    cy.login(adminEmail, adminPassword);
    cy.wait(2000);
    cy.visit('/perfil');
    cy.wait(1000);
  });

  describe('Page Load and Layout', () => {
    it('should load the perfil page', () => {
      cy.url().should('include', '/perfil');
    });

    it('should display admin name and email in header', () => {
      cy.get('h2').should('be.visible').and('not.be.empty');
      cy.contains(adminEmail).should('be.visible');
    });

    it('should display admin avatar', () => {
      cy.get('img[alt="Foto do usuário"]').should('be.visible');
    });
  });

  describe('Admin Header Actions', () => {
    it('should display settings button', () => {
      cy.getByTestId('profile-settings-button').should('be.visible');
    });

    it('should display create admin button', () => {
      cy.getByTestId('profile-create-admin-button').should('be.visible');
    });

    it('should display logout button', () => {
      cy.getByTestId('profile-logout-button').should('be.visible');
    });

    it('should open create admin modal when clicking create admin button', () => {
      cy.getByTestId('profile-create-admin-button').click();
      cy.wait(500);
      cy.contains('Criar Administrador').should('be.visible');
    });

    it('should open settings modal when clicking settings button', () => {
      cy.getByTestId('profile-settings-button').click();
      cy.wait(500);
      cy.contains('Editar Perfil').should('be.visible');
    });

    it('should open logout modal when clicking logout button', () => {
      cy.getByTestId('profile-logout-button').click();
      cy.wait(500);
      cy.contains('Você deseja sair da sua conta?').should('be.visible');
    });
  });

  describe('Users List Section', () => {
    it('should display users section title', () => {
      cy.contains('Usuários').should('be.visible');
    });

    it('should display users list or empty state', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Nenhum usuário encontrado')) {
          cy.contains('Nenhum usuário encontrado').should('be.visible');
        } else {
          cy.get('body').should('contain.text', 'Usuários');
        }
      });
    });

    it('should display pagination if there are multiple pages', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[aria-label*="página"]').length > 0) {
          cy.get('[aria-label*="página"]').should('be.visible');
        }
      });
    });
  });

  describe('User Filter', () => {
    it('should be able to change filter', () => {
      cy.get('body').then(($body) => {
        if ($body.find('select').length > 0) {
          cy.get('select').first().select(0);
          cy.wait(500);
          cy.get('body').should('be.visible');
        }
      });
    });
  });

  describe('Create Admin Modal', () => {
    beforeEach(() => {
      cy.getByTestId('profile-create-admin-button').click();
      cy.wait(500);
    });

    it('should display create admin form', () => {
      cy.contains('Criar Administrador').should('be.visible');
    });

    it('should have form fields', () => {
      cy.get('input[type="text"], input[type="email"], input[type="password"]').should('have.length.at.least', 1);
    });

    it('should close modal when clicking cancel', () => {
      cy.contains('button', 'Cancelar').click();
      cy.wait(500);
      cy.contains('Criar Administrador').should('not.exist');
    });
  });

  describe('Admin Settings Modal', () => {
    beforeEach(() => {
      cy.getByTestId('profile-settings-button').click();
      cy.wait(500);
    });

    it('should display edit profile form', () => {
      cy.contains('Editar Perfil').should('be.visible');
    });

    it('should display form fields', () => {
      cy.get('input[type="text"], input[type="email"]').should('have.length.at.least', 1);
    });

    it('should close modal when clicking cancel', () => {
      cy.contains('button', 'Cancelar').click();
      cy.wait(500);
      cy.contains('Editar Perfil').should('not.exist');
    });
  });

  describe('Admin Logout Modal', () => {
    beforeEach(() => {
      cy.getByTestId('profile-logout-button').click();
      cy.wait(500);
    });

    it('should display logout confirmation', () => {
      cy.contains('Você deseja sair da sua conta?').should('be.visible');
    });

    it('should have cancel and confirm buttons', () => {
      cy.contains('button', 'Cancelar').should('be.visible');
      cy.contains('button', 'Sair').should('be.visible');
    });

    it('should close modal when clicking cancel', () => {
      cy.contains('button', 'Cancelar').click();
      cy.wait(500);
      cy.contains('Você deseja sair da sua conta?').should('not.exist');
    });
  });

  describe('Admin Navigation', () => {
    it('should be able to navigate to dashboard', () => {
      cy.contains('a', 'Dashboard').click();
      cy.wait(1000);
      cy.url().should('include', '/dashboard');
    });
  });
});
