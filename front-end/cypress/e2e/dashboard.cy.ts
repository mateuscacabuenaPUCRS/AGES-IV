describe('Dashboard - Admin', () => {
  const adminEmail = 'admin@email.com';
  const adminPassword = 'Password@1234';

  const selectOption = (selectId: string, optionValue: string) => {
    cy.getByTestId(`select-${selectId}`).click();
    cy.wait(300);
    cy.getByTestId(`select-option-${optionValue}`).click();
    cy.wait(300);
  };

  beforeEach(() => {
    cy.login(adminEmail, adminPassword);
    cy.wait(2000);
  });

  describe('Dashboard Access and Layout', () => {
    it('should load the dashboard page', () => {
      cy.url().should('include', '/dashboard');
    });

    it('should display dashboard title in sidebar', () => {
      cy.contains('Dashboard').should('be.visible');
    });

    it('should display metric cards', () => {
      cy.contains('Novos Doadores').should('be.visible');
      cy.contains('Doadores Recorrentes').should('be.visible');
      cy.contains('Doadores').should('be.visible');
      cy.contains('Arrecadado este mês').should('be.visible');
      cy.contains('Média de doação').should('be.visible');
    });

    it('should display initial chart placeholder', () => {
      cy.contains('Selecione os filtros e clique em "Buscar" para exibir um gráfico').should('be.visible');
    });
  });

  describe('Sidebar Toggle', () => {
    it('should close sidebar when clicking close button', () => {
      cy.get('aside button').first().click();
      cy.wait(500);
      cy.contains('label', 'Setor').should('not.be.visible');
    });

    it('should open sidebar when clicking open button', () => {
      cy.get('aside button').first().click();
      cy.wait(500);
      cy.get('section button').contains('Dashboard').click();
      cy.wait(500);
      cy.contains('label', 'Setor').should('be.visible');
    });
  });

  describe('Filter Selection - Financeiro Sector', () => {
    it('should display sector filter dropdown', () => {
      cy.getByTestId('select-sector-filter').should('be.visible');
    });

    it('should select Financeiro sector', () => {
      selectOption('sector-filter', 'financeiro');
      cy.contains('Ver estatísticas de doações').should('be.visible');
    });

    it('should enable Métrica 1 after selecting sector', () => {
      selectOption('sector-filter', 'financeiro');
      cy.getByTestId('select-metric1-filter').should('not.be.disabled');
    });

    it('should select Total in Métrica 1', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      cy.contains('Para ver o total daquela métrica').should('be.visible');
    });

    it('should enable Métrica 2 after selecting Métrica 1', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      cy.getByTestId('select-metric2-filter').should('not.be.disabled');
    });

    it('should complete filter selection: Financeiro > Total > Valor', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      selectOption('metric2-filter', 'valor');
      cy.contains('Para ver as estatísticas de valores em reais').should('be.visible');
    });
  });

  describe('Filter Selection - Operacional Sector', () => {
    it('should select Operacional sector', () => {
      selectOption('sector-filter', 'operacional');
      cy.contains('Ver estatísticas a cerca dos doadores').should('be.visible');
    });

    it('should complete filter selection: Operacional > Doadores > Idade', () => {
      selectOption('sector-filter', 'operacional');
      selectOption('metric1-filter', 'doadores');
      selectOption('metric2-filter', 'idade');
      cy.contains('Estatísticas sobre a idade dos doadores').should('be.visible');
    });

    it('should complete filter selection: Operacional > Doadores > Gênero', () => {
      selectOption('sector-filter', 'operacional');
      selectOption('metric1-filter', 'doadores');
      selectOption('metric2-filter', 'genero');
      cy.contains('Estatística a cerca do gênero dos doadores').should('be.visible');
    });
  });

  describe('Date Period Picker', () => {
    it('should display period picker when not using campaign filter', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      selectOption('metric2-filter', 'valor');
      cy.contains('label', 'Período').should('be.visible');
    });

    it('should open date picker when clicking on it', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      selectOption('metric2-filter', 'valor');
      cy.getByTestId('date-range-picker-period-filter').click();
      cy.wait(500);
      cy.getByTestId('calendar-day-1').should('be.visible');
    });
  });

  describe('Campaign Filter', () => {
    it('should show campaign filter checkbox for Financeiro > Método', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'metodo');
      cy.contains('Opcional: Filtrar por Campanha').should('be.visible');
    });

    it('should enable campaign search when checking the checkbox', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'metodo');
      selectOption('metric2-filter', 'quantidade');
      cy.get('#campaign-filter').click();
      cy.wait(500);
      cy.get('input[placeholder="Digite para buscar..."]').should('not.be.disabled');
    });

    it('should hide period picker when using campaign filter', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'metodo');
      cy.get('#campaign-filter').click();
      cy.wait(500);
      cy.contains('label', 'Período').should('not.exist');
    });
  });

  describe('Clear and Search Buttons', () => {
    it('should have Limpar button disabled initially', () => {
      cy.contains('button', 'Limpar').should('be.disabled');
    });

    it('should have Buscar button disabled initially', () => {
      cy.contains('button', 'Buscar').should('be.disabled');
    });

    it('should enable Limpar button after selecting filters', () => {
      selectOption('sector-filter', 'financeiro');
      cy.contains('button', 'Limpar').should('not.be.disabled');
    });

    it('should clear all filters when clicking Limpar', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      cy.contains('button', 'Limpar').click();
      cy.wait(500);
      cy.getByTestId('select-sector-filter').should('contain', 'Selecione');
    });

    it('should enable Buscar button when all required filters are selected', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      selectOption('metric2-filter', 'valor');
      cy.getByTestId('date-range-picker-period-filter').click();
      cy.wait(500);
      
      cy.getByTestId('calendar-day-10').click();
      cy.wait(300);
      cy.getByTestId('calendar-day-25').click();
      cy.wait(500);
      cy.get('body').click(0, 0);
      cy.wait(300);
      
      cy.contains('button', 'Buscar').should('not.be.disabled');
    });
  });

  describe('Chart Display', () => {
    it('should display chart after clicking Buscar with valid filters', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      selectOption('metric2-filter', 'valor');
      
      cy.getByTestId('date-range-picker-period-filter').click();
      cy.wait(500);
      cy.getByTestId('calendar-day-10').click();
      cy.wait(300);
      cy.getByTestId('calendar-day-25').click();
      cy.wait(500);
      cy.get('body').click(0, 0);
      cy.wait(300);
      
      cy.contains('button', 'Buscar').click();
      cy.wait(2000);
      
      cy.contains('Selecione os filtros e clique em "Buscar" para exibir um gráfico').should('not.exist');
    });

    it('should clear chart when changing filters', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'total');
      selectOption('metric2-filter', 'valor');
      
      cy.getByTestId('date-range-picker-period-filter').click();
      cy.wait(500);
      cy.getByTestId('calendar-day-10').click();
      cy.wait(300);
      cy.getByTestId('calendar-day-25').click();
      cy.wait(500);
      cy.get('body').click(0, 0);
      cy.wait(300);
      
      cy.contains('button', 'Buscar').click();
      cy.wait(2000);
      
      selectOption('sector-filter', 'operacional');
      
      cy.contains('Selecione os filtros e clique em "Buscar" para exibir um gráfico').should('be.visible');
    });
  });

  describe('Complete Workflows', () => {
    it('should complete workflow: Financeiro > Método > Quantidade with period', () => {
      selectOption('sector-filter', 'financeiro');
      selectOption('metric1-filter', 'metodo');
      selectOption('metric2-filter', 'quantidade');
      
      cy.getByTestId('date-range-picker-period-filter').click();
      cy.wait(500);
      cy.getByTestId('calendar-day-10').click();
      cy.wait(300);
      cy.getByTestId('calendar-day-25').click();
      cy.wait(500);
      cy.get('body').click(0, 0);
      cy.wait(300);
      
      cy.contains('button', 'Buscar').should('not.be.disabled');
      cy.contains('button', 'Buscar').click();
      cy.wait(2000);
    });

    it('should complete workflow: Operacional > Doadores > Gênero with period', () => {
      selectOption('sector-filter', 'operacional');
      selectOption('metric1-filter', 'doadores');
      selectOption('metric2-filter', 'genero');
      
      cy.getByTestId('date-range-picker-period-filter').click();
      cy.wait(500);
      cy.getByTestId('calendar-day-10').click();
      cy.wait(300);
      cy.getByTestId('calendar-day-25').click();
      cy.wait(500);
      cy.get('body').click(0, 0);
      cy.wait(300);
      
      cy.contains('button', 'Buscar').should('not.be.disabled');
      cy.contains('button', 'Buscar').click();
      cy.wait(2000);
    });
  });
});
