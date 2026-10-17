// Every selector and text here was read with Cypress Tap (aria or dom)
// on the state each command acts on or leads to.

Cypress.Commands.add('getCartButton', () => {
  // The cart button has no accessible name and no test id.
  // Its lucide icon class is the only way to give it a meaning;
  // the header scope rules out the cards' "Add to Cart" buttons,
  // which have the same icon. Its text is the unit count, and an empty
  // cart shows none. See the finding in exploration/findings.md.
  cy.get('header button:has(.lucide-shopping-cart)').should('be.visible')
})

Cypress.Commands.add('addToCart', (name, quantity = 1) => {
  cy.getCartButton()
    .invoke('text')
    .then((count) => {
      cy.contains('[data-testid="emoji-card"]', name).within(() => {
        Cypress._.times(quantity, () => {
          cy.contains('button', 'Add to Cart').click()
        })
      })

      cy.getCartButton().should('have.text', `${Number(count) + quantity}`)
    })
})

Cypress.Commands.add('openEmojiPage', (name) => {
  cy.contains('[data-testid="emoji-card"]', name).within(() => {
    cy.contains('h3', name).click()
  })

  cy.contains('button', '← Back to all emojis').should('be.visible')
  cy.contains('h2', name).should('be.visible')
})

Cypress.Commands.add('search', (query) => {
  cy.get('input[placeholder="Search emojis..."]')
    .type(query)
    .should('have.value', query)
})

Cypress.Commands.add('openCart', () => {
  cy.getCartButton().click()

  cy.contains('h2', 'Your Cart').should('be.visible')
})

Cypress.Commands.add('closeCart', () => {
  // The close button has no accessible name and no test id.
  // Its lucide icon class is the only way to give it a meaning, and the
  // cart's title bar is the closest scope; see the finding in exploration/findings.md.
  cy.contains('div', 'Your Cart')
    .find('button:has(.lucide-x)')
    .click()

  cy.contains('h2', 'Your Cart').should('not.exist')
  cy.getCartButton().should('be.visible')
})

// The cart line's buttons have no accessible name and no test id.
// Their lucide icon class is the only way to give them a meaning;
// see the finding in exploration/findings.md.
const clickCartLineButton = (name, icon) => {
  cy.contains('[data-testid="cart-item"]', name)
    .find(`button:has(.lucide-${icon})`)
    .click()

  cy.contains('h2', 'Your Cart').should('be.visible')
}

Cypress.Commands.add('increaseQuantity', (name) => {
  clickCartLineButton(name, 'plus-circle')
})

Cypress.Commands.add('decreaseQuantity', (name) => {
  clickCartLineButton(name, 'minus-circle')
})

Cypress.Commands.add('removeFromCart', (name) => {
  clickCartLineButton(name, 'trash2')
})

Cypress.Commands.add('goToCheckout', () => {
  cy.openCart()
  cy.contains('button', 'Proceed to Checkout').click()

  cy.contains('button', 'Complete Purchase').should('be.visible')
})

Cypress.Commands.add('fillCheckout', (data) => {
  Object.keys(data).forEach((id) => {
    cy.get(`#${id}`)
      .type(data[id])
      .should('have.value', data[id])
  })
})

Cypress.Commands.add('completePurchase', (data) => {
  cy.fillCheckout(data)
  cy.contains('button', 'Complete Purchase').click()

  cy.contains('h1', 'Thank You for Your Purchase!').should('be.visible')
})
