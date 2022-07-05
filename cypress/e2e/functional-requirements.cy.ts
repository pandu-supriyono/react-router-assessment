describe('functional requirements', () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.login('uncinc', 'letmein');
  });

  it('should render the homepage on / as a regular user', () => {
    cy.visit('/');

    cy.get('h1').should('contain', 'Homepage');
  });

  it('should render the homepage on /home as a regular user', () => {
    cy.visit('/home');

    cy.get('h1').should('contain', 'Homepage');
  });

  it('should allow a regular user to login on /login to become a logged in user with username uncinc and password letmein', () => {
    cy.logout();

    cy.visit('/login');

    cy.get('#username').type('uncinc');

    cy.get('#password').type('letmein{enter}');

    cy.visit('/dashboard');

    cy.get('main')
      .contains(/welcome, uncinc/i)
      .should('exist');
  });

  it('should get a message if wrong credentials are entered', () => {
    cy.logout();

    cy.visit('/login');

    cy.get('#username-error').should('not.exist');

    cy.get('#username').type('uncinc');

    cy.get('#password').type('invalid-password{enter}');

    cy.url().should('eq', 'http://localhost:3000/login');

    cy.get('#username-error')
      .should('exist')
      .should('have.text', 'Invalid username or password');
  });

  it('should render /dashboard as a logged in user', () => {
    cy.visit('/dashboard');

    cy.get('main')
      .contains(/welcome, uncinc/i)
      .should('exist');
  });

  it('should render /dashboard from /home as a regular user', () => {
    cy.logout();

    cy.visit('/dashboard');

    cy.url().should('eq', 'http://localhost:3000/login');

    cy.visit('/home');

    cy.get('nav').contains('Dashboard').click();

    cy.get('main')
      .contains(
        /You are not logged in, but can access this page because you probably came from/i
      )
      .should('exist');
  });

  it('should redirect to /login when accessing a restricted page as a regular user', () => {
    cy.logout();

    cy.visit('/dashboard');

    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('should redirect from the login form to the page that the user originally wanted to go to', () => {
    cy.logout();

    cy.visit('/dashboard');

    cy.url().should('eq', 'http://localhost:3000/login');

    cy.get('#username').type('uncinc');

    cy.get('#password').type('letmein{enter}');

    cy.url().should('eq', 'http://localhost:3000/dashboard');
  });

  it('should remember the logged in session', () => {
    cy.visit('dashboard');

    cy.get('main')
      .contains(/welcome, uncinc/i)
      .should('exist');

    cy.reload();

    cy.get('main')
      .contains(/welcome, uncinc/i)
      .should('exist');
  });

  it('should allow a logged in user to log out', () => {
    cy.get('button').contains('Log out').should('exist');

    cy.get('button')
      .contains('Log out')
      .click()
      .should(() => {
        expect(localStorage.getItem('__unc_inc_access_token')).to.be.null;
      });

    cy.visit('/dashboard');

    cy.url().should('eq', 'http://localhost:3000/login');
  });
});
