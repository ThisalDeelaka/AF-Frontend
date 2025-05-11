
import { useEffect, useState } from "react";
import { getNewsForCountry } from "@/lib/api";
import ErrorMessage from "./ErrorMessage";

const NewsList = ({ countryCode }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        // Only fetch if we have a valid country code
        if (countryCode && countryCode.length === 2) {
          const data = await getNewsForCountry(countryCode);
          setNews(data);
        }
      } catch (err) {
        console.error("News fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [countryCode]);
  
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-4">Latest News</h3>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="glass-card p-4 animate-pulse">
            <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-3" />
            <div className="h-20 bg-gray-700/50 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage error={error} />;
  }
  
  if (news.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p>No news available for this country.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Latest News</h3>
      <div className="space-y-4">
        {news.slice(0, 5).map((article, index) => (
          <a 
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="glass-card p-4 hover:bg-white/5 transition-colors">
              <h4 className="font-medium mb-2 line-clamp-2">{article.title}</h4>
              <p className="text-sm text-gray-400 mb-2">
                {article.source.name} · {new Date(article.publishedAt).toLocaleDateString()}
              </p>
              {article.urlToImage && (
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                  onError={(e) => {
                    // Hide image on error
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <p className="text-sm text-gray-300 line-clamp-3">{article.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsList;
