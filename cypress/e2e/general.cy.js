// cypress/e2e/general-pages.cy.ts

describe('General Page Navigation', () => {
    const pages = [
        { name: 'Events', path: '/events' },
        { name: 'How it works', path: '/how-it-works' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Legal', path: '/legal' },
    ];

    beforeEach(() => {
        // Visit the home page before each test
        cy.visit('http://localhost:5173/');
    });

    context('Desktop Navigation', () => {
        beforeEach(() => {
            // Set viewport to a desktop size (e.g., 1024px or wider for 'lg' breakpoint)
            cy.viewport(1280, 720);
        });

        it('should navigate to all general pages from the desktop navbar', () => {
            pages.forEach(page => {
                cy.get('nav') // Select the navbar
                    .contains('a', page.name) // Find the link by text
                    .should('be.visible') // Ensure the link is visible
                    .click(); // Click the link

                // Verify the URL
                cy.url().should('include', page.path);

                // Navigate back to the home page for the next iteration
                cy.visit('http://localhost:5173/');
            });

            // Test the Login link separately as it's an anchor tag
            cy.get('nav').contains('a', 'Login').should('be.visible').click();
            cy.url().should('include', '/auth'); // Or '/login' based on your actual route
        });

        it('should navigate to the home page via the logo', () => {
            // Navigate to an arbitrary page first
            cy.visit('http://localhost:5173/about');
            cy.url().should('include', '/about');

            // Click the logo
            cy.get('nav a[class*="btn-ghost"]').first().click(); // Selects the NavLink with btn-ghost class
            cy.url().should('eq', 'http://localhost:5173' + '/');
        });
    });

    context('Tablet Navigation', () => {
        beforeEach(() => {
            // Set viewport to a common tablet size (e.g., iPad Mini landscape)
            // Or use a custom size within your tablet breakpoint range (e.g., 768px for md, up to 1023px)
            cy.viewport('ipad-mini'); // Example Cypress preset for tablet
            // Alternatively, you can define a custom size like: cy.viewport(768, 1024);
        });

        it('should navigate to all general pages from the tablet sidebar menu', () => {
            pages.forEach(page => {
                // Open the mobile/tablet menu (assuming the same button is used for mobile and tablet)
                cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
                cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', 'translate-x-0'); // Ensure sidebar is open

                // Click the link in the sidebar
                cy.get('.fixed.top-0.left-0.h-full.w-64') // Select the sidebar menu
                    .contains('a', page.name) // Find the link by text
                    .should('be.visible') // Ensure the link is visible
                    .click(); // Click the link

                // Verify the URL
                cy.url().should('include', page.path);

                // Ensure the sidebar is closed after navigation
                cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', '-translate-x-full');
                cy.visit('http://localhost:5173/'); // Navigate back to home for next iteration
            });

            // Test the Login link in the mobile/tablet menu
            cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
            cy.get('.fixed.top-0.left-0.h-full.w-64')
                .contains('a', 'Login')
                .should('be.visible')
                .click();
            cy.url().should('include', '/login'); // Or '/auth'
        });

        it('should navigate to the home page via the logo in tablet view', () => {
            cy.visit('http://localhost:5173/about');
            cy.url().should('include', '/about');

            cy.get('nav a[class*="btn-ghost"]').first().click();
            cy.url().should('eq', 'http://localhost:5173' + '/');
        });

        it('should close the tablet menu when clicking outside', () => {
            cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', 'translate-x-0');

            cy.get('.fixed.inset-0.bg-black\\/40.backdrop-blur-md').click({ force: true });

            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', '-translate-x-full');
        });

        it('should close the tablet menu when clicking the close button', () => {
            cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', 'translate-x-0');

            cy.get('.fixed.top-0.left-0.h-full.w-64')
                .find('button.btn-square.btn-ghost')
                .click();

            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', '-translate-x-full');
        });
    });


    context('Mobile Navigation', () => {
        beforeEach(() => {
            // Set viewport to a mobile size
            cy.viewport('iphone-xr');
        });

        it('should navigate to all general pages from the mobile sidebar menu', () => {
            pages.forEach(page => {
                // Open the mobile menu
                cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
                cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', 'translate-x-0');

                // Click the link in the sidebar
                cy.get('.fixed.top-0.left-0.h-full.w-64')
                    .contains('a', page.name)
                    .should('be.visible')
                    .click();

                // Verify the URL
                cy.url().should('include', page.path);

                // Ensure the sidebar is closed after navigation
                cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', '-translate-x-full');
                cy.visit('http://localhost:5173/'); // Navigate back to home for next iteration
            });

            // Test the Login link in the mobile menu
            cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
            cy.get('.fixed.top-0.left-0.h-full.w-64')
                .contains('a', 'Login')
                .should('be.visible')
                .click();
            cy.url().should('include', '/login'); // Or '/auth'
        });

        it('should navigate to the home page via the logo in mobile view', () => {
            cy.visit('http://localhost:5173/about');
            cy.url().should('include', '/about');

            cy.get('nav a[class*="btn-ghost"]').first().click();
            cy.url().should('eq', 'http://localhost:5173' + '/');
        });

        it('should close the mobile menu when clicking outside', () => {
            cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', 'translate-x-0');

            cy.get('.fixed.inset-0.bg-black\\/40.backdrop-blur-md').click({ force: true });

            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', '-translate-x-full');
        });

        it('should close the mobile menu when clicking the close button', () => {
            cy.get('[data-cy="mobile-menu-button"]').should('be.visible').click();
            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', 'translate-x-0');

            cy.get('.fixed.top-0.left-0.h-full.w-64')
                .find('button.btn-square.btn-ghost')
                .click();

            cy.get('.fixed.top-0.left-0.h-full.w-64').should('have.class', '-translate-x-full');
        });
    });
});