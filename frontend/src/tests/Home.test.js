import { render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/Home"
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import fsis from '../fsis/fsis.json'
import {RecallProvider} from "../RecallContext";

describe('Home Component', () => {
  it("renders home page", async () => {
    render(<Home />)
    const element = screen.getByText(/Food Recall Tool/i)
    expect(element).toBeInTheDocument()
  })

})