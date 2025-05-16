import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

// ✅ Mock the module BEFORE importing component
vi.mock("../lib/api", () => {
  return {
    getCountryByCode: vi.fn(() =>
      Promise.resolve({
        cca3: "USA",
        cca2: "US",
        name: { common: "United States", official: "United States of America" },
        flags: { svg: "us-flag.svg", alt: "US flag" },
        capital: ["Washington, D.C."],
        region: "Americas",
        subregion: "North America",
        population: 331000000,
        languages: { eng: "English" },
        currencies: { USD: { name: "United States dollar", symbol: "$" } },
        maps: { googleMaps: "https://maps.google.com" },
        borders: ["CAN", "MEX"],
        area: 9833520,
        timezones: ["UTC−04:00", "UTC−05:00"],
        continents: ["North America"],
      })
    ),
    getCountryImage: vi.fn(() => "test-image-url.jpg"),
  };
});

// ✅ Mock other child components
vi.mock("@/components/WeatherCard", () => ({
  default: () => <div>WeatherCard</div>,
}));
vi.mock("@/components/NewsList", () => ({
  default: () => <div>NewsList</div>,
}));
vi.mock("@/components/PuzzleGame", () => ({
  default: () => <div>PuzzleGame</div>,
}));
vi.mock("@/components/ErrorMessage", () => ({
  default: () => <div>Error</div>,
}));

// ✅ Import AFTER mocks
import CountryDetailPage from "../pages/CountryDetailPage";

describe("CountryDetailPage", () => {
  it("renders country details correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/country/USA"]}>
        <Routes>
          <Route path="/country/:id" element={<CountryDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /United States/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Washington, D.C./)).toBeInTheDocument();
    expect(screen.getByText(/United States dollar/)).toBeInTheDocument();
    expect(screen.getByText(/Scenic view of United States/)).toBeInTheDocument();
    expect(screen.getByText("CAN")).toBeInTheDocument();
    expect(screen.getByText("MEX")).toBeInTheDocument();
  });
});
