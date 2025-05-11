
import CountryCard from "./CountryCard";

const CountryGrid = ({ countries, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <div className="h-4 bg-gray-700/50 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No countries found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {countries.map((country) => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  );
};

export default CountryGrid;
