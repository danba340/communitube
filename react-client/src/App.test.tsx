import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders communitube header", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Communitube/i);
  expect(linkElement).toBeInTheDocument();
});
