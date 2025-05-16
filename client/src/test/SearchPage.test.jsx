// SearchPage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock the API functions
vi.mock("../lib/api", () => ({
  searchCountriesByName: vi.fn(() => Promise.resolve([
    {
      cca3: "DEU",
      name: { common: "Germany" },
      flags: { svg: "germany.svg", alt: "German flag" },
      region: "Europe",
      population: 83000000,
    },
  ])),
  fetchCountriesByRegion: vi.fn(() => Promise.resolve([])),
  fetchCountriesByCapital: vi.fn(() => Promise.resolve([])),
}));

// Mock CountryCard and ErrorMessage components
vi.mock("@/components/CountryCard", () => ({
  default: ({ country }) => <div>CountryCard: {country.name.common}</div>,
}));
vi.mock("@/components/ErrorMessage", () => ({
  default: ({ error }) => <div>Error: {error.message}</div>,
}));

import SearchPage from "../pages/SearchPage";

// Test suite
describe("SearchPage", () => {
  it("renders and performs name search correctly", async () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    // Search input
    const input = screen.getByPlaceholderText("Search for a country...");
    fireEvent.change(input, { target: { value: "Germany" } });

    // Search button
    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    // Wait for result
    await waitFor(() => {
      expect(screen.getByText(/CountryCard: Germany/i)).toBeInTheDocument();
    });
  });

  it("shows message for no results", async () => {
    const { fetchCountriesByRegion } = await import("../lib/api");
    fetchCountriesByRegion.mockResolvedValueOnce([]);

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    // Set region and search
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Atlantis" },
    });
    fireEvent.change(screen.getByDisplayValue("By Name"), {
      target: { value: "region" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/No countries found matching your search/i)
      ).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const { fetchCountriesByCapital } = await import("../lib/api");
    fetchCountriesByCapital.mockRejectedValueOnce(new Error("API Failure"));

    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "Paris" },
    });
    fireEvent.change(screen.getByDisplayValue("By Name"), {
      target: { value: "capital" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error: API Failure/i)).toBeInTheDocument();
    });
  });
});
