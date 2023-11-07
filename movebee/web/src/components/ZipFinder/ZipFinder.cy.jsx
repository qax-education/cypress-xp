import React from 'react'
import ZipFinder from './ZipFinder'

describe('<ZipFinder />', () => {

  const noticeElement = '[data-cy=notice]'

  beforeEach(() => {
    cy.mount(
      <ZipFinder />
    )
    cy.get('[data-cy=inputCep]').as('inputCep')
    cy.get('[data-cy=submitCep]').as('submitCep')
  })

  it.only('cep é um campo obrigatório', () => {

    cy.get('@submitCep').click()

    cy.on('window:alert', (str) => {
      expect(str).to.equal(`Preencha algum CEP`)
    })

  })

  it('cep dentro da área de cobertura', () => {

    const address = {
      cep: "04534-011",
      logradouro: "Rua Joaquim Ventura",
      bairro: "Itaim Bibi",
      cidade_uf: "São Paulo/SP"
    }

    cy.intercept('GET', '/zipcode/*', {
      statusCode: 200,
      statusMessage: 'Success',
      body: address
    }).as('getCep');

    cy.get('@inputCep').type(address.cep)
    cy.get('@submitCep').click()

    cy.addressShouldBe(address)

  })

  it('cep fora da área de cobertura', ()=> {
    const address = {
      cep: "06150-000",
      message: 'deu ruim'
    }

    cy.get('@inputCep').type(address.cep)
    cy.get('@submitCep').click()

    cy.get(noticeElement)
      .should('be.visible')
      .should('have.text', 'No momento não atendemos essa região.')
  })

})


Cypress.Commands.add('addressShouldBe', (address) => {
  cy.get('[data-cy=logradouro]')
    .should('have.text', address.logradouro)

  cy.get('[data-cy=bairro]')
    .should('have.text', address.bairro)

  cy.get('[data-cy=cidade_uf]')
    .should('have.text', address.cidade_uf)

  cy.get('[data-cy=cep]')
    .should('have.text', address.cep)
})