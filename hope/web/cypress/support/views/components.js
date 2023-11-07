
Cypress.Commands.add('popupHaveText', (text) => {
    cy.get('.swal2-html-container')
        .should('be.visible')
        .should('have.text', text)
})

Cypress.Commands.add('alertHaveText', (label, text) => {
    cy.contains('label', label)
        .parent()
        .find('small')
        .should('have.text', text)
})

Cypress.Commands.add('googleMapLink', (position)=> {
    const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.latitude},${position.longitude}`

    cy.contains('a', 'Ver rotas no Google Maps')
        .should('have.attr', 'href', googleUrl)
})