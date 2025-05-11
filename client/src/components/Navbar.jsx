
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Moon, Puzzle } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
            <Moon className="h-6 w-6 text-primary animate-pulse-slow" />
          </div>
          <h1 className="text-xl font-bold text-white">
            GlobeTrotter<span className="text-primary">.</span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" 
                ? "text-primary" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/explore" 
                ? "text-primary" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            Explore
          </Link>
          <Link 
            to="/puzzle" 
            className={`text-sm font-medium transition-colors flex items-center gap-1 ${
              location.pathname === "/puzzle" 
                ? "text-primary" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Puzzle className="h-3 w-3" /> Puzzles
          </Link>
          <Link 
            to="/favorites" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/favorites" 
                ? "text-primary" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            Favorites
          </Link>
          <Link 
            to="/globe" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/globe" 
                ? "text-primary" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            Globe
          </Link>
          <Link to="/search">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
