import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllCountries } from "@/lib/api";
import CountryCard from "../components/CountryCard";
import ErrorMessage from "@/components/ErrorMessage";
import { ArrowRight, Globe, Map, Puzzle } from "lucide-react";

const HomePage = () => {
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRandomCountries = async () => {
      try {
        setLoading(true);
        const allCountries = await fetchAllCountries();
        
        // Get 8 random countries for the featured section
        const shuffled = allCountries.sort(() => 0.5 - Math.random());
        setFeaturedCountries(shuffled.slice(0, 8));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getRandomCountries();
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background"></div>
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')] bg-cover bg-center"
            style={{ filter: 'brightness(0.3) saturate(0.7)' }}
          ></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center staggered-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
              Explore Our World
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Discover countries, check weather, read news, and play games all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/explore">
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                  Start Exploring
                </button>
              </Link>
              <Link to="/globe">
                <button className="px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg transition-colors flex items-center gap-2">
                  <Globe className="h-5 w-5" /> 
                  View Globe
                </button>
              </Link>
              <Link to="/puzzle">
                <button className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors flex items-center gap-2">
                  <Puzzle className="h-5 w-5" />
                  Play Puzzles
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className="container mx-auto px-6 mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Countries</h2>
          <Link 
            to="/explore" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {error && <ErrorMessage error={error} onRetry={() => window.location.reload()} />}
        
        {loading ? (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredCountries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        )}
      </section>

      {/* App Features */}
      <section className="container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">App Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="glass-card p-6 card-hover">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Country Explorer</h3>
            <p className="text-gray-300">
              Browse detailed information about countries including capitals, 
              languages, population, and more.
            </p>
          </div>
          
          <div className="glass-card p-6 card-hover">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">⛅</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Weather Checker</h3>
            <p className="text-gray-300">
              Get real-time weather updates for any country's capital city
              with beautiful visualizations.
            </p>
          </div>
          
          <div className="glass-card p-6 card-hover">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <div className="relative">
                <Puzzle className="h-6 w-6 text-blue-400" />
                <Map className="h-4 w-4 text-green-400 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Country Puzzles</h3>
            <p className="text-gray-300">
              Test your skills with fun jigsaw puzzles featuring stunning 
              images and maps from countries around the world.
            </p>
          </div>
          
          <div className="glass-card p-6 card-hover">
            <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Globe</h3>
            <p className="text-gray-300">
              Explore our interactive 3D globe visualization to discover
              countries around the world in a unique way.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
