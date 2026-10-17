const validCheckout = {
  email: 'shopper@example.com',
  name: 'Test Shopper',
  address: '123 Test Street',
  city: 'Testville',
  country: 'Testland',
  cardNumber: '1234 5678 9012 3456',
  expiryDate: '12/30',
  cvv: '123',
}

const fillCheckout = (overrides = {}) => {
  const data = { ...validCheckout, ...overrides }

  Object.keys(data).forEach((id) => {
    cy.get(`#${id}`).type(data[id])
  })
}

describe('Checkout', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.goToCheckout()
  })

  context('Opening', () => {
    it('opens from a cart that is not empty with "Proceed to Checkout"', () => {
      cy.contains('h3', 'Contact Information').should('be.visible')
      cy.contains('button', 'Complete Purchase').should('be.visible')
    })
  })

  context('Fields', () => {
    const sections = {
      'Contact Information': { Email: 'email', 'Full Name': 'name' },
      'Shipping Address': { 'Street Address': 'address', City: 'city', Country: 'country' },
      'Payment Information': { 'Card Number': 'cardNumber', 'Expiry Date': 'expiryDate', CVV: 'cvv' },
    }

    it('asks for contact information, a shipping address, and payment information', () => {
      Object.keys(sections).forEach((section) => {
        cy.contains('div', section).within(() => {
          cy.contains('h3', section).should('be.visible')

          Object.keys(sections[section]).forEach((label) => {
            const id = sections[section][label]

            cy.contains('label', label)
              .should('be.visible')
              .and('have.attr', 'for', id)
            cy.get(`#${id}`).should('be.visible')
          })
        })
      })
    })

    it('requires every field', () => {
      Object.keys(validCheckout).forEach((id) => {
        cy.get(`#${id}`).should('have.attr', 'required')
      })
    })

    it('asks for an email address', () => {
      cy.get('#email').should('have.attr', 'type', 'email')
    })
  })

  context('Validation', () => {
    const invalidFields = [
      { description: 'a card number without 16 digits', id: 'cardNumber', label: 'Card Number', value: '1234 5678 9012' },
      { description: 'an expiry date not in the format MM/YY', id: 'expiryDate', label: 'Expiry Date', value: '1230' },
      { description: 'an expiry date in the past', id: 'expiryDate', label: 'Expiry Date', value: '01/20' },
      { description: 'a CVV without 3 digits', id: 'cvv', label: 'CVV', value: '12' },
    ]

    invalidFields.forEach(({ description, id, label, value }) => {
      it(`does not complete the purchase with ${description}, and says what is wrong next to the field`, () => {
        fillCheckout({ [id]: value })

        cy.contains('button', 'Complete Purchase').click()

        // Fails on purpose: the app completes the purchase with an invalid value (test plan K5–K9).
        cy.contains('h3', 'Payment Information').should('be.visible')
        cy.contains('h1', 'Thank You for Your Purchase!').should('not.exist')
        // The requirement names no message text, so the field's group must show more than its label.
        cy.get(`#${id}`)
          .parent()
          .should('not.have.text', label)
      })
    })
  })

  context('Total', () => {
    it('shows the cart\'s total, labelled "Total Amount:"', () => {
      // The label and the amount are two spans in one element.
      cy.contains('div', 'Total Amount:').within(() => {
        cy.contains('span', 'Total Amount:').should('be.visible')
        cy.contains('span', /^\$6\.99$/).should('be.visible')
      })
    })
  })

  context('Back to store', () => {
    it('returns to the store, with the cart as it was', () => {
      cy.contains('button', '← Back to store').click()

      cy.get('[data-testid="emoji-card"]').should('have.length', 6)
      cy.openCart()
      cy.get('[data-testid="cart-item"]').should('have.length', 1)
      cy.contains('[data-testid="cart-item"]', 'Rocket')
        .find('[data-testid="cart-item-counter"]')
        .should('have.text', '1')
    })
  })

  context('Completing a purchase', () => {
    it('completes the purchase when every field is valid, showing "Thank You for Your Purchase!"', () => {
      fillCheckout()

      cy.contains('button', 'Complete Purchase').click()

      cy.contains('h1', 'Thank You for Your Purchase!').should('be.visible')
    })
  })

  context('Thank-you page', () => {
    beforeEach(() => {
      fillCheckout()
      cy.contains('button', 'Complete Purchase').click()
      cy.contains('h1', 'Thank You for Your Purchase!').should('be.visible')
    })

    it('shows an order number made of uppercase letters and digits', () => {
      // The order number has no test id; it is the paragraph after its label.
      cy.contains('p', 'Order Number')
        .next('p')
        .should('be.visible')
        .invoke('text')
        .should('match', /^[A-Z0-9]+$/)
    })

    it('empties the cart', () => {
      cy.contains('button', 'Back to Store').click()

      cy.openCart()

      cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
    })

    it('returns to the store with "Back to Store"', () => {
      cy.contains('button', 'Back to Store').click()

      cy.get('[data-testid="emoji-card"]').should('have.length', 6)
    })
  })
})
