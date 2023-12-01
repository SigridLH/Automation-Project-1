beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */
describe('Visual tests for registration form 3', () => {

    it('Check that logo is correct and has correct size', () => {
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        cy.get('[data-testid="picture"]').should('have.attr','width', 178)
        cy.get('[data-testid="picture"]').should('have.attr','height', 166) 
    })

    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)

        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never').and('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Country dropdown is correct', () => {

        cy.get('#country').find('option').should('have.length', 4)

        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')

        cy.get('#country').select('Spain')
        cy.get('#city').should('not.be.disabled')
        cy.get('#city').find('option').should('have.length', 5)
        cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')

        })

        it('Dependency of country and city dropdown lists', () => {

            cy.get('#country').select('')
            cy.get('#city').should('be.disabled')

            cy.get('#country').select('Spain')
            cy.get('#city').should('not.be.disabled')
            cy.get('#city').find('option').should('have.length', 5)
            cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')

            cy.get('#country').select('Estonia')
            cy.get('#city').should('not.be.disabled')
            cy.get('#city').find('option').should('have.length', 4)
            cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')

            cy.get('#country').select('Austria')
            cy.get('#city').should('not.be.disabled')
            cy.get('#city').find('option').should('have.length', 4)
            cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')

            })

        it('Check that list of checkboxes is correct', () => {
            cy.get('input[type="checkbox"]').should('have.length', 2)
        
            cy.get('input[type="checkbox"]').eq(0).should('have.text','').and('not.be.checked')
            cy.get('input[type="checkbox"]').next().eq(1).should('have.text','Accept our cookie policy').and('not.be.checked')
            
            cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        })

        it('Check navigation', () => {
            
            cy.get('button').should('have.text', 'Accept our cookie policy')
            cy.get('a').should('have.attr', 'href', 'cookiePolicy.html').click()
            
            // Check that currently opened URL is correct
            cy.url().should('contain', 'cookiePolicy.html')
            
            // Go back to previous page
            cy.go('back')
            cy.log('Back again in registration form 3')
        })

        it('Email format', () => {

            cy.get('span').children().should('have.length', 2)
            cy.get('span').eq(2).should('have.text', 'Invalid email address.')
            cy.get('span').should('have.attr', 'style').should('contain', 'color:red')

            cy.get('input[name="email"]').type('invalid')
            cy.get('span').eq(2).should('be.visible')
            cy.log('Error message is displayed in red')
        })

})    


/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */

describe('Functional tests for registration form 3', () => {

    it('All fields are filled', () => {
        //Setting values for all input fields and clicking submit button nr 2

        cy.get('#name').type('Sigrid L')
        cy.get('input[name="email"]').type('test@test.ee')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('div').eq(7).type('2010-04-01')
        cy.get('input[type="radio"]').eq(2).click()
        cy.get('#birthday').type('2010-04-01')
        cy.get('input[type="checkbox"]').eq(0).click()
        cy.get('input[type="checkbox"]').eq(1).click()
            
        cy.get('body > form > p > input[type=submit]').should('be.visible').click()
        cy.get('h1').should('contain.text', 'Submission received')

        })

    it('User cannot submit form with invalid email and only mandatory fields added', () => {
        cy.get('input[name="email"]').type('test.ee')
        cy.get('#country').select('Spain')
        cy.get('#city').select('Madrid')
        cy.get('#birthday').type('1991-04-01')
        cy.get('input[type="checkbox"]').eq(0).click()

        cy.get('body > form > p > input[type=submit]').should('be.disabled')
        cy.get('span').eq(2).should('have.text', 'Invalid email address.')

        })

    it('User cannot submit form when email is absent', () => {
        inputValidData('test@test.ee')
        cy.get('input[name="email"]').clear()

        cy.get('span').eq(1).should('have.text', 'Email is required.')
        cy.get('body > form > p > input[type=submit]').should('be.disabled')
        
        })      

    it('User cannot submit form when country is absent', () => {
        inputValidData('test@test.ee')
        cy.get('#country').select('')
    
        cy.get('body > form > p > input[type=submit]').should('be.disabled')
            
        })
        
    it('If country is updated, then city choice should be removed', () => {
        inputValidData('test@test.ee')
        cy.get('body > form > p > input[type=submit]').should('be.enabled')

        cy.get('#country').select('Estonia')

        //Submit button should be disabled because the content of mandatory field "city" is removed
        cy.get('body > form > p > input[type=submit]').should('be.disabled')
                
        })

    it('It is possible to add a file', () => {
        // file upload + submit button 1
        cy.get('#myFile').selectFile('cypress/fixtures/upload_file.html')

        cy.get('input[type="submit"]').eq(0).click()
    
        })        

})

function inputValidData(email) {
    cy.log('Email will be filled')
    cy.get('input[name="email"]').type(email)
    cy.get('#country').select('Spain')
    cy.get('#city').select('Madrid')
    cy.get('#birthday').type('1991-04-01')
    cy.get('input[type="checkbox"]').eq(0).click()
}
