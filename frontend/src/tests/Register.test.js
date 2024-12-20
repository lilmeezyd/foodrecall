import { render, screen, fireEvent } from "@testing-library/react";
import Register from "../pages/Register";
import { MemoryRouter } from "react-router-dom";
import userEvent from '@testing-library/user-event';

it("register form", async () => {
    render(<MemoryRouter><Register /></MemoryRouter>)

    const buttonElement = screen.getByRole("button");
    const firstNameInput = screen.getByPlaceholderText(/enter first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter last name/i);
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const confirmInput = screen.getByPlaceholderText(/confirm password/i);

    fireEvent.change(firstNameInput, {target: {value: 'Denis'}})
    fireEvent.change(lastNameInput, {target: {value: 'Moini'}})
    fireEvent.change(emailInput, {target: {value: 'denis@yahoo.com'}})
    fireEvent.change(passwordInput, {target: {value: 'denis'}})
    fireEvent.change(confirmInput, {target: {value: 'tennis'}})
    screen.debug()
})

/*describe('Register component', () => {

    it("renders register form", async () => {
        render(<MemoryRouter><Register /></MemoryRouter>);
        const buttonElement = screen.getByRole("button");
        const firstNameInput = screen.getByPlaceholderText(/enter first name/i);
        const lastNameInput = screen.getByPlaceholderText(/enter last name/i);
        const emailInput = screen.getByPlaceholderText(/enter email/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const confirmInput = screen.getByPlaceholderText(/confirm password/i);*/

        // verify that the login form is rendered
       /* expect(firstNameInput).toBeInTheDocument()
        expect(lastNameInput).toBeInTheDocument()
        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(confirmInput).toBeInTheDocument()
        expect(buttonElement).toBeInTheDocument()
        const firstName = 'Denis'
        fireEvent.change(firstNameInput, { target: {value: firstName}})*/
        //expect(nameInput).toHaveValue('Denis')
        //await userEvent.click(buttonElement)
        //screen.debug()
        //fireEvent.change(nameInput, {target: {value: 'Denis'}})
        //userEvent.click(buttonElement);
        //screen.debug()
        //const alertElement = screen.getByRole("alert");
        //expect(alertElement).toBeInTheDocument();

    /*})
})
/*
test("Testing page load", () => {
    render(<MemoryRouter><Register /></MemoryRouter>)
    expect(screen.getByText(/Register to get email notifications/i)).toBeInTheDocument();
})*/