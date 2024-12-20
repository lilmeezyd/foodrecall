import { render, screen, fireEvent, act } from "@testing-library/react";
import Login from "../pages/Login";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import AuthenticationProvider from "../AuthenticationContext";
describe("Login component", () => {
  it("renders login form", async () => {
    
    render(
      <MemoryRouter>
          <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const buttonElement = screen.getByRole("button", { name: /Login/i });

    // verify that the login form is rendered
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
    fireEvent.change(emailInput, { target: {value: 'denismoini@yahoo.com'}})
    fireEvent.change(passwordInput, { target: {value: 'password'}})
    //const element = screen.getByTestId('todo')
    //await userEvent.click(buttonElement);
    //expect(element).toBeInTheDocument()
    //screen.debug();

     /* fireEvent.change(emailInput, {
        target: { value: "denismoini09@gmail.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "1234567" } });
      await userEvent.click(buttonElement);*/
      //expect(onLogin.login).toHaveBeenCalled()

    screen.debug();
  });
});
