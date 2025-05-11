import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCountryByCode, getCountryImage } from "../lib/api";
import WeatherCard from "@/components/WeatherCard";
import NewsList from "@/components/NewsList";
import PuzzleGame from "@/components/PuzzleGame";
import ErrorMessage from "@/components/ErrorMessage";
import { ArrowLeft } from "lucide-react";
import { addFavoriteCountry, removeFavoriteCountry, isFavorite } from "@/lib/storage";
import { toast } from "sonner";

const CountryDetailPage = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchCountry = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getCountryByCode(id);
        setCountry(data);
        setFavorited(isFavorite(id));
      } catch (err) {
        console.error(`Failed to fetch country ${id}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!country) return;

    if (favorited) {
      removeFavoriteCountry(country.cca3);
      setFavorited(false);
      toast.info(`${country.name.common} removed from favorites`);
    } else {
      addFavoriteCountry({
        cca3: country.cca3,
        name: country.name.common,
        flagUrl: country.flags.svg,
      });
      setFavorited(true);
      toast.success(`${country.name.common} added to favorites`);
    }
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const countryImage = country ? getCountryImage(country.cca3) : '';

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700/50 rounded w-1/4 mb-6" />
            <div className="h-64 bg-gray-700/50 rounded-lg mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="h-64 bg-gray-700/50 rounded-lg" />
              <div className="h-64 bg-gray-700/50 rounded-lg" />
              <div className="h-64 bg-gray-700/50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <ErrorMessage 
            error={error} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6 text-center">
          <p>Country not found.</p>
          <Link 
            to="/explore" 
            className="inline-block mt-4 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded transition-colors"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/explore" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to all countries</span>
          </Link>
          
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              favorited 
                ? "bg-yellow-500/20 text-yellow-300" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span>{favorited ? "★" : "☆"}</span>
            <span>{favorited ? "Favorited" : "Add to Favorites"}</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/3">
            <div className="glass-card overflow-hidden h-full">
              <img 
                src={country.flags.svg} 
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                className="w-full h-48 object-contain p-4"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">{country.name.common}</h1>
                <p className="text-lg text-gray-300 mb-4">{country.name.official}</p>
                
                <div className="space-y-3">
                  {country.capital?.length > 0 && (
                    <div>
                      <span className="text-gray-400">Capital:</span>{" "}
                      <span className="font-medium">{country.capital.join(", ")}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Region:</span>{" "}
                    <span className="font-medium">{country.region}</span>
                    {country.subregion && ` (${country.subregion})`}
                  </div>
                  <div>
                    <span className="text-gray-400">Population:</span>{" "}
                    <span className="font-medium">{formatNumber(country.population)}</span>
                  </div>
                  {country.languages && (
                    <div>
                      <span className="text-gray-400">Languages:</span>{" "}
                      <span className="font-medium">
                        {Object.values(country.languages).join(", ")}
                      </span>
                    </div>
                  )}
                  {country.currencies && (
                    <div>
                      <span className="text-gray-400">Currency:</span>{" "}
                      <span className="font-medium">
                        {Object.values(country.currencies)
                          .map(c => `${c.name} (${c.symbol})`)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                
                {country.maps?.googleMaps && (
                  <div className="mt-6">
                    <a
                      href={country.maps.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 text-center bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded transition-colors"
                    >
                      View on Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <div className="flex mb-6 border-b border-gray-700">
              {['info', 'weather', 'news', 'puzzle'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 ${
                    activeTab === tab 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card overflow-hidden">
                  <h3 className="p-4 font-medium border-b border-gray-700">Country Image</h3>
                  <div className="p-4">
                    <img
                      src={countryImage}
                      alt={`Scenic view of ${country.name.common}`}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-400 mt-2 text-center">
                      Scenic view of {country.name.common}
                    </p>
                  </div>
                </div>
                <div className="glass-card overflow-hidden">
                  <h3 className="p-4 font-medium border-b border-gray-700">Neighboring Countries</h3>
                  <div className="p-4">
                    {country.borders?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {country.borders.map(border => (
                          <Link 
                            key={border} 
                            to={`/country/${border}`}
                            className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary/70 rounded-md transition-colors"
                          >
                            {border}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No bordering countries (island or territory).</p>
                    )}
                  </div>
                </div>
                <div className="glass-card overflow-hidden md:col-span-2">
                  <h3 className="p-4 font-medium border-b border-gray-700">Additional Information</h3>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {country.area && (
                      <div>
                        <span className="text-gray-400 block">Area:</span>
                        <span className="font-medium">{formatNumber(country.area)} km²</span>
                      </div>
                    )}
                    {country.timezones && (
                      <div>
                        <span className="text-gray-400 block">Timezone(s):</span>
                        <span className="font-medium">
                          {country.timezones.length > 3 
                            ? `${country.timezones[0]} and ${country.timezones.length - 1} more`
                            : country.timezones.join(", ")}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400 block">Continents:</span>
                      <span className="font-medium">{country.continents.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'weather' && country.capital?.length > 0 && (
              <WeatherCard city={country.capital[0]} />
            )}

            {activeTab === 'news' && (
              <NewsList countryCode={country.cca2} />
            )}

            {activeTab === 'puzzle' && (
              <PuzzleGame 
                countryCode={country.cca3} 
                imageUrl={countryImage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetailPage;
