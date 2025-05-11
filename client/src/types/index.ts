export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  languages?: {
    [key: string]: string;
  };
  borders?: string[];
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  continents: string[];
  area?: number;
  timezones?: string[];
  latlng?: [number, number];
}

export interface Weather {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
}

export interface NewsArticle {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  title: string;
  url: string;
  urlToImage: string;
}

export interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  correctX: number;
  correctY: number;
  width: number;
  height: number;
  image: string;
  isPlaced: boolean;
}

export interface FavoriteCountry {
  cca3: string;
  name: string;
  flagUrl: string;
}

export interface PuzzleProgress {
  countryCode: string;
  pieces: PuzzlePiece[];
  isCompleted: boolean;
  startedAt: number;
  completedAt?: number;
  puzzleType?: "image" | "map";
}

export interface ApiError {
  message: string;
  status?: number;
}