describe('Exploring Emoji Mart', () => {
  it('opens the Rocket', () => {
    cy.visit('/')

    cy.contains('[data-testid="emoji-card"]', 'Rocket').click()

    cy.contains('button', '← Back to all emojis').should('be.visible')
  })
})
