
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <h1 className="text-6xl font-bold mb-2 text-gradient">404</h1>
        <p className="text-xl text-gray-300 mb-6">Oops! Page not found</p>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
