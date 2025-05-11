// index.js

// Country object structure
export const Country = {
  name: {
    common: '',
    official: '',
    nativeName: {
      // Example: 'en': { official: 'English', common: 'English' }
    },
  },
  cca2: '',
  cca3: '',
  capital: [],
  region: '',
  subregion: '',
  languages: {
    // Example: 'en': 'English'
  },
  borders: [],
  population: 0,
  flags: {
    png: '',
    svg: '',
    alt: '',
  },
  maps: {
    googleMaps: '',
    openStreetMaps: '',
  },
  currencies: {
    // Example: 'USD': { name: 'Dollar', symbol: '$' }
  },
  continents: [],
  area: 0,
  timezones: [],
  latlng: [0, 0],
};

// Weather object structure
export const Weather = {
  main: {
    temp: 0,
    feels_like: 0,
    temp_min: 0,
    temp_max: 0,
    humidity: 0,
    pressure: 0,
  },
  weather: [
    {
      id: 0,
      main: '',
      description: '',
      icon: '',
    },
  ],
  wind: {
    speed: 0,
    deg: 0,
  },
  name: '',
  dt: 0,
};

// NewsArticle object structure
export const NewsArticle = {
  author: '',
  content: '',
  description: '',
  publishedAt: '',
  source: {
    id: '',
    name: '',
  },
  title: '',
  url: '',
  urlToImage: '',
};

// PuzzlePiece object structure
export const PuzzlePiece = {
  id: 0,
  x: 0,
  y: 0,
  correctX: 0,
  correctY: 0,
  width: 0,
  height: 0,
  image: '',
  isPlaced: false,
};

// FavoriteCountry object structure
export const FavoriteCountry = {
  cca3: '',
  name: '',
  flagUrl: '',
};

// PuzzleProgress object structure
export const PuzzleProgress = {
  countryCode: '',
  pieces: [],
  isCompleted: false,
  startedAt: 0,
  completedAt: 0,
  puzzleType: 'image', // or 'map'
};

// ApiError object structure
export const ApiError = {
  message: '',
  status: 0,
};
