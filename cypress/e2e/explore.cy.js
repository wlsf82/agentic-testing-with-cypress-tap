describe('Exploring Emoji Mart', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('opens the Rocket', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').click()

    cy.contains('button', '← Back to all emojis').should('be.visible')
  })

  it('opens the empty cart', () => {
    // The cart button has no accessible name and no test id.
    // It is the only button in the header.
    cy.get('header button').click()

    cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
  })

  it('opens the cart with the Rocket', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()

    cy.contains('h2', 'Your Cart').should('be.visible')
  })

  it('opens the checkout', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()
    cy.contains('button', 'Proceed to Checkout').click()

    cy.contains('button', 'Complete Purchase').should('be.visible')
  })

  it('completes a purchase', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()
    cy.contains('button', 'Proceed to Checkout').click()

    cy.get('#email').type('shopper@example.com')
    cy.get('#name').type('Test Shopper')
    cy.get('#address').type('123 Example Street')
    cy.get('#city').type('Testville')
    cy.get('#country').type('Testland')
    cy.get('#cardNumber').type('4111 1111 1111 1111')
    cy.get('#expiryDate').type('12/30')
    cy.get('#cvv').type('123')
    cy.contains('button', 'Complete Purchase').click()

    cy.contains('h1', 'Thank You for Your Purchase!').should('be.visible')
    cy.contains('button', 'Back to Store').click()
    cy.get('header button').click()

    cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
  })

  it('increases the quantity of a cart item', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()

    // The cart item's buttons have no accessible name and no test id.
    // The icon's class is the only thing that tells them apart.
    cy.contains('[data-testid="cart-item"]', 'Rocket')
      .find('button:has(.lucide-plus-circle)')
      .click()

    cy.contains('[data-testid="cart-item"]', 'Rocket')
      .find('[data-testid="cart-item-counter"]')
      .should('have.text', '2')
  })

  it('decreases the quantity of a cart item from one', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()

    // The cart item's buttons have no accessible name and no test id.
    // The icon's class is the only thing that tells them apart.
    cy.contains('[data-testid="cart-item"]', 'Rocket')
      .find('button:has(.lucide-minus-circle)')
      .click()

    cy.contains('[data-testid="cart-item"]', 'Rocket')
      .find('[data-testid="cart-item-counter"]')
      .should('have.text', '1')
  })

  it('removes a cart item', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()

    // The cart item's buttons have no accessible name and no test id.
    // The icon's class is the only thing that tells them apart.
    cy.contains('[data-testid="cart-item"]', 'Rocket')
      .find('button:has(.lucide-trash2)')
      .click()

    cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
  })

  it('closes the cart', () => {
    cy.get('header button').click()

    // The close button has no accessible name and no test id.
    // The icon's class is the only thing that says what it is.
    cy.get('button:has(.lucide-x)').click()

    cy.contains('h2', 'Your Cart').should('not.exist')
  })

  it('searches for an emoji', () => {
    cy.get('input[placeholder="Search emojis..."]').type('rock')

    cy.get('[data-testid="emoji-card"]').should('have.length', 1)
  })

  it('searches for an emoji that does not exist', () => {
    cy.get('input[placeholder="Search emojis..."]').type('xyzzy')

    cy.get('[data-testid="emoji-card"]').should('not.exist')
  })

  it('searches for a word in a description', () => {
    cy.get('input[placeholder="Search emojis..."]').type('space')

    cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
  })

  it('adds the Rocket from its page and goes back', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').click()
    cy.contains('button', 'Add to Cart').click()
    cy.contains('button', '← Back to all emojis').click()

    cy.get('[data-testid="emoji-card"]').should('have.length', 6)
  })

  it('goes back to the store from the checkout', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()
    cy.contains('button', 'Proceed to Checkout').click()
    cy.contains('button', '← Back to store').click()

    cy.get('[data-testid="emoji-card"]').should('have.length', 6)
  })

  it('submits an empty checkout', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()
    cy.contains('button', 'Proceed to Checkout').click()
    cy.contains('button', 'Complete Purchase').click()

    cy.contains('h3', 'Contact Information').should('be.visible')
  })

  it('opens the cart with two different emojis', () => {
    cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.contains('[data-testid="emoji-card"]', 'Rainbow').within(() => {
      cy.contains('button', 'Add to Cart').click()
    })
    cy.get('header button').click()

    cy.get('[data-testid="cart-item"]').should('have.length', 2)
  })
})
