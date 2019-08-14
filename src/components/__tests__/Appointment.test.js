import React from "react";

import { render, cleanup, waitForElement } from "@testing-library/react";

import Application from "components/Application";

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001';

afterEach(cleanup);

describe("Appointments",()=>{
  it("should renders without crashing", () => {
    const {getByText} = render(<Application />);
    return waitForElement(()=>getByText('Monday'))
  });
})

