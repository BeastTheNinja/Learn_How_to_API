// App Controller - Main application initialization and coordination
// This file handles the overall application setup and feature coordination

// Import dependencies
import { popularPokemon, typeEffectiveness } from '../Model/pokemonData.js';
import { preloadPopularPokemon } from '../Model/pokeapi.js';
import { toggleDarkMode, initializeDarkMode, capitalizeFirst, getTypeColor } from '../view/utilityFunctions.js';
import { searchPokemon } from './pokemonController.js';

// Theme controller functions
function initializeThemeController() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Initialize dark mode based on saved preference
    initializeDarkMode();
}

// Autocomplete controller
function initializeAutocompleteController() {
    const searchInput = document.getElementById('pokemon-search');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            hideAutocomplete();
            return;
        }
        
        // Search through popular Pokemon for matches
        const suggestions = popularPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query)
        ).slice(0, 5); // Limit to 5 suggestions
        
        if (suggestions.length > 0) {
            showAutocomplete(suggestions);
        } else {
            hideAutocomplete();
        }
    });
    
    // Handle keyboard navigation in autocomplete
    searchInput.addEventListener('keydown', (e) => {
        const dropdown = document.getElementById('autocomplete-dropdown');
        if (!dropdown || dropdown.style.display === 'none') return;
        
        const items = dropdown.querySelectorAll('.autocomplete-item');
        let currentIndex = Array.from(items).findIndex(item => item.classList.contains('highlighted'));
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = (currentIndex + 1) % items.length;
                updateHighlight(items, currentIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                updateHighlight(items, currentIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0 && items[currentIndex]) {
                    const pokemonName = items[currentIndex].dataset.pokemon;
                    searchPokemon(pokemonName);
                    hideAutocomplete();
                }
                break;
            case 'Escape':
                hideAutocomplete();
                break;
        }
    });
    
    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-autocomplete');
        if (!searchContainer.contains(e.target)) {
            hideAutocomplete();
        }
    });
}

// Autocomplete display functions
function showAutocomplete(suggestions) {
    const dropdown = document.getElementById('autocomplete-dropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = suggestions.map(pokemon => `
        <div class="autocomplete-item" data-pokemon="${pokemon.name}">
            <span class="pokemon-id">#${pokemon.id}</span>
            <span class="pokemon-name">${capitalizeFirst(pokemon.name)}</span>
        </div>
    `).join('');
    
    // Add click listeners to items
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
            const pokemonName = item.dataset.pokemon;
            searchPokemon(pokemonName);
            hideAutocomplete();
        });
    });
    
    dropdown.style.display = 'block';
}

function hideAutocomplete() {
    const dropdown = document.getElementById('autocomplete-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

function updateHighlight(items, index) {
    items.forEach((item, i) => {
        item.classList.toggle('highlighted', i === index);
    });
}

// Type effectiveness controller
export function showTypeEffectiveness(pokemonTypes) {
    const section = document.getElementById('type-effectiveness');
    if (!section) return;
    
    // Get the first type for effectiveness calculation
    const primaryType = pokemonTypes[0].type.name;
    const effectiveness = typeEffectiveness[primaryType];
    
    if (!effectiveness) {
        hideTypeEffectiveness();
        return;
    }
    
    // Update the display with type effectiveness data
    const superEffectiveEl = document.getElementById('super-effective-types');
    const notVeryEffectiveEl = document.getElementById('not-very-effective-types');
    const noEffectEl = document.getElementById('no-effect-types');
    
    if (superEffectiveEl) {
        superEffectiveEl.innerHTML = effectiveness.weakTo.map(type => 
            `<span class="type-badge ${type}" style="background-color: ${getTypeColor(type)}">${capitalizeFirst(type)}</span>`
        ).join('');
    }
    
    if (notVeryEffectiveEl) {
        notVeryEffectiveEl.innerHTML = effectiveness.resistantTo.map(type => 
            `<span class="type-badge ${type}" style="background-color: ${getTypeColor(type)}">${capitalizeFirst(type)}</span>`
        ).join('');
    }
    
    if (noEffectEl) {
        noEffectEl.innerHTML = effectiveness.immuneTo.map(type => 
            `<span class="type-badge ${type}" style="background-color: ${getTypeColor(type)}">${capitalizeFirst(type)}</span>`
        ).join('');
    }
    
    section.style.display = 'block';
}

export function hideTypeEffectiveness() {
    const section = document.getElementById('type-effectiveness');
    if (section) {
        section.style.display = 'none';
    }
}

// Main application initialization
export function initializeApp() {
    console.log('Initializing PokéDex Explorer App...');
    
    // Initialize all controllers
    initializeThemeController();
    initializeAutocompleteController();
    
    // Preload popular Pokemon for better performance
    preloadPopularPokemon();
    
    console.log('PokéDex Explorer App initialized successfully!');
}