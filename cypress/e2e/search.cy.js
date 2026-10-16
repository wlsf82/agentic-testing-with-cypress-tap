describe('Search', () => {
  beforeEach(() => {
    cy.visit('/')

    cy.get('input[placeholder="Search emojis..."]').as('search')
  })

  it('has a search box with the placeholder "Search emojis..."', () => {
    cy.get('@search').should('be.visible')
  })

  context('Matching', () => {
    it('finds an emoji by its name', () => {
      cy.get('@search').type('Sparkling')

      cy.contains('[data-testid="emoji-card"]', 'Sparkling Heart').should('be.visible')
    })

    it('finds an emoji by its description', () => {
      cy.get('@search').type('space')

      cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
    })

    it('finds a capitalized name with a lowercase query', () => {
      cy.get('@search').type('sparkling')

      cy.contains('[data-testid="emoji-card"]', 'Sparkling Heart').should('be.visible')
    })

    it('finds a name with an uppercase query', () => {
      cy.get('@search').type('SPARKLING')

      cy.contains('[data-testid="emoji-card"]', 'Sparkling Heart').should('be.visible')
    })

    it('finds a name with a mixed-case query', () => {
      cy.get('@search').type('sPaRkLiNg')

      cy.contains('[data-testid="emoji-card"]', 'Sparkling Heart').should('be.visible')
    })

    it('finds a description with an uppercase query', () => {
      cy.get('@search').type('SPACE')

      cy.contains('[data-testid="emoji-card"]', 'Rocket').should('be.visible')
    })
  })

  context('Results', () => {
    it('shows only the emojis that match', () => {
      cy.get('@search').type('yellow')

      cy.get('[data-testid="emoji-card"]').should('have.length', 2)
      cy.contains('[data-testid="emoji-card"]', 'Smiling Face').should('be.visible')
      cy.contains('[data-testid="emoji-card"]', 'Glowing Star').should('be.visible')
    })

    it('shows every emoji again when the search is cleared', () => {
      cy.get('@search').type('space')
      cy.get('[data-testid="emoji-card"]').should('have.length', 1)

      cy.get('@search').clear()

      cy.get('[data-testid="emoji-card"]').should('have.length', 6)
    })

    it('shows "No emojis found" when nothing matches', () => {
      cy.get('@search').type('xyzzy')

      // Fails on purpose: the app shows no message when nothing matches (test plan Q8).
      cy.contains('No emojis found').should('be.visible')
    })
  })
})
