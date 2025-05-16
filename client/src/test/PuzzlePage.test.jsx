// src/test/PuzzlePage.test.jsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PuzzlePage from "../pages/PuzzlePage";
import { BrowserRouter } from "react-router-dom";

// Mock modules
vi.mock("@/lib/storage", () => ({
  getAllPuzzleProgress: vi.fn(() => [
    { countryCode: "USA-image", isCompleted: true },
    { countryCode: "FRA-image", isCompleted: false }, // In Progress
  ]),
}));

vi.mock("../lib/api", () => ({
  fetchAllCountries: vi.fn(() => Promise.resolve([
    {
      cca3: "USA",
      name: { common: "United States" },
      region: "Americas",
      flags: { svg: "us-flag.svg" },
    },
    {
      cca3: "FRA",
      name: { common: "France" },
      region: "Europe",
      flags: { svg: "fr-flag.svg" },
    },
  ])),
  getCountryImage: vi.fn((code) => `${code}-image.jpg`),
  getCountryMapImage: vi.fn((code) => `${code}-map.jpg`),
}));

describe("PuzzlePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders puzzles correctly", async () => {
    render(
      <BrowserRouter>
        <PuzzlePage />
      </BrowserRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Country Puzzles")).toBeInTheDocument();
    });

    // Check for countries
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();

    // Check for puzzle statuses
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("In Progress"))
    ).toBeInTheDocument();

    // Check for action labels
    expect(screen.getAllByText(/Start|Play|Continue/i)[0]).toBeInTheDocument();
  });
});
