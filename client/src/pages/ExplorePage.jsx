
import { useEffect, useState } from "react";
import { fetchAllCountries, searchCountriesByName, fetchCountriesByRegion, fetchCountriesByCapital } from "@/lib/api";
import SearchBar from "@/components/SearchBar";
import CountryGrid from "@/components/CountryGrid";
import ErrorMessage from "@/components/ErrorMessage";

const ExplorePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllCountries();
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        console.error("Failed to load countries:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const handleSearch = async (term, type) => {
    if (!term.trim()) {
      setFilteredCountries(countries);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      let results = [];
      
      switch (type) {
        case "name":
          results = await searchCountriesByName(term);
          break;
        case "region":
          results = await fetchCountriesByRegion(term);
          break;
        case "capital":
          results = await fetchCountriesByCapital(term);
          break;
        default:
          results = await searchCountriesByName(term);
      }
      
      setFilteredCountries(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err);
      setFilteredCountries([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Explore Countries</h1>
        
        <div className="mb-10">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {error && (
          <ErrorMessage 
            error={error} 
            onRetry={() => {
              setFilteredCountries(countries);
              setError(null);
            }} 
          />
        )}
        
        {searchPerformed && filteredCountries.length === 0 && !loading && !error && (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400">No countries found matching your search.</p>
            <button 
              onClick={() => {
                setFilteredCountries(countries);
                setSearchPerformed(false);
              }}
              className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded transition-colors"
            >
              Show All Countries
            </button>
          </div>
        )}
        
        <CountryGrid countries={filteredCountries} loading={loading} />
      </div>
    </div>
  );
};

export default ExplorePage;
