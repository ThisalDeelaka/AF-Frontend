import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// ✅ Mock API and storage with Vite-compatible path aliases
vi.mock('@/lib/storage', () => ({
  getFavoriteCountries: vi.fn(() => []),
  removeFavoriteCountry: vi.fn(),
}));
vi.mock('../lib/api', () => ({
  getCountryByCode: vi.fn(),
}));
vi.mock('@/components/CountryCard', () => ({
  default: ({ country }) => <div>{country.name.common}</div>,
}));
vi.mock('@/components/ErrorMessage', () => ({
  default: ({ error }) => <div>Error: {error.message}</div>,
}));

// ✅ Import after mocks
const { default: FavoritesPage } = await import('../pages/FavoritesPage');

describe('FavoritesPage', () => {
  it('shows no favorites message if list is empty', async () => {
    render(
      <BrowserRouter>
        <FavoritesPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/You haven't added any countries/i)
      ).toBeInTheDocument();
    });
  });
});
