
import { Country, NewsArticle, Weather, ApiError } from "@/types";

const COUNTRIES_API_BASE = "https://restcountries.com/v3.1";
const WEATHER_API_KEY = "4d8fb5b93d4af21d66a2948710284366"; // OpenWeatherMap free API key
const NEWS_API_KEY = "d6d3c2ac1b614c05bbbf3032e3823654"; // NewsAPI free key

export async function fetchAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${COUNTRIES_API_BASE}/all`);
    if (!response.ok) {
      throw new Error(`Error fetching countries: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    throw { message: "Failed to load countries" } as ApiError;
  }
}

export async function searchCountriesByName(name: string): Promise<Country[]> {
  try {
    const response = await fetch(`${COUNTRIES_API_BASE}/name/${name}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Error searching countries: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to search countries:", error);
    if ((error as any).message?.includes('404')) {
      return [];
    }
    throw { message: "Failed to search countries" } as ApiError;
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  try {
    const response = await fetch(`${COUNTRIES_API_BASE}/alpha/${code}`);
    if (!response.ok) {
      throw new Error(`Error fetching country: ${response.status}`);
    }
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Failed to fetch country with code ${code}:`, error);
    throw { message: `Failed to load country details for ${code}` } as ApiError;
  }
}

export async function fetchCountriesByRegion(region: string): Promise<Country[]> {
  try {
    const response = await fetch(`${COUNTRIES_API_BASE}/region/${region}`);
    if (!response.ok) {
      throw new Error(`Error fetching region: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch countries by region ${region}:`, error);
    throw { message: `Failed to load countries in ${region}` } as ApiError;
  }
}

export async function fetchCountriesByCapital(capital: string): Promise<Country[]> {
  try {
    const response = await fetch(`${COUNTRIES_API_BASE}/capital/${capital}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Error fetching by capital: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch countries by capital ${capital}:`, error);
    if ((error as any).message?.includes('404')) {
      return [];
    }
    throw { message: `Failed to load countries with capital ${capital}` } as ApiError;
  }
}

export async function getWeatherForCity(city: string): Promise<Weather> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching weather: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch weather for ${city}:`, error);
    throw { message: `Failed to load weather for ${city}` } as ApiError;
  }
}

export async function getNewsForCountry(countryCode: string): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${countryCode.toLowerCase()}&apiKey=${NEWS_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching news: ${response.status}`);
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error(`Failed to fetch news for ${countryCode}:`, error);
    throw { message: `Failed to load news for this country` } as ApiError;
  }
}

// Placeholder images for countries when we need images for the puzzle game
export const getCountryImage = (countryCode: string): string => {
  // Real app would have actual landmarks, using placeholders for now
  const placeholders = [
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    "https://images.unsplash.com/photo-1466442929976-97f336a657be",
    "https://images.unsplash.com/photo-1517022812141-23620dba5c23"
  ];
  
  // Deterministic selection based on country code to always get the same image
  const index = countryCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % placeholders.length;
  return placeholders[index];
};

// Get country map image using open-source map tiles
export const getCountryMapImage = (countryCode: string): string => {
  // Use Static Maps API for country maps
  // This is a placeholder approach - real implementation would use an actual static maps API with proper API key
  const mapPlaceholders = [
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce", // Map 1
    "https://images.unsplash.com/photo-1604357209793-fca5dca89f97", // Map 2
    "https://images.unsplash.com/photo-1472448352019-15f4081b66a1", // Map 3
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455", // Map 4
    "https://images.unsplash.com/photo-1487260211189-670c54da558d", // Map 5
    "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4", // Map 6
    "https://images.unsplash.com/photo-1524661135-423995f22d0b", // Map 7
    "https://images.unsplash.com/photo-1537683258444-3eedac9d3890", // Map 8
    "https://images.unsplash.com/photo-1589519160732-57fc6ed17a56", // Map 9
    "https://images.unsplash.com/photo-1591031373618-8c4c11723dbd"  // Map 10
  ];

  // Deterministic selection based on country code to always get the same map
  const index = countryCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mapPlaceholders.length;
  return mapPlaceholders[index];
};
