Cypress.Commands.add('openOrphanage', (name) => {

    const popup = '.leaflet-popup-content'

    cy.goto('/map')

    cy.get('.leaflet-marker-pane .leaflet-marker-icon').as('mapList')

    cy.get('@mapList').each((ele, index, list) => {

        cy.get('@mapList')
            .eq(index)
            .click({ force: true })
        cy.wait(1000)

        cy.get(popup).as('divName')

        cy.get('@divName')
            .invoke('text')
            .then((txt) => {
                cy.log(txt)
                if (txt === name) {
                    cy.get('@mapList').eq(index).as('foundItem')
                }
            })
    })

    cy.get('@foundItem')
        .click({ force: true })

    cy.contains(popup, name).find('a').click()
})