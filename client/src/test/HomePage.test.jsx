import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// 1. Mock icons from lucide-react
vi.mock('lucide-react', () => ({
  ArrowRight: () => <span>→</span>,
  Globe: () => <span>🌍</span>,
  Map: () => <span>🗺️</span>,
  Puzzle: () => <span>🧩</span>,
}));

// 2. Mock CountryCard component
vi.mock('../components/CountryCard', () => ({
  default: ({ country }) => <div>{country.name.common}</div>,
}));

// 3. Mock ErrorMessage component
vi.mock('../components/ErrorMessage', () => ({
  default: ({ error }) => <div>{error.message}</div>,
}));

// 4. Mock fetchAllCountries API function
const mockFetchAllCountries = vi.fn();
vi.mock('../lib/api', () => ({
  fetchAllCountries: mockFetchAllCountries,
}));

// 5. Import component after mocks
const { default: HomePage } = await import('../pages/HomePage');

describe('HomePage Component', () => {
  beforeEach(() => {
    mockFetchAllCountries.mockReset();
  });

  it('renders the hero section', async () => {
    mockFetchAllCountries.mockResolvedValue([]);

    await act(async () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/Explore Our World/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Discover countries, check weather/i)
    ).toBeInTheDocument();
  });

  it('renders featured countries after fetch', async () => {
    const mockCountries = [
      { cca3: 'C1', name: { common: 'Test Country' } },
    ];
    mockFetchAllCountries.mockResolvedValue(mockCountries);

    await act(async () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Test Country')).toBeInTheDocument();
    });
  });

  it('shows error message when API fails', async () => {
    mockFetchAllCountries.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('contains all navigation buttons', async () => {
    mockFetchAllCountries.mockResolvedValue([]);

    await act(async () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/Start Exploring/i)).toBeInTheDocument();
    expect(screen.getByText(/View Globe/i)).toBeInTheDocument();
    expect(screen.getByText(/Play Puzzles/i)).toBeInTheDocument();
  });
});
