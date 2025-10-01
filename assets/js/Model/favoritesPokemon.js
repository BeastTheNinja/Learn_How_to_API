// Favorites Pokemon Model - Handles local storage and favorites management
// This file manages the favorites system using localStorage for persistence

// Initialize favorites from localStorage
let favoritesPokemon = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];

// Favorites management functions
export function toggleFavorite(pokemon) {
    // Check if this Pokémon is already in favorites
    // Using findIndex for better performance than find + indexOf
    const existingIndex = favoritesPokemon.findIndex(fav => fav.id === pokemon.id);
    
    if (existingIndex !== -1) {
        // Remove from favorites - already exists
        favoritesPokemon.splice(existingIndex, 1);
        console.log(`Removed ${pokemon.name} from favorites`);
    } else {
        // Add to favorites - create simplified object to save storage space
        const favoriteData = {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.front_default,
            types: pokemon.types.map(type => type.type.name)
        };
        favoritesPokemon.push(favoriteData);
        console.log(`Added ${pokemon.name} to favorites`);
    }
    
    // Save to localStorage for persistence
    localStorage.setItem('pokemonFavorites', JSON.stringify(favoritesPokemon));
    
    return favoritesPokemon;
}

export function removeFavorite(pokemonId) {
    // Find and remove specific Pokemon from favorites
    const initialLength = favoritesPokemon.length;
    favoritesPokemon = favoritesPokemon.filter(pokemon => pokemon.id !== pokemonId);
    
    // Only update if something was actually removed
    if (favoritesPokemon.length < initialLength) {
        // Save updated favorites to localStorage
        localStorage.setItem('pokemonFavorites', JSON.stringify(favoritesPokemon));
        
        console.log(`Removed Pokemon with ID ${pokemonId} from favorites`);
    }
    
    return favoritesPokemon;
}

export function isFavorite(pokemonId) {
    return favoritesPokemon.some(fav => fav.id === pokemonId);
}

export function getFavorites() {
    return [...favoritesPokemon]; // Return a copy to prevent external modification
}

export function clearAllFavorites() {
    favoritesPokemon = [];
    localStorage.removeItem('pokemonFavorites');
    console.log('Cleared all favorites');
}