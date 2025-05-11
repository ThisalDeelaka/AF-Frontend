import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllCountries, getCountryImage, getCountryMapImage } from "@/lib/api";
import { getAllPuzzleProgress } from "@/lib/storage";
import ErrorMessage from "@/components/ErrorMessage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Puzzle, Map } from "lucide-react";

const PuzzlePage = () => {
  const [countries, setCountries] = useState([]);
  const [puzzleProgress, setPuzzleProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("images");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allCountries = await fetchAllCountries();
        const shuffled = allCountries.sort(() => 0.5 - Math.random());
        const selectedCountries = shuffled.slice(0, 20);
        setCountries(selectedCountries);

        const progress = getAllPuzzleProgress();
        setPuzzleProgress(progress);
      } catch (err) {
        console.error("Failed to load puzzle data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPuzzleStatus = (countryCode, puzzleType) => {
    const puzzleId = `${countryCode}-${puzzleType}`;
    const progress = puzzleProgress.find(p => p.countryCode === puzzleId);

    if (!progress) return 'not-started';
    if (progress.isCompleted) return 'completed';
    return 'in-progress';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-400">
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/50 text-yellow-400">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400">
            Not Started
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Country Puzzles</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="glass-card animate-pulse h-60">
                <div className="h-full w-full bg-gray-700/50 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8 text-center">Country Puzzles</h1>
          <ErrorMessage error={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Country Puzzles</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Test your skills with our collection of country puzzles.
            Choose between image puzzles or country map puzzles!
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Puzzle className="h-4 w-4" /> Image Puzzles
            </TabsTrigger>
            <TabsTrigger value="maps" className="flex items-center gap-2">
              <Map className="h-4 w-4" /> Map Puzzles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map(country => {
                const status = getPuzzleStatus(country.cca3, "image");
                const imageUrl = getCountryImage(country.cca3);

                return (
                  <Link
                    key={`image-${country.cca3}`}
                    to={`/country/${country.cca3}?tab=puzzle&type=image`}
                    className="group"
                  >
                    <div className="glass-card overflow-hidden card-hover">
                      <div className="relative h-48">
                        <img
                          src={imageUrl}
                          alt={`Puzzle of ${country.name.common}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          {getStatusBadge(status)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{country.name.common}</h3>
                        <p className="text-sm text-gray-400 mb-3">{country.region}</p>
                        <div className="flex items-center gap-2">
                          <img
                            src={country.flags.svg}
                            alt={`Flag of ${country.name.common}`}
                            className="w-8 h-5 object-cover rounded-sm"
                          />
                          <span className="text-sm">
                            {status === 'completed'
                              ? 'Play image puzzle again'
                              : status === 'in-progress'
                                ? 'Continue image puzzle'
                                : 'Start image puzzle'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="maps" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.map(country => {
                const status = getPuzzleStatus(country.cca3, "map");
                const mapUrl = getCountryMapImage(country.cca3);

                return (
                  <Link
                    key={`map-${country.cca3}`}
                    to={`/country/${country.cca3}?tab=puzzle&type=map`}
                    className="group"
                  >
                    <div className="glass-card overflow-hidden card-hover">
                      <div className="relative h-48">
                        <img
                          src={mapUrl}
                          alt={`Map Puzzle of ${country.name.common}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          {getStatusBadge(status)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{country.name.common}</h3>
                        <p className="text-sm text-gray-400 mb-3">{country.region}</p>
                        <div className="flex items-center gap-2">
                          <img
                            src={country.flags.svg}
                            alt={`Flag of ${country.name.common}`}
                            className="w-8 h-5 object-cover rounded-sm"
                          />
                          <span className="text-sm">
                            {status === 'completed'
                              ? 'Play map puzzle again'
                              : status === 'in-progress'
                                ? 'Continue map puzzle'
                                : 'Start map puzzle'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PuzzlePage;
