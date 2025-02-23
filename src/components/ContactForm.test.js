import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);
    const header = screen.queryByText(/Contact Form/i);
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    userEvent.type(screen.getByPlaceholderText('Edd'), 'a');
    const errors = screen.queryAllByTestId('error');
    expect(errors).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);
    userEvent.click(screen.getByRole('button'));
    const errors = screen.queryAllByTestId('error');
    expect(errors).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
    userEvent.type(screen.getByPlaceholderText('Edd'), 'Edison');
    userEvent.type(screen.getByPlaceholderText('Burke'), 'Burke');
    userEvent.click(screen.getByRole('button'));
    const errors = screen.queryAllByTestId('error');
    expect(errors).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    userEvent.click(screen.getByRole('button'));
    userEvent.type(screen.getByPlaceholderText('Edd'), 'Edison');
    userEvent.type(screen.getByPlaceholderText('Burke'), 'Burke');
    const error = screen.queryByTestId('error');
    expect(error).toHaveTextContent('email must be a valid email address');
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    userEvent.click(screen.getByRole('button'));
    userEvent.type(screen.getByPlaceholderText('Edd'), 'Edison');
    userEvent.type(screen.getByPlaceholderText('bluebill1049@hotmail.com'), 'bluebill1049@hotmail.com');
    const error = screen.queryByTestId('error');
    expect(error).toHaveTextContent('lastName is a required field');
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
    userEvent.type(screen.getByPlaceholderText('Edd'), 'Edison');
    userEvent.type(screen.getByPlaceholderText('Burke'), 'Burke');
    userEvent.type(screen.getByPlaceholderText('bluebill1049@hotmail.com'), 'bluebill1049@hotmail.com');
    userEvent.click(screen.getByRole('button'));
    const message = screen.queryByTestId('messageDisplay');
    expect(message).toBeFalsy();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
    userEvent.type(screen.getByPlaceholderText('Edd'), 'Edison');
    userEvent.type(screen.getByPlaceholderText('Burke'), 'Burke');
    userEvent.type(screen.getByPlaceholderText('bluebill1049@hotmail.com'), 'bluebill1049@hotmail.com');
    userEvent.type(screen.getByLabelText('Message'), 'Hello World');
    userEvent.click(screen.getByRole('button'));
    const firstname = screen.queryByTestId('firstnameDisplay');
    expect(firstname).toHaveTextContent('Edison');
    const lastname = screen.queryByTestId('lastnameDisplay');
    expect(lastname).toHaveTextContent('Burke');
    const email = screen.queryByTestId('emailDisplay');
    expect(email).toHaveTextContent('bluebill1049@hotmail.com');
    const message = screen.queryByTestId('messageDisplay');
    expect(message).toHaveTextContent('Hello World');
});