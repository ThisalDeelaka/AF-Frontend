
import { FavoriteCountry, PuzzleProgress } from "@/types";

const FAVORITES_KEY = "globe-trotter-favorites";
const PUZZLE_PROGRESS_KEY = "globe-trotter-puzzles";

// Favorites handling
export function getFavoriteCountries(): FavoriteCountry[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
}

export function addFavoriteCountry(country: FavoriteCountry): boolean {
  try {
    const favorites = getFavoriteCountries();
    if (!favorites.some(fav => fav.cca3 === country.cca3)) {
      favorites.push(country);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return false;
  }
}

export function removeFavoriteCountry(countryCode: string): boolean {
  try {
    const favorites = getFavoriteCountries();
    const updatedFavorites = favorites.filter(country => country.cca3 !== countryCode);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return false;
  }
}

export function isFavorite(countryCode: string): boolean {
  try {
    const favorites = getFavoriteCountries();
    return favorites.some(country => country.cca3 === countryCode);
  } catch (error) {
    console.error("Failed to check favorite status:", error);
    return false;
  }
}

// Puzzle progress handling
export function getPuzzleProgress(countryCode: string): PuzzleProgress | null {
  try {
    const allProgress = getAllPuzzleProgress();
    return allProgress.find(progress => progress.countryCode === countryCode) || null;
  } catch (error) {
    console.error("Failed to get puzzle progress:", error);
    return null;
  }
}

export function getAllPuzzleProgress(): PuzzleProgress[] {
  try {
    const stored = localStorage.getItem(PUZZLE_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load puzzle progress:", error);
    return [];
  }
}

export function savePuzzleProgress(progress: PuzzleProgress): boolean {
  try {
    const allProgress = getAllPuzzleProgress();
    const existingIndex = allProgress.findIndex(p => p.countryCode === progress.countryCode);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error("Failed to save puzzle progress:", error);
    return false;
  }
}

export function clearPuzzleProgress(countryCode: string): boolean {
  try {
    const allProgress = getAllPuzzleProgress();
    const updatedProgress = allProgress.filter(p => p.countryCode !== countryCode);
    localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify(updatedProgress));
    return true;
  } catch (error) {
    console.error("Failed to clear puzzle progress:", error);
    return false;
  }
}
