describe('Cart', () => {
  it('adds the Rocket to the cart', () => {
    cy.visit('/')

    cy.addToCart('Rocket')

    cy.openCart()
    cy.contains('[data-testid="cart-item"]', 'Rocket').should('be.visible')
  })
})
