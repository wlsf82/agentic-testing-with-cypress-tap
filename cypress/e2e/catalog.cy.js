// The requirements list the names and prices, not the symbols.
// The symbols are the ones the app shows, read with Cypress Tap.
const emojis = [
  { symbol: '😊', name: 'Smiling Face', price: '$4.99' },
  { symbol: '🚀', name: 'Rocket', price: '$6.99' },
  { symbol: '🌈', name: 'Rainbow', price: '$5.99' },
  { symbol: '💖', name: 'Sparkling Heart', price: '$3.99' },
  { symbol: '🎮', name: 'Game Controller', price: '$7.99' },
  { symbol: '🌟', name: 'Glowing Star', price: '$4.99' },
]

describe('Catalog', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  context('Store', () => {
    it('shows the store name at the top of the page', () => {
      cy.contains('header h1', 'EmojiMart').should('be.visible')
    })

    it('sells six emojis', () => {
      cy.get('[data-testid="emoji-card"]').should('have.length', 6)
    })

    emojis.forEach(({ symbol, name, price }) => {
      it(`shows the ${name} with its symbol, name, description, price, and an "Add to Cart" button`, () => {
        cy.contains('[data-testid="emoji-card"]', name).within(() => {
          cy.contains('div', symbol).should('be.visible')
          cy.contains('h3', name).should('be.visible')
          // The parts of a card have no test id.
          // Its only p is the description, and its only span is the price.
          cy.get('p').should('be.visible').and('not.be.empty')
          cy.get('span').should('be.visible').and('have.text', price)
          cy.contains('button', 'Add to Cart').should('be.visible')
        })
      })
    })

    it('shows every price with a dollar sign and two decimal places', () => {
      // The price has no test id. It is the only span in each card.
      cy.get('[data-testid="emoji-card"] span')
        .should('have.length', 6)
        .each(($price) => {
          expect($price.text()).to.match(/^\$\d+\.\d{2}$/)
        })
    })
  })

  context('An emoji\'s page', () => {
    it('opens the Rocket\'s page by clicking its symbol', () => {
      cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
        cy.contains('div', '🚀').click()
      })

      cy.contains('button', '← Back to all emojis').should('be.visible')
      cy.contains('h2', 'Rocket').should('be.visible')
    })

    it('opens the Rocket\'s page by clicking its name', () => {
      cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
        cy.contains('h3', 'Rocket').click()
      })

      cy.contains('button', '← Back to all emojis').should('be.visible')
      cy.contains('h2', 'Rocket').should('be.visible')
    })

    it('opens the Rocket\'s page by clicking its description', () => {
      cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
        // The description has no test id. It is the only p in the card.
        cy.get('p').click()
      })

      cy.contains('button', '← Back to all emojis').should('be.visible')
      cy.contains('h2', 'Rocket').should('be.visible')
    })

    emojis
      .filter(({ name }) => name !== 'Rocket')
      .forEach(({ symbol, name, price }) => {
        it(`opens the ${name}'s own page`, () => {
          cy.contains('[data-testid="emoji-card"]', name).within(() => {
            // The description has no test id. It is the only p in the card.
            cy.get('p')
              .invoke('text')
              .as('description', { type: 'static' })
            cy.contains('h3', name).click()
          })

          cy.contains('button', '← Back to all emojis').should('be.visible')
          cy.contains('h2', name).should('be.visible')
          cy.contains('div', symbol).should('be.visible')
          cy.get('@description').then((description) => {
            cy.contains('p', description).should('be.visible')
          })
          cy.contains('span', price).should('be.visible')
        })
      })

    context('The Rocket\'s page', () => {
      beforeEach(() => {
        cy.contains('[data-testid="emoji-card"]', 'Rocket').within(() => {
          // The description has no test id. It is the only p in the card.
          cy.get('p')
            .invoke('text')
            .as('description', { type: 'static' })
          cy.contains('h3', 'Rocket').click()
        })

        cy.contains('button', '← Back to all emojis').should('be.visible')
      })

      it('shows the Rocket\'s symbol, name, description, and price', () => {
        cy.contains('div', '🚀').should('be.visible')
        cy.contains('h2', 'Rocket').should('be.visible')
        cy.get('@description').then((description) => {
          cy.contains('p', description).should('be.visible')
        })
        cy.contains('span', '$6.99').should('be.visible')
      })

      it('adds the Rocket to the cart', () => {
        cy.contains('button', 'Add to Cart').click()

        // The cart button has no accessible name and no test id.
        // Its shopping cart icon is the only thing that says what it is;
        // the header scope rules out the cards' "Add to Cart" buttons,
        // which have the same icon. Its text is the unit count.
        cy.get('header button:has(.lucide-shopping-cart)')
          .should('have.text', '1')
          .click()

        cy.contains('h2', 'Your Cart').should('be.visible')
        cy.contains('[data-testid="cart-item"]', 'Rocket').should('be.visible')
      })

      it('returns to the store', () => {
        cy.contains('button', '← Back to all emojis').click()

        cy.get('[data-testid="emoji-card"]').should('have.length', 6)
        cy.contains('button', '← Back to all emojis').should('not.exist')
      })
    })
  })
})
