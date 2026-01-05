describe('Cadastro de Doador - Fluxo Completo', () => {
  const generateValidCPF = () => {
    const randomDigits = () => Math.floor(Math.random() * 9);
    const cpf = Array.from({ length: 9 }, randomDigits);

    const calculateDigit = (digits: number[]) => {
      const sum = digits.reduce((acc, digit, index) => acc + digit * (digits.length + 1 - index), 0);
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    cpf.push(calculateDigit(cpf));
    cpf.push(calculateDigit(cpf));

    return cpf.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const uniqueEmail = `testuser${Date.now()}@email.com`;
  const validCPF = generateValidCPF();
  
  const testUser = {
    fullname: 'Cypress Test User',
    cpf: validCPF,
    phone: '(51) 99999-9999',
    email: uniqueEmail,
    password: 'Password@1234',
  };

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should complete full registration flow and delete account', () => {
    cy.getByTestId('register-button').click();
    cy.wait(500);

    cy.getByTestId('register-fullname').type(testUser.fullname);

    cy.get('#dataNascimento').click();
    cy.wait(300);
    cy.contains('button', '1').click();
    cy.wait(200);

    cy.get('#genero').click();
    cy.wait(200);
    cy.contains('Masculino').click();

    cy.getByTestId('register-cpf').type(testUser.cpf.replace(/\D/g, ''));
    cy.getByTestId('register-phone').type(testUser.phone.replace(/\D/g, ''));

    cy.getByTestId('register-next').should('not.be.disabled');
    cy.getByTestId('register-next').click();
    cy.wait(500);

    cy.contains('Dados de Acesso').should('be.visible');

    cy.getByTestId('register-email').type(testUser.email);
    cy.getByTestId('register-password').type(testUser.password);
    cy.getByTestId('register-confirm-password').type(testUser.password);

    cy.wait(500);

    cy.getByTestId('register-submit').should('not.be.disabled');
    cy.getByTestId('register-submit').click();
    cy.wait(1000);
    cy.contains('Cadastro realizado com sucesso!').should('be.visible');

    cy.visit('/login');
    cy.wait(500);

    cy.getByTestId('login-email').type(testUser.email);
    cy.getByTestId('login-password').type(testUser.password);
    cy.getByTestId('login-submit').click();
    cy.wait(500);
  });
});

