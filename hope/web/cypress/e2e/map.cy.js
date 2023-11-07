
import data from '../fixtures/orphanages.json'

describe('Mapa', () => {

    it('deve escolher um orfanato no mapa', () => {
        const orphanage = data.map

        cy.deleteMany({ name: orphanage.name }, { collection: 'orphanages' })
        cy.postOrphanage(orphanage)

        cy.openOrphanage(orphanage.name)

        cy.contains('h1', orphanage.name)
            .should('be.visible')

        cy.googleMapLink(orphanage.position)
    })
})
