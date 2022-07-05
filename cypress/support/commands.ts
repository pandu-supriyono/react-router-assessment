Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('#username').type(username);
  cy.get('#password').type(`${password}{enter}`);
  cy.url().should('eq', 'http://localhost:3000/');
});

Cypress.Commands.add('logout', () => {
  cy.clearLocalStorage();
});
