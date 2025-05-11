import { useState } from "react";
import { searchCountriesByName, fetchCountriesByRegion, fetchCountriesByCapital } from "@/lib/api";
import CountryCard from "@/components/CountryCard";
import ErrorMessage from "@/components/ErrorMessage";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [countries, setCountries] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      let results = [];

      switch (searchType) {
        case "name":
          results = await searchCountriesByName(searchTerm);
          break;
        case "region":
          results = await fetchCountriesByRegion(searchTerm);
          break;
        case "capital":
          results = await fetchCountriesByCapital(searchTerm);
          break;
        default:
          results = await searchCountriesByName(searchTerm);
      }

      setCountries(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-bold mb-6 text-center">Search Countries</h1>

          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/70 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Search for a country..."
                />
              </div>

              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="px-4 py-3 bg-secondary/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">By Name</option>
                <option value="region">By Region</option>
                <option value="capital">By Capital</option>
              </select>

              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        {!searchPerformed && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-6">
              <h2 className="text-lg font-medium mb-4">Search Tips</h2>

              <ul className="space-y-3 text-gray-300">
                <li>
                  <span className="font-medium text-white">By Name:</span> Search for countries by their common or official name (e.g., "Germany" or "Deutschland").
                </li>
                <li>
                  <span className="font-medium text-white">By Region:</span> Search by continental region (e.g., "Europe", "Africa", "Asia").
                </li>
                <li>
                  <span className="font-medium text-white">By Capital:</span> Search for countries by their capital city (e.g., "Tokyo", "Paris").
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Popular Regions</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Europe", "Asia", "Africa", "Americas", "Oceania"].map(region => (
                      <button
                        key={region}
                        onClick={() => {
                          setSearchTerm(region);
                          setSearchType("region");
                        }}
                        className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary/70 rounded-md transition-colors"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Popular Capitals</h3>
                  <div className="flex flex-wrap gap-2">
                    {["London", "Paris", "Tokyo", "Washington", "Beijing"].map(capital => (
                      <button
                        key={capital}
                        onClick={() => {
                          setSearchTerm(capital);
                          setSearchType("capital");
                        }}
                        className="px-3 py-1 text-sm bg-secondary/50 hover:bg-secondary/70 rounded-md transition-colors"
                      >
                        {capital}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <ErrorMessage error={error} />}

        {searchPerformed && !loading && countries.length === 0 && !error && (
          <div className="glass-card p-8 text-center max-w-md mx-auto">
            <p className="text-gray-400">No countries found matching your search.</p>
            <p className="text-sm text-gray-500 mt-2">Try using different keywords or search criteria.</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="glass-card animate-pulse h-[250px]"
              >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {countries.map(country => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
