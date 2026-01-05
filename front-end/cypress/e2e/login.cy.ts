describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should load the login page', () => {
    cy.url().should('include', '/login');
  });

  describe('Form Elements', () => {
    it('should display email input', () => {
      cy.getByTestId('login-email').should('be.visible');
    });

    it('should display password input', () => {
      cy.getByTestId('login-password').should('be.visible');
    });

    it('should display submit button', () => {
      cy.getByTestId('login-submit').should('be.visible').and('contain', 'Entrar');
    });

    it('should display register button', () => {
      cy.getByTestId('register-button').should('be.visible').and('contain', 'Cadastre-se');
    });

    it('should display forgot password button', () => {
      cy.getByTestId('forgot-password-button').should('be.visible').and('contain', 'Esqueceu sua senha?');
    });
  });

  describe('Form Validation', () => {
    it('should show validation error for empty email', () => {
      cy.getByTestId('login-submit').click();
      cy.contains('Email inválido', { matchCase: false }).should('exist');
    });

    it('should show validation error for invalid email format', () => {
      cy.getByTestId('login-email').type('invalid-email');
      cy.getByTestId('login-password').type('Password@1234');
      cy.getByTestId('login-submit').click();
      cy.contains('válido', { matchCase: false }).should('exist');
    });

    it('should show validation error for empty password', () => {
      cy.getByTestId('login-email').type('test@example.com');
      cy.getByTestId('login-submit').click();
      cy.contains('6 caracteres', { matchCase: false }).should('exist');
    });

    it('should clear errors when typing', () => {
      cy.getByTestId('login-submit').click();
      cy.getByTestId('login-email').type('test@example.com');
      cy.wait(300);
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should show password as hidden by default', () => {
      cy.getByTestId('login-password').should('have.attr', 'type', 'password');
    });

    it('should toggle password visibility when clicking eye icon', () => {
      cy.getByTestId('login-password').type('password123');
      cy.getByTestId('login-password').should('have.attr', 'type', 'password');
      cy.getByTestId('login-password').parent().find('button').click();
      cy.getByTestId('login-password').should('have.attr', 'type', 'text');
      cy.getByTestId('login-password').parent().find('button').click();
      cy.getByTestId('login-password').should('have.attr', 'type', 'password');
    });
  });

  describe('Login Error Handling', () => {
    it('should show error message for invalid credentials', () => {
      cy.getByTestId('login-email').type('wrong@example.com');
      cy.getByTestId('login-password').type('wrongpassword');
      cy.getByTestId('login-submit').click();
      cy.wait(1000);
      cy.getByTestId('login-error').should('be.visible').and('contain', 'incorretos');
    });

    it('should clear error when typing after failed login', () => {
      cy.getByTestId('login-email').type('wrong@example.com');
      cy.getByTestId('login-password').type('wrongpassword');
      cy.getByTestId('login-submit').click();
      cy.wait(1000);
      cy.getByTestId('login-error').should('be.visible');
      cy.getByTestId('login-email').clear().type('new@example.com');
      cy.getByTestId('login-error').should('not.exist');
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page when clicking register button', () => {
      cy.getByTestId('register-button').click();
      cy.contains('Cadastro').should('be.visible');
    });

    it('should open forgot password modal', () => {
      cy.getByTestId('forgot-password-button').click();
      cy.wait(500);
      cy.get('[role="dialog"]').should('be.visible');
    });
  });
});
