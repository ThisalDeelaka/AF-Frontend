import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCountryByCode } from "@/lib/api";
import { getFavoriteCountries, removeFavoriteCountry } from "@/lib/storage";
import CountryCard from "@/components/CountryCard";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "sonner";

// Type stubs if you're using plain JSX without TypeScript
// Remove if using .tsx and have these defined elsewhere
// const FavoriteCountry = {};
// const Country = {};
// const ApiError = {};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = getFavoriteCountries();
        setFavorites(storedFavorites);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        setError({ message: "Failed to load your favorite countries" });
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const countryPromises = favorites.map(fav => getCountryByCode(fav.cca3));
        const results = await Promise.allSettled(countryPromises);

        const fetchedCountries = results
          .filter((result) => result.status === "fulfilled" && result.value !== null)
          .map(result => result.value);

        setCountries(fetchedCountries);
      } catch (err) {
        console.error("Failed to fetch country details:", err);
        setError({ message: "Failed to load details for your favorite countries" });
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [favorites]);

  const handleRemoveFavorite = (countryCode, countryName) => {
    removeFavoriteCountry(countryCode);
    setFavorites(favorites.filter(fav => fav.cca3 !== countryCode));
    toast.info(`${countryName} removed from favorites`);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Favorite Countries</h1>

        {error && <ErrorMessage error={error} onRetry={() => window.location.reload()} />}

        {!loading && favorites.length === 0 && (
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <p className="text-gray-300 mb-4">You haven't added any countries to your favorites yet.</p>
            <Link
              to="/explore"
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-md transition-colors"
            >
              Explore Countries
            </Link>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="glass-card animate-pulse h-60">
                <div className="h-32 bg-gray-700/50" />
                <div className="p-4">
                  <div className="h-6 bg-gray-700/50 rounded mb-3 w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                    <div className="h-4 bg-gray-700/50 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {countries.map(country => (
              <div key={country.cca3} className="relative group">
                <CountryCard country={country} />
                <button
                  onClick={() => handleRemoveFavorite(country.cca3, country.name.common)}
                  className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
