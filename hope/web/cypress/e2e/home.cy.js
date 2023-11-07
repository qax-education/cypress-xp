describe('home spec', () => {
  it('hope web deve estar online', () => {
    cy.visit('/')

    cy.get('h1')
      .should('have.text', 'Semeando esperança, colhendo sorrisos')
  })
})