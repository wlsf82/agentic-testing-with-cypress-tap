const addToCart = (name, times = 1) => {
  cy.contains('[data-testid="emoji-card"]', name).within(() => {
    Cypress._.times(times, () => {
      cy.contains('button', 'Add to Cart').click()
    })
  })
}

describe('Cart', () => {
  beforeEach(() => {
    cy.visit('/')

    // The cart button has no accessible name and no test id.
    // Its lucide icon class is the only way to give it a meaning;
    // see the finding in exploration/findings.md. Its text is the unit count.
    cy.get('header button:has(.lucide-shopping-cart)').as('cartButton')
  })

  context('Adding', () => {
    it('adds one unit of an emoji', () => {
      addToCart('Rocket')

      cy.openCart()

      cy.contains('[data-testid="cart-item"]', 'Rocket')
        .find('[data-testid="cart-item-counter"]')
        .should('have.text', '1')
    })

    it('increases the quantity of an emoji already in the cart instead of adding a second line', () => {
      addToCart('Rocket', 2)

      cy.openCart()

      cy.get('[data-testid="cart-item"]').should('have.length', 1)
      cy.contains('[data-testid="cart-item"]', 'Rocket')
        .find('[data-testid="cart-item-counter"]')
        .should('have.text', '2')
    })
  })

  context('Cart icon', () => {
    it('counts each unit of each emoji', () => {
      addToCart('Rocket', 2)
      addToCart('Rainbow')

      cy.get('@cartButton').should('have.text', '3')
    })

    it('shows a two-digit unit count', () => {
      addToCart('Rocket', 10)

      cy.get('@cartButton').should('have.text', '10')
    })

    it('opens the cart, titled "Your Cart"', () => {
      cy.get('@cartButton').click()

      cy.contains('h2', 'Your Cart').should('be.visible')
    })

    it('opens the cart from an emoji\'s page', () => {
      cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
        cy.contains('h3', 'Rocket').click()
      })
      cy.contains('button', '← Back to all emojis').should('be.visible')

      cy.get('@cartButton').click()

      cy.contains('h2', 'Your Cart').should('be.visible')
    })
  })

  context('Lines', () => {
    it('shows the emoji, its price, and its quantity', () => {
      addToCart('Rocket')

      cy.openCart()

      cy.contains('[data-testid="cart-item"]', 'Rocket').within(() => {
        cy.contains('span', '🚀').should('be.visible')
        cy.contains('h3', 'Rocket').should('be.visible')
        cy.contains('p', '$6.99').should('be.visible')
        cy.get('[data-testid="cart-item-counter"]')
          .should('be.visible')
          .and('have.text', '1')
      })
    })

    context('Buttons', () => {
      beforeEach(() => {
        addToCart('Rocket', 2)
        addToCart('Rainbow')
        cy.openCart()

        cy.contains('[data-testid="cart-item"]', 'Rocket').as('rocketLine')
      })

      it('adds one unit with plus', () => {
        // The plus button has no accessible name and no test id.
        // Its lucide icon class is the only way to give it a meaning;
        // see the finding in exploration/findings.md.
        cy.get('@rocketLine')
          .find('button:has(.lucide-plus-circle)')
          .click()

        cy.get('@rocketLine')
          .find('[data-testid="cart-item-counter"]')
          .should('have.text', '3')
      })

      it('takes one unit away with minus', () => {
        // The minus button has no accessible name and no test id.
        // Its lucide icon class is the only way to give it a meaning;
        // see the finding in exploration/findings.md.
        cy.get('@rocketLine')
          .find('button:has(.lucide-minus-circle)')
          .click()

        cy.get('@rocketLine')
          .find('[data-testid="cart-item-counter"]')
          .should('have.text', '1')
      })

      it('removes the item when minus is pressed at quantity 1', () => {
        // The minus button has no accessible name and no test id.
        // Its lucide icon class is the only way to give it a meaning;
        // see the finding in exploration/findings.md.
        cy.contains('[data-testid="cart-item"]', 'Rainbow')
          .find('button:has(.lucide-minus-circle)')
          .click()

        cy.contains('[data-testid="cart-item"]', 'Rocket').should('be.visible')
        // Fails on purpose: minus at quantity 1 leaves the item in the cart (test plan C9).
        cy.contains('[data-testid="cart-item"]', 'Rainbow').should('not.exist')
      })

      it('takes the whole line out with the remove button', () => {
        // The remove button has no accessible name and no test id.
        // Its lucide icon class is the only way to give it a meaning;
        // see the finding in exploration/findings.md.
        cy.get('@rocketLine')
          .find('button:has(.lucide-trash2)')
          .click()

        cy.contains('[data-testid="cart-item"]', 'Rainbow').should('be.visible')
        cy.contains('[data-testid="cart-item"]', 'Rocket').should('not.exist')
      })
    })
  })

  context('Total', () => {
    it('shows the sum of each line\'s price times its quantity, labelled "Total:"', () => {
      addToCart('Rocket', 2)
      addToCart('Rainbow')

      cy.openCart()

      // The label and the amount are two spans in one element.
      cy.contains('div', 'Total:').within(() => {
        cy.contains('span', 'Total:').should('be.visible')
        cy.contains('span', /^\$19\.97$/).should('be.visible')
      })
    })
  })

  context('Empty cart', () => {
    it('shows "Your cart is empty"', () => {
      cy.openCart()

      cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
    })
  })

  context('Keeping the contents', () => {
    it('closes without changing its contents', () => {
      addToCart('Rocket', 2)
      cy.openCart()

      // The close button has no accessible name and no test id.
      // Its lucide icon class is the only way to give it a meaning, and the
      // cart's title bar is the closest scope; see the finding in exploration/findings.md.
      cy.contains('div', 'Your Cart')
        .find('button:has(.lucide-x)')
        .click()

      cy.get('@cartButton').should('have.text', '2')
      cy.contains('h2', 'Your Cart').should('not.exist')
      cy.openCart()
      cy.contains('[data-testid="cart-item"]', 'Rocket')
        .find('[data-testid="cart-item-counter"]')
        .should('have.text', '2')
    })

    it('keeps its contents when the page is reloaded', () => {
      addToCart('Rocket')
      cy.get('@cartButton').should('have.text', '1')

      cy.reload()

      cy.openCart()
      // Fails on purpose: a reload empties the cart (test plan C14).
      cy.contains('[data-testid="cart-item"]', 'Rocket')
        .find('[data-testid="cart-item-counter"]')
        .should('have.text', '1')
    })
  })
})
