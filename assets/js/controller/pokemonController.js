// Pokemon Search Controller - Handles search functionality and user interactions
// This file coordinates between the Pokemon API model and display views

// Import dependencies
import { fetchPokemon } from '../Model/pokeapi.js';
import { getRandomPokemonId } from '../Model/pokemonData.js';
import { toggleFavorite, removeFavorite } from '../Model/favoritesPokemon.js';
import { displayPokemon, showError, showLoadingState, hideLoadingState } from '../view/pokemonDisplay.js';
import { updateFavoritesDisplay, updateFavoriteButton } from '../view/favoritesView.js';

// Main search function that coordinates Model and View
export async function searchPokemon(name) {
    // Show loading state
    showLoadingState();
    
    // Update the search input to show what was searched
    // This provides visual feedback to the user
    const searchInput = document.getElementById('pokemon-search');
    if (searchInput) {
        searchInput.value = name;
    }
    
    try {
        // Get data from model
        const pokemonData = await fetchPokemon(name);
        
        // Display data using view
        displayPokemon(pokemonData);
        
        // Update favorite button state
        updateFavoriteButton(pokemonData);
        
    } catch (error) {
        // Handle errors using view
        showError(error.message);
    } finally {
        // Hide loading state
        hideLoadingState();
    }
}

// Random Pokemon controller function
export async function getRandomPokemon() {
    const randomId = getRandomPokemonId();
    await searchPokemon(randomId.toString());
}

// Surprise Pokemon controller - uses curated list
export async function getSurprisePokemon() {
    // Array of legendary/popular Pokémon for special feature
    // This creates a curated experience
    const specialPokemon = [
        'mewtwo', 'mew', 'articuno', 'zapdos', 'moltres', 'dragonite', 
        'lugia', 'ho-oh', 'celebi', 'rayquaza', 'dialga', 'palkia', 
        'giratina', 'arceus', 'pikachu', 'charizard', 'blastoise', 'venusaur'
    ];
    
    // Random array element selection
    const randomSpecial = specialPokemon[Math.floor(Math.random() * specialPokemon.length)];
    await searchPokemon(randomSpecial);
}

// Favorites controller - coordinates between favorites model and view
export async function handleToggleFavorite(pokemon) {
    try {
        // Update model
        toggleFavorite(pokemon);
        
        // Update views
        updateFavoritesDisplay();
        updateFavoriteButton(pokemon);
        
    } catch (error) {
        console.error('Error toggling favorite:', error);
        showError('Failed to update favorites');
    }
}

// Remove favorite controller
export function handleRemoveFavorite(pokemonId) {
    try {
        // Update model
        removeFavorite(pokemonId);
        
        // Update views
        updateFavoritesDisplay();
        
        // Update current pokemon display if it matches
        const currentPokemonCard = document.querySelector('.pokemon-card');
        if (currentPokemonCard) {
            const currentId = parseInt(currentPokemonCard.querySelector('.pokemon-id').textContent.replace('#', ''));
            if (currentId === pokemonId) {
                // Update the button state for the current pokemon
                updateFavoriteButton({ id: pokemonId });
            }
        }
        
    } catch (error) {
        console.error('Error removing favorite:', error);
        showError('Failed to remove from favorites');
    }
}

// Initialize search functionality
function initializeSearchController() {
    const searchBtn = document.getElementById('search-btn');
    const randomBtn = document.getElementById('random-btn');
    const surpriseBtn = document.getElementById('surprise-btn');
    const searchInput = document.getElementById('pokemon-search');

    // Search button event listener
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                searchPokemon(searchTerm);
            } else {
                showError('Please enter a Pokémon name or ID!');
            }
        });
    }

    // Random button event listener
    if (randomBtn) {
        randomBtn.addEventListener('click', getRandomPokemon);
    }

    // Surprise button event listener
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', getSurprisePokemon);
    }

    // Keyboard event handling
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
        
        // Auto-focus for immediate user interaction
        searchInput.focus();
    }
}

// Export controller initialization for main app
export function initializePokemonController() {
    initializeSearchController();
    // Initialize favorites display
    updateFavoritesDisplay();
}