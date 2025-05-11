
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { isFavorite, addFavoriteCountry, removeFavoriteCountry } from "@/lib/storage";
import { toast } from "sonner";

const CountryCard = ({ country, compact = false }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  useEffect(() => {
    setIsFavorited(isFavorite(country.cca3));
  }, [country.cca3]);
  
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorited) {
      removeFavoriteCountry(country.cca3);
      setIsFavorited(false);
      toast.info(`${country.name.common} removed from favorites`);
    } else {
      addFavoriteCountry({
        cca3: country.cca3,
        name: country.name.common,
        flagUrl: country.flags.svg,
      });
      setIsFavorited(true);
      toast.success(`${country.name.common} added to favorites`);
    }
  };
  
  // Format population with commas
  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  if (compact) {
    return (
      <Link to={`/country/${country.cca3}`}>
        <div className="glass-card card-hover p-4 h-full">
          <div className="flex items-center gap-3">
            <img 
              src={country.flags.svg} 
              alt={country.flags.alt || `Flag of ${country.name.common}`}
              className="w-10 h-6 object-cover rounded-sm shadow-sm"
            />
            <div className="flex-1 text-left">
              <h3 className="font-medium">{country.name.common}</h3>
              <p className="text-xs text-gray-400">{country.region}</p>
            </div>
            <button
              onClick={handleFavoriteToggle}
              className={`h-6 w-6 flex items-center justify-center rounded-full transition-colors ${
                isFavorited ? "text-yellow-500" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {isFavorited ? "★" : "☆"}
            </button>
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <Link to={`/country/${country.cca3}`}>
      <div className="glass-card card-hover overflow-hidden h-full">
        <div className="relative h-32">
          <img 
            src={country.flags.svg} 
            alt={country.flags.alt || `Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-black/50 transition-colors ${
              isFavorited ? "text-yellow-500" : "text-gray-200 hover:text-yellow-300"
            }`}
          >
            {isFavorited ? "★" : "☆"}
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{country.name.common}</h3>
          <div className="flex flex-col gap-1 text-sm">
            {country.capital && (
              <p className="text-gray-300">
                <span className="font-medium">Capital:</span> {country.capital[0]}
              </p>
            )}
            <p className="text-gray-300">
              <span className="font-medium">Region:</span> {country.region}
            </p>
            <p className="text-gray-300">
              <span className="font-medium">Population:</span> {formatPopulation(country.population)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;
