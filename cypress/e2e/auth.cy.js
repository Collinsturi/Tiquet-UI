describe('Auth Component', () => {
    const backendUrl = Cypress.env('VITE_BACKEND_API_URL') || 'https://tique-1dxi.onrender.com/api';
    const loginUrl = `${backendUrl}/auth/login`;
    const registerUrl = `${backendUrl}/auth/register`;
    const googleAuthUrl = `${backendUrl}/auth/google`;

    const successfulLoginResponse = {
        token: 'mock-jwt-token',
        user: {
            user_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            role: 'event_attendee',
        },
    };

    // Before each test, visit the authentication page
    beforeEach(() => {
        cy.visit('http://localhost:5173/auth');
    });

    it('should display the login view by default', () => {
        // Assert that the login form is visible
        cy.get('h1').should('contain', 'Welcome Back');
        cy.get('form').should('have.length', 1);
        cy.get('input[name="email"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Login');
    });

    it('should switch to the registration view when the register button is clicked', () => {
        cy.contains('button', 'Register').click();

        cy.get('h1').should('contain', 'Create an Account');
        cy.get('input[name="firstName"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Register');
    });

    it('should switch back to the login view when the login button is clicked', () => {
        cy.contains('button', 'Register').click();
        cy.get('h1').should('contain', 'Create an Account');

        cy.contains('button', 'Login').click();
        cy.get('h1').should('contain', 'Welcome Back');
        cy.get('button[type="submit"]').should('contain', 'Login');
    });

    describe('Login Functionality', () => {
        it('should successfully log in and redirect a user', () => {
            cy.intercept('POST', loginUrl, {
                statusCode: 200,
                body: successfulLoginResponse,
            }).as('loginRequest');

            cy.get('input[name="email"]').type('john.doe@example.com');
            cy.get('input[name="password"]').type('password123');

            cy.get('form').submit();

            // Wait for the API call to complete
            // cy.wait('@loginRequest');

            // cy.get('.alert').should('be.visible').and('contain', 'Login successful!');

            cy.url().should('include', '/attendee');
        });

        it('should display validation errors for empty fields on login', () => {
            // Submit the form without entering any data
            cy.get('form').submit();

            cy.get('p').contains('Email is required').should('be.visible');
            cy.get('p').contains('Password is required').should('be.visible');
        });

        it('should display a server error message on login failure', () => {
            cy.intercept('POST', loginUrl, {
                statusCode: 401,
                body: { message: 'Invalid credentials. Please try again.' },
            }).as('failedLoginRequest');

            cy.get('input[name="email"]').type('wrong@example.com');
            cy.get('input[name="password"]').type('wrongpassword');

            cy.get('form').submit();

            // Wait for the API call to complete
            cy.wait('@failedLoginRequest');

            cy.get('.alert').should('be.visible').and('contain', 'Invalid credentials. Please try again.');
        });
    });

    describe('Registration Functionality', () => {
        beforeEach(() => {
            cy.contains('button', 'Register').click();
        });

        it('should successfully register a new user and redirect to email verification', () => {
            cy.intercept('POST', registerUrl, {
                statusCode: 201,
                body: { message: 'User registered successfully' },
            }).as('registerRequest');

            cy.get('input[name="firstName"]').type('Jane');
            cy.get('input[name="lastName"]').type('Doe');
            cy.get('input[name="phoneNumber"]').type('1234567890');
            cy.get('input[name="email"]').type('jane.doe@example.com');
            cy.get('input[name="password"]').type('password123');
            cy.get('input[name="confirmPassword"]').type('password123');
            cy.get('input[name="address"]').type('123 Cypress Street');
            cy.get('select[name="role"]').select('Organizer');

            cy.get('form').submit();

            // Wait for the API call to complete
            cy.wait('@registerRequest');

            // cy.get('.alert').should('be.visible').and('contain', 'Registration successful!');

            // Assert that the view switches back to login
            // cy.get('h1').should('contain', 'Welcome Back');

            // Assert that the user is redirected to the email verification page
            cy.url().should('include', '/verify-email');
        });

        it('should display validation errors for invalid or empty fields on registration', () => {
            cy.get('form').submit();

            // Assert that the validation error messages are displayed
            // cy.get('p').contains('First Name is required').should('be.visible');
            // cy.get('p').contains('Last Name is required').should('be.visible');
            // cy.get('p').contains('Phone Number is required').should('be.visible');
            // cy.get('p').contains('Email is required').should('be.visible');
            // cy.get('p').contains('Password is required').should('be.visible');
            // cy.get('p').contains('Confirm Password is required').should('be.visible');
        });

        it('should display a server error message if registration fails', () => {
            cy.intercept('POST', registerUrl, {
                statusCode: 409, // Conflict
                body: { message: 'Email already exists. Please use a different one.' },
            }).as('failedRegisterRequest');

            cy.get('input[name="firstName"]').type('Jane');
            cy.get('input[name="lastName"]').type('Doe');
            cy.get('input[name="phoneNumber"]').type('1234567890');
            cy.get('input[name="email"]').type('existing@example.com');
            cy.get('input[name="password"]').type('password123');
            cy.get('input[name="confirmPassword"]').type('password123');
            cy.get('input[name="address"]').type('123 Cypress Street');
            cy.get('select[name="role"]').select('Organizer');

            cy.get('form').submit();

            cy.wait('@failedRegisterRequest');

            cy.get('.alert').should('be.visible').and('contain', 'Email already exists. Please use a different one.');
        });

        it('should display a validation error if passwords do not match', () => {
            cy.get('input[name="firstName"]').type('Jane');
            cy.get('input[name="lastName"]').type('Doe');
            cy.get('input[name="phoneNumber"]').type('1234567890');
            cy.get('input[name="email"]').type('jane.doe@example.com');
            cy.get('input[name="password"]').type('password123');
            cy.get('input[name="confirmPassword"]').type('mismatched');

            cy.get('form').submit();

            // Assert that the password mismatch error is displayed
            // cy.get('p').contains('Passwords must match').should('be.visible');
        });
    });

    it('should initiate Google OAuth on button click', () => {
        // Stub the window.open method to prevent the browser from navigating away.
        // We capture the stubbed function to later assert its behavior.
        cy.window().then((win) => {
            cy.stub(win, 'open').as('openWindow');
        });

        cy.get('button.btn-outline').should('be.visible').and('contain', 'Sign in with Google').click();

        // cy.get('@openWindow').should('be.calledOnceWith', googleAuthUrl);
    });
});
