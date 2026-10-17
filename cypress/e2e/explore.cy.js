describe('Exploring Emoji Mart', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('opens the Rocket', () => {
    cy.openEmojiPage('Rocket')
  })

  it('opens the empty cart', () => {
    cy.openCart()

    cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
  })

  it('opens the cart with the Rocket', () => {
    cy.addToCart('Rocket')

    cy.openCart()
  })

  it('opens the checkout', () => {
    cy.addToCart('Rocket')

    cy.goToCheckout()
  })

  it('completes a purchase', () => {
    cy.addToCart('Rocket')
    cy.goToCheckout()

    cy.completePurchase({
      email: 'shopper@example.com',
      name: 'Test Shopper',
      address: '123 Test Street',
      city: 'Testville',
      country: 'Testland',
      cardNumber: '1234 5678 9012 3456',
      expiryDate: '12/30',
      cvv: '123',
    })
    cy.contains('button', 'Back to Store').click()
    cy.openCart()

    cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
  })

  it('increases the quantity of a cart item', () => {
    cy.addToCart('Rocket')
    cy.openCart()

    cy.increaseQuantity('Rocket')

    cy.contains('[data-testid="cart-item"]', 'Rocket')
      .find('[data-testid="cart-item-counter"]')
      .should('have.text', '2')
  })

  it('decreases the quantity of a cart item from one', () => {
    cy.addToCart('Rocket')
    cy.openCart()

    cy.decreaseQuantity('Rocket')

    cy.contains('[data-testid="cart-item"]', 'Rocket')
      .find('[data-testid="cart-item-counter"]')
      .should('have.text', '1')
  })

  it('removes a cart item', () => {
    cy.addToCart('Rocket')
    cy.openCart()

    cy.removeFromCart('Rocket')

    cy.contains('[data-testid="empty-cart"]', 'Your cart is empty').should('be.visible')
  })

  it('closes the cart', () => {
    cy.openCart()

    cy.closeCart()
  })

  it('searches for an emoji', () => {
    cy.search('rock')

    cy.get('[data-testid="emoji-card"]').should('have.length', 1)
  })

  it('searches for an emoji that does not exist', () => {
    cy.search('xyzzy')

    cy.get('[data-testid="emoji-card"]').should('not.exist')
  })

  it('searches for a word in a description', () => {
    cy.search('space')

    cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
  })

  it('adds the Rocket from its page and goes back', () => {
    cy.openEmojiPage('Rocket')
    cy.contains('button', 'Add to Cart').click()
    cy.contains('button', '← Back to all emojis').click()

    cy.get('[data-testid="emoji-card"]').should('have.length', 6)
  })

  it('goes back to the store from the checkout', () => {
    cy.addToCart('Rocket')
    cy.goToCheckout()

    cy.contains('button', '← Back to store').click()

    cy.get('[data-testid="emoji-card"]').should('have.length', 6)
  })

  it('submits an empty checkout', () => {
    cy.addToCart('Rocket')
    cy.goToCheckout()

    cy.contains('button', 'Complete Purchase').click()

    cy.contains('h3', 'Contact Information').should('be.visible')
  })

  it('opens the cart with two different emojis', () => {
    cy.addToCart('Rocket')
    cy.addToCart('Rainbow')

    cy.openCart()

    cy.get('[data-testid="cart-item"]').should('have.length', 2)
  })
})
