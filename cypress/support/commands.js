// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('openCart', () => {
  // The cart button has no accessible name and no test id.
  // Its lucide icon class is the only way to give it a meaning;
  // the header scope rules out the cards' "Add to Cart" buttons,
  // which have the same icon. See the finding in exploration/findings.md.
  cy.get('header button:has(.lucide-shopping-cart)').click()

  cy.contains('h2', 'Your Cart').should('be.visible')
})

Cypress.Commands.add('goToCheckout', () => {
  cy.openCart()
  cy.contains('button', 'Proceed to Checkout').click()

  cy.contains('button', 'Complete Purchase').should('be.visible')
})
