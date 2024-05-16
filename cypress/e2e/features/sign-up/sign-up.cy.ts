describe('SignUpComponent', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should successfully sign up', () => {
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="password"]').type('Password123');

    cy.get('button[type="submit"]').click();

    cy.contains('Sign up was successful').should('be.visible');
  });

  it('should display full name after filling in first name and last name', () => {
    const firstName = 'John';
    const lastName = 'Doe';

    cy.get('input[formControlName="firstName"]').type(firstName);
    cy.get('input[formControlName="lastName"]').type(lastName);

    cy.get('p')
      .contains(`Full Name: ${firstName} ${lastName}`)
      .should('be.visible');
  });

  it('should display error message for various invalid emails', () => {
    const invalidEmails = [
      'invalid-email',
      'invalid@domain',
      'invalid@domain.',
      'invalid@domain@domain.com',
    ];

    invalidEmails.forEach(invalidEmail => {
      cy.get('input[formControlName="email"]')
        .clear()
        .type(invalidEmail)
        .blur();

      cy.get('mat-error').should('be.visible').contains('Invalid email format');
    });
  });

  it('should display error message when password too short', () => {
    const invalidPassword = 'Short';

    cy.get('input[formControlName="password"]').type(invalidPassword);
    cy.get('mat-card').click();

    cy.get('mat-error')
      .should('be.visible')
      .contains('Password should have minimum length of 8 characters');
  });

  it('should display error message when password has no upper case', () => {
    const invalidPassword = 'nouppercase';

    cy.get('input[formControlName="password"]').type(invalidPassword);
    cy.get('mat-card').click();

    cy.get('mat-error')
      .should('be.visible')
      .contains('Password should have contain at least one upper case letter');
  });

  it('should display error message when password has no lower case', () => {
    const invalidPassword = 'NOLOWERCASE';

    cy.get('input[formControlName="password"]').type(invalidPassword);
    cy.get('mat-card').click();

    cy.get('mat-error')
      .should('be.visible')
      .contains('Password should have contain at least one lower case letter');
  });

  it('should display error message when password contains first name', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const invalidPassword = 'John123!';

    cy.get('input[formControlName="firstName"]').type(firstName);
    cy.get('input[formControlName="lastName"]').type(lastName);
    cy.get('input[formControlName="password"]').type(invalidPassword);
    cy.get('mat-card').click();

    cy.get('mat-error')
      .should('be.visible')
      .contains(`Password should not contain first name ${firstName}`);
  });

  it('should display error message when password contains last name', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const invalidPassword = 'doeJ123!';

    cy.get('input[formControlName="firstName"]').type(firstName);
    cy.get('input[formControlName="lastName"]').type(lastName);
    cy.get('input[formControlName="password"]').type(invalidPassword);
    cy.get('mat-card').click();

    cy.get('mat-error')
      .should('be.visible')
      .contains(`Password should not contain last name ${lastName}`);
  });

  it('should display error message when sign up request fails', () => {
    cy.intercept('POST', '**/users', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
      delay: 1000,
    }).as('signUpRequest');

    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john@example.com');
    cy.get('input[formControlName="password"]').type('Password123');

    cy.get('button[type="submit"]').click();

    cy.wait('@signUpRequest');

    cy.get('mat-error')
      .should('be.visible')
      .contains('Sign up failed for some reason');
  });
});
