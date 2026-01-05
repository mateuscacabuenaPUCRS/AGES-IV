describe('Doacao Page - Anonymous User', () => {
  beforeEach(() => {
    cy.visit('/doacao');
    cy.wait(500);
  });

  describe('Page Load', () => {
    it('should load the doacao page', () => {
      cy.url().should('include', '/doacao');
    });

    it('should display donation steps', () => {
      cy.contains('Seleção de Campanha').should('be.visible');
      cy.contains('Valor e Frequência').should('be.visible');
      cy.contains('Método de Pagamento').should('be.visible');
      cy.contains('Pagamento').should('be.visible');
    });
  });

  describe('Step 1 - Campaign Selection', () => {
    it('should display direct donation button', () => {
      cy.getByTestId('direct-donation-button').should('be.visible');
    });

    it('should display campaign search/combobox', () => {
      cy.get('input[placeholder*="Pesquise"]').should('be.visible');
    });

    it('should allow direct donation to Pão dos Pobres', () => {
      cy.getByTestId('direct-donation-button').click();
      cy.wait(500);
      cy.contains('Valor e Frequência').parent().should('not.have.attr', 'disabled');
    });
  });

  describe('Step 2 - Value and Frequency', () => {
    beforeEach(() => {
      cy.getByTestId('direct-donation-button').click();
      cy.wait(500);
    });

    it('should display value input', () => {
      cy.get('input[placeholder*="0,00"]').should('be.visible');
    });

    it('should show anonymous user message about recurring donations', () => {
      cy.contains('Doação única').should('be.visible');
      cy.contains('Para realizar doações com recorrência').should('be.visible');
    });

    it('should not allow values below R$ 5,00', () => {
      cy.get('input[placeholder*="0,00"]').clear().type('3,00');
      cy.getByTestId('confirm-value-button').click();
      cy.wait(500);
      cy.contains('O valor mínimo para doação é de R$ 5,00').should('be.visible');
    });

    it('should accept valid donation value', () => {
      cy.get('input[placeholder*="0,00"]').clear().type('50,00');
      cy.getByTestId('confirm-value-button').click();
      cy.wait(500);
      cy.contains('Método de Pagamento').parent().should('not.have.attr', 'disabled');
    });
  });

  describe('Step 3 - Payment Method Selection', () => {
    beforeEach(() => {
      cy.getByTestId('direct-donation-button').click();
      cy.wait(500);
      cy.get('input[placeholder*="0,00"]').clear().type('50,00');
      cy.getByTestId('confirm-value-button').click();
      cy.wait(500);
    });

    it('should display payment method options', () => {
      cy.contains('Pix').should('be.visible');
      cy.contains('Boleto').should('be.visible');
      cy.contains('Crédito').should('be.visible');
    });

    it('should allow selecting Pix', () => {
      cy.contains('Pix').click();
      cy.wait(300);
      cy.getByTestId('confirm-payment-method-button').should('not.be.disabled');
    });

    it('should allow selecting Boleto', () => {
      cy.contains('Boleto').click();
      cy.wait(300);
      cy.getByTestId('confirm-payment-method-button').should('not.be.disabled');
    });

    it('should allow selecting Credit Card', () => {
      cy.contains('Crédito').click();
      cy.wait(300);
      cy.getByTestId('confirm-payment-method-button').should('not.be.disabled');
    });
  });

  describe('Complete Donation Flow - PIX', () => {
    it('should complete full donation with PIX', () => {
      cy.getByTestId('direct-donation-button').click();
      cy.wait(500);

      cy.get('input[placeholder*="0,00"]').clear().type('25,00');
      cy.getByTestId('confirm-value-button').click();
      cy.wait(500);

      cy.contains('Pix').click();
      cy.wait(300);
      cy.getByTestId('confirm-payment-method-button').click();
      cy.wait(500);

      cy.contains('Aguardando pagamento').should('be.visible');
      cy.contains('Doação criada com sucesso!').should('be.visible');

      cy.wait(4000);

      cy.getByTestId('back-home-button').should('not.be.disabled');
      cy.getByTestId('back-home-button').click();
      cy.wait(500);
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Complete Donation Flow - Boleto', () => {
    it('should complete full donation with Boleto', () => {
      cy.getByTestId('direct-donation-button').click();
      cy.wait(500);

      cy.get('input[placeholder*="0,00"]').clear().type('80,00');
      cy.getByTestId('confirm-value-button').click();
      cy.wait(500);

      cy.contains('Boleto').click();
      cy.wait(300);
      cy.getByTestId('confirm-payment-method-button').click();
      cy.wait(500);

      cy.contains('Aguardando pagamento').should('be.visible');
      cy.contains('button', 'Confirmar Pagamento').should('be.visible');
      cy.contains('button', 'Confirmar Pagamento').click();
      cy.wait(500);

      cy.getByTestId('back-home-button').should('not.be.disabled');
    });
  });

  describe('Complete Donation Flow - Credit Card', () => {
    it('should complete full donation with Credit Card', () => {
      cy.getByTestId('direct-donation-button').click();
      cy.wait(500);

      cy.get('input[placeholder*="0,00"]').clear().type('100,00');
      cy.getByTestId('confirm-value-button').click();
      cy.wait(500);

      cy.contains('Crédito').click();
      cy.wait(300);
      cy.getByTestId('confirm-payment-method-button').click();
      cy.wait(500);

      cy.get('input[placeholder*="0000 0000 0000 0000"]').type('4111111111111111');
      cy.get('input[placeholder*="Como impresso no cartão"]').type('TESTE USER');
      cy.get('input[placeholder*="MM/AA"]').type('12/28');
      cy.get('input[placeholder*="123"]').type('123');

      cy.contains('button', 'Confirmar').click();
      cy.contains('Doação criada com sucesso!').should('be.visible');
      cy.wait(4000);

      cy.getByTestId('back-home-button').should('not.be.disabled');
    });
  });
});
