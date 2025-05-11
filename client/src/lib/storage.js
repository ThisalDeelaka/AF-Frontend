
// Favorites handling
export function getFavoriteCountries() {
  try {
    const stored = localStorage.getItem("globe-trotter-favorites");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
}

export function addFavoriteCountry(country) {
  try {
    const favorites = getFavoriteCountries();
    if (!favorites.some(fav => fav.cca3 === country.cca3)) {
      favorites.push(country);
      localStorage.setItem("globe-trotter-favorites", JSON.stringify(favorites));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return false;
  }
}

export function removeFavoriteCountry(countryCode) {
  try {
    const favorites = getFavoriteCountries();
    const updatedFavorites = favorites.filter(country => country.cca3 !== countryCode);
    localStorage.setItem("globe-trotter-favorites", JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return false;
  }
}

export function isFavorite(countryCode) {
  try {
    const favorites = getFavoriteCountries();
    return favorites.some(country => country.cca3 === countryCode);
  } catch (error) {
    console.error("Failed to check favorite status:", error);
    return false;
  }
}

// Puzzle progress handling
export function getPuzzleProgress(countryCode) {
  try {
    const allProgress = getAllPuzzleProgress();
    return allProgress.find(progress => progress.countryCode === countryCode) || null;
  } catch (error) {
    console.error("Failed to get puzzle progress:", error);
    return null;
  }
}

export function getAllPuzzleProgress() {
  try {
    const stored = localStorage.getItem("globe-trotter-puzzles");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load puzzle progress:", error);
    return [];
  }
}

export function savePuzzleProgress(progress) {
  try {
    const allProgress = getAllPuzzleProgress();
    const existingIndex = allProgress.findIndex(p => p.countryCode === progress.countryCode);
    
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progress;
    } else {
      allProgress.push(progress);
    }
    
    localStorage.setItem("globe-trotter-puzzles", JSON.stringify(allProgress));
    return true;
  } catch (error) {
    console.error("Failed to save puzzle progress:", error);
    return false;
  }
}

export function clearPuzzleProgress(countryCode) {
  try {
    const allProgress = getAllPuzzleProgress();
    const updatedProgress = allProgress.filter(p => p.countryCode !== countryCode);
    localStorage.setItem("globe-trotter-puzzles", JSON.stringify(updatedProgress));
    return true;
  } catch (error) {
    console.error("Failed to clear puzzle progress:", error);
    return false;
  }
}
