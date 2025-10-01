// Favorites View - Handles favorites display and UI updates
// This file manages the visual representation of the favorites system

// Import dependencies
import { capitalizeFirst } from './utilityFunctions.js';
import { getFavorites, isFavorite } from '../Model/favoritesPokemon.js';

// Update the favorites display in the UI
export function updateFavoritesDisplay() {
    const favoritesSection = document.getElementById('favorites-section');
    const favoritesGrid = document.getElementById('favorites-grid');
    
    if (!favoritesSection || !favoritesGrid) return;
    
    const favoritesPokemon = getFavorites();
    
    if (favoritesPokemon.length === 0) {
        favoritesSection.style.display = 'none';
        favoritesGrid.innerHTML = `
            <div class="no-favorites">
                <p>No favorite Pokémon yet! Click the heart button on any Pokémon to add them here.</p>
            </div>
        `;
    } else {
        favoritesSection.style.display = 'block';
        favoritesGrid.innerHTML = favoritesPokemon.map(pokemon => `
            <div class="favorite-item" onclick="window.searchPokemon?.('${pokemon.name}')">
                <button class="remove-favorite" onclick="event.stopPropagation(); window.handleRemoveFavorite?.(${pokemon.id})" title="Remove from favorites">✕</button>
                <img src="${pokemon.sprite}" alt="${pokemon.name}" loading="lazy">
                <div class="favorite-name">${capitalizeFirst(pokemon.name)}</div>
                <div class="favorite-types">
                    ${pokemon.types.map(type => `<span class="type-badge ${type}">${capitalizeFirst(type)}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
}

// Update the favorite button state for the currently displayed Pokemon
export function updateFavoriteButton(pokemon) {
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (!favoriteBtn) return;
    
    const isFavorited = isFavorite(pokemon.id);
    
    if (isFavorited) {
        favoriteBtn.classList.add('favorited');
        favoriteBtn.innerHTML = '<span class="heart-icon">❤️</span> Remove from Favorites';
    } else {
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.innerHTML = '<span class="heart-icon">🤍</span> Add to Favorites';
    }
}

// Show/hide favorites section based on content
export function toggleFavoritesSection(show = null) {
    const favoritesSection = document.getElementById('favorites-section');
    if (!favoritesSection) return;
    
    if (show === null) {
        // Auto-detect based on favorites count
        const favoritesPokemon = getFavorites();
        show = favoritesPokemon.length > 0;
    }
    
    favoritesSection.style.display = show ? 'block' : 'none';
}