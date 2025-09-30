// PokéDex Explorer - Pokémon API Integration
// This application demonstrates advanced JavaScript concepts:
// - Async/await for handling API calls
// - Fetch API for HTTP requests  
// - Error handling with try/catch
// - DOM manipulation and event handling
// - Modern ES6+ features (template literals, arrow functions, destructuring)

console.log('PokéDex Explorer loaded successfully!');

// API Configuration - Constants for our external API
// Using const ensures these values cannot be accidentally changed
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';  // Base URL for PokéAPI
const POKEMON_ENDPOINT = `${POKEAPI_BASE}/pokemon`; // Template literal to build endpoint

// Cache System - Using Map for performance optimization
// Map is more efficient than objects for frequent additions/deletions
// This prevents unnecessary API calls for previously fetched Pokémon
const pokemonCache = new Map();

// =============================================================================
// NEW ENHANCED FEATURES STORAGE
// Local Storage for persistent data and autocomplete functionality
// =============================================================================

// Favorites system using localStorage
let favoritesPokemon = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];

// Autocomplete data - popular Pokemon for suggestions
const popularPokemon = [
    { id: 25, name: 'pikachu' }, { id: 6, name: 'charizard' }, { id: 9, name: 'blastoise' },
    { id: 3, name: 'venusaur' }, { id: 150, name: 'mewtwo' }, { id: 151, name: 'mew' },
    { id: 144, name: 'articuno' }, { id: 145, name: 'zapdos' }, { id: 146, name: 'moltres' },
    { id: 149, name: 'dragonite' }, { id: 249, name: 'lugia' }, { id: 250, name: 'ho-oh' },
    { id: 251, name: 'celebi' }, { id: 384, name: 'rayquaza' }, { id: 483, name: 'dialga' },
    { id: 484, name: 'palkia' }, { id: 487, name: 'giratina' }, { id: 493, name: 'arceus' },
    { id: 1, name: 'bulbasaur' }, { id: 4, name: 'charmander' }, { id: 7, name: 'squirtle' },
    { id: 54, name: 'psyduck' }, { id: 104, name: 'cubone' }, { id: 113, name: 'chansey' },
    { id: 131, name: 'lapras' }, { id: 133, name: 'eevee' }, { id: 448, name: 'lucario' }
];

// Type effectiveness data for educational feature
const typeEffectiveness = {
    normal: { weakTo: ['fighting'], resistantTo: [], immuneTo: ['ghost'] },
    fire: { weakTo: ['water', 'ground', 'rock'], resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immuneTo: [] },
    water: { weakTo: ['electric', 'grass'], resistantTo: ['fire', 'water', 'ice', 'steel'], immuneTo: [] },
    electric: { weakTo: ['ground'], resistantTo: ['electric', 'flying', 'steel'], immuneTo: [] },
    grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resistantTo: ['water', 'electric', 'grass', 'ground'], immuneTo: [] },
    ice: { weakTo: ['fire', 'fighting', 'rock', 'steel'], resistantTo: ['ice'], immuneTo: [] },
    fighting: { weakTo: ['flying', 'psychic', 'fairy'], resistantTo: ['bug', 'rock', 'dark'], immuneTo: [] },
    poison: { weakTo: ['ground', 'psychic'], resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immuneTo: [] },
    ground: { weakTo: ['water', 'grass', 'ice'], resistantTo: ['poison', 'rock'], immuneTo: ['electric'] },
    flying: { weakTo: ['electric', 'ice', 'rock'], resistantTo: ['grass', 'fighting', 'bug'], immuneTo: ['ground'] },
    psychic: { weakTo: ['bug', 'ghost', 'dark'], resistantTo: ['fighting', 'psychic'], immuneTo: [] },
    bug: { weakTo: ['fire', 'flying', 'rock'], resistantTo: ['grass', 'fighting', 'ground'], immuneTo: [] },
    rock: { weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], resistantTo: ['normal', 'fire', 'poison', 'flying'], immuneTo: [] },
    ghost: { weakTo: ['ghost', 'dark'], resistantTo: ['poison', 'bug'], immuneTo: ['normal', 'fighting'] },
    dragon: { weakTo: ['ice', 'dragon', 'fairy'], resistantTo: ['fire', 'water', 'electric', 'grass'], immuneTo: [] },
    dark: { weakTo: ['fighting', 'bug', 'fairy'], resistantTo: ['ghost', 'dark'], immuneTo: ['psychic'] },
    steel: { weakTo: ['fire', 'fighting', 'ground'], resistantTo: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immuneTo: ['poison'] },
    fairy: { weakTo: ['poison', 'steel'], resistantTo: ['fighting', 'bug', 'dark'], immuneTo: ['dragon'] }
};

// Main function to fetch Pokémon data from the API
// 'async' keyword allows us to use 'await' inside this function
// This makes asynchronous code look and behave more like synchronous code
async function fetchPokemon(pokemonName) {
    // Get DOM elements we'll need to update during the process
    const loadingElement = document.getElementById('loading');
    const outputElement = document.getElementById('output');
    
    // try/catch block for comprehensive error handling
    // 'try' contains code that might fail, 'catch' handles any errors
    try {
        // Show loading indicator to improve user experience
        // Optional chaining (?.) prevents errors if element doesn't exist
        if (loadingElement) loadingElement.style.display = 'block';
        
        // Data sanitization - clean user input to prevent issues
        // toString() ensures we can handle both strings and numbers
        // toLowerCase() makes search case-insensitive
        // trim() removes leading/trailing whitespace
        const cleanName = pokemonName.toString().toLowerCase().trim();
        
        // Cache check - avoid unnecessary API calls for better performance
        // Map.has() is O(1) operation - very fast lookup
        if (pokemonCache.has(cleanName)) {
            console.log('Using cached data for:', cleanName);
            displayPokemon(pokemonCache.get(cleanName));
            return; // Exit early if we have cached data
        }
        
        console.log('Fetching Pokémon:', cleanName);
        
        // Fetch API call - modern way to make HTTP requests
        // 'await' pauses execution until the Promise resolves
        // Template literal (${}) injects the cleanName into the URL
        const response = await fetch(`${POKEMON_ENDPOINT}/${cleanName}`);
        
        // HTTP status code checking - fetch doesn't reject on 4xx/5xx by default
        // response.ok is true for status codes 200-299
        if (!response.ok) {
            // Handle specific error cases for better user experience
            if (response.status === 404) {
                throw new Error(`Pokémon "${pokemonName}" not found! Try a different name or ID.`);
            } else {
                throw new Error(`Failed to fetch Pokémon data (Status: ${response.status})`);
            }
        }
        
        // Parse JSON response - convert response body to JavaScript object
        // This is also asynchronous, so we use await
        const pokemonData = await response.json();
        console.log('Pokémon data received:', pokemonData);
        
        // Store in cache for future use - improves performance
        // Using the cleaned name as key ensures consistency
        pokemonCache.set(cleanName, pokemonData);
        
        // Display the Pokémon data to the user
        displayPokemon(pokemonData);
        
    } catch (error) {
        // Error handling - catch any errors from the try block
        // This includes network errors, JSON parsing errors, or custom thrown errors
        console.error('Error fetching Pokémon:', error);
        showError(error.message);
    } finally {
        // 'finally' block always executes, regardless of success or failure
        // Perfect for cleanup operations like hiding loading indicators
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

// Complex function to display Pokémon data in HTML format
// This demonstrates advanced DOM manipulation and data processing
function displayPokemon(pokemon) {
    // Get the output container element from the DOM
    const output = document.getElementById('output');
    
    // Guard clause - early return if required elements/data are missing
    // This prevents errors and makes the function more robust
    if (!output || !pokemon) {
        console.error('Output element or Pokémon data not found!');
        return;
    }
    
    // Data extraction with fallback handling
    // Optional chaining (?.) prevents errors if nested properties don't exist
    // Logical OR (||) provides fallback values
    const frontSprite = pokemon.sprites.front_default;
    const backSprite = pokemon.sprites.back_default;
    const officialArtwork = pokemon.sprites.other['official-artwork']?.front_default;
    const dreamWorld = pokemon.sprites.other.dream_world?.front_default;
    
    // Priority-based image selection - choose the best available image
    // Logical OR (||) returns the first truthy value
    const primaryImage = officialArtwork || dreamWorld || frontSprite;
    
    // Data transformation using Array.map() - functional programming concept
    // map() creates a new array by transforming each element
    const stats = pokemon.stats.map(stat => ({
        name: formatStatName(stat.stat.name),           // Transform stat names to readable format
        value: stat.base_stat,                          // Extract the numeric value
        percentage: Math.min((stat.base_stat / 200) * 100, 100) // Calculate percentage for visual bar (max 100%)
    }));
    
    // Transform types data and add color information
    const types = pokemon.types.map(type => ({
        name: capitalizeFirst(type.type.name),          // Capitalize for display
        color: getTypeColor(type.type.name)             // Get corresponding color
    }));
    
    // Transform abilities data, handling hidden abilities
    const abilities = pokemon.abilities.map(ability => ({
        name: formatAbilityName(ability.ability.name),  // Format name (replace hyphens with spaces)
        isHidden: ability.is_hidden                     // Boolean flag for hidden abilities
    }));
    
    // Dynamic HTML generation using template literals
    // Template literals allow multi-line strings and variable interpolation with ${}
    // This creates a complex HTML structure programmatically
    output.innerHTML = `
        <div class="pokemon-card">
            <div class="pokemon-header">
                <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div>
                <h2 class="pokemon-name">${capitalizeFirst(pokemon.name)}</h2>
                <div class="pokemon-types">
                    ${types.map(type => 
                        `<span class="type-badge ${type.name.toLowerCase()}" style="background-color: ${type.color}">${type.name}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div class="pokemon-content">
                <div class="pokemon-image-section">
                    <div class="main-image">
                        <img src="${primaryImage}" alt="${pokemon.name}" class="pokemon-image">
                    </div>
                    <div class="sprite-gallery">
                        ${frontSprite ? `<img src="${frontSprite}" alt="${pokemon.name} front" class="sprite">` : ''}
                        ${backSprite ? `<img src="${backSprite}" alt="${pokemon.name} back" class="sprite">` : ''}
                    </div>
                </div>
                
                <div class="pokemon-info">
                    <div class="basic-info">
                        <div class="info-item">
                            <span class="label">Height:</span>
                            <span class="value">${(pokemon.height / 10).toFixed(1)} m</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Weight:</span>
                            <span class="value">${(pokemon.weight / 10).toFixed(1)} kg</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Experience:</span>
                            <span class="value">${pokemon.base_experience}</span>
                        </div>
                    </div>
                    
                    <div class="abilities-section">
                        <h4>Abilities</h4>
                        <div class="abilities">
                            ${abilities.map(ability => 
                                `<span class="ability ${ability.isHidden ? 'hidden' : ''}" title="${ability.isHidden ? 'Hidden Ability' : 'Normal Ability'}">
                                    ${ability.name} ${ability.isHidden ? '(Hidden)' : ''}
                                </span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="stats-section">
                <h4>Base Stats</h4>
                <div class="stats-grid">
                    ${stats.map(stat => `
                        <div class="stat-item">
                            <div class="stat-info">
                                <span class="stat-name">${stat.name}</span>
                                <span class="stat-value">${stat.value}</span>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-fill" style="width: ${stat.percentage}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="total-stats">
                    <strong>Total: ${stats.reduce((sum, stat) => sum + stat.value, 0)}</strong>
                </div>
            </div>
            
            <div class="pokemon-actions">
                <button class="action-btn secondary" onclick="getRandomPokemon()">🎲 Another Random</button>
                <button class="favorite-btn" onclick="toggleFavorite(${JSON.stringify(pokemon).replace(/"/g, '&quot;')})">
                    <span class="heart-icon">🤍</span> Add to Favorites
                </button>
                <button class="action-btn" onclick="navigator.share ? navigator.share({title: 'Check out ${capitalizeFirst(pokemon.name)}!', text: 'Found this cool Pokémon: ${capitalizeFirst(pokemon.name)} #${pokemon.id}', url: window.location.href}) : copyPokemonInfo('${pokemon.name}', ${pokemon.id})">📤 Share</button>
            </div>
        </div>
    `;
    
    // Update favorite button state
    updateFavoriteButton(pokemon);
    
    // Show type effectiveness
    showTypeEffectiveness(pokemon.types);
}

// Random number generation function - demonstrates Math.random() usage
// PokéAPI has over 1010 Pokémon, so we limit to that range
function getRandomPokemon() {
    // Math.random() returns 0-0.999..., multiply by 1010 gives 0-1009.999...
    // Math.floor() rounds down to get integer: 0-1009
    // Add 1 to get range 1-1010 (Pokémon IDs start at 1, not 0)
    const randomId = Math.floor(Math.random() * 1010) + 1;
    fetchPokemon(randomId);
}

// Utility function for quick searches - updates UI and calls main function
// This demonstrates function composition and user experience design
function searchPokemon(name) {
    // Update the search input to show what was searched
    // This provides visual feedback to the user
    const searchInput = document.getElementById('pokemon-search');
    if (searchInput) {
        searchInput.value = name;
    }
    // Call the main fetch function
    fetchPokemon(name);
}

// Error handling function - creates user-friendly error messages
// Good UX design includes helpful error states with recovery options
function showError(message) {
    const output = document.getElementById('output');
    if (output) {
        // Hide type effectiveness on error
        hideTypeEffectiveness();
        
        // Create an error UI with multiple recovery options
        // Template literal allows complex HTML with embedded JavaScript
        // onclick attributes demonstrate inline event handling (though event listeners are preferred)
        output.innerHTML = `
            <div class="error-message">
                <div class="error-icon">😕</div>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <div class="error-actions">
                    <button onclick="getRandomPokemon()" class="retry-button">🎲 Try Random Pokémon</button>
                    <button onclick="document.getElementById('pokemon-search').value = ''; document.getElementById('pokemon-search').focus()" class="retry-button secondary">🔍 Search Again</button>
                </div>
            </div>
        `;
    }
}

// =============================================================================
// UTILITY FUNCTIONS - Helper functions for data processing and formatting
// These demonstrate functional programming concepts and code reusability
// =============================================================================

// String manipulation utility - handles capitalization
function capitalizeFirst(str) {
    // charAt(0) gets first character, slice(1) gets rest of string
    // This is more reliable than other capitalization methods
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Data mapping function - converts API stat names to user-friendly names
// Object mapping is a common pattern for data transformation
function formatStatName(statName) {
    // Object literal used as a lookup table/dictionary
    // This is more maintainable than a series of if/else statements
    const statMap = {
        'hp': 'HP',
        'attack': 'Attack',
        'defense': 'Defense',
        'special-attack': 'Sp. Attack',      // API uses hyphens, we want spaces
        'special-defense': 'Sp. Defense',
        'speed': 'Speed'
    };
    // Logical OR (||) provides fallback if stat not in map
    return statMap[statName] || capitalizeFirst(statName);
}

// String formatting function - handles hyphenated ability names
function formatAbilityName(abilityName) {
    // Method chaining - multiple operations in sequence
    // split('-') creates array of words separated by hyphens
    // map() transforms each word by capitalizing it
    // join(' ') combines words back into string with spaces
    return abilityName.split('-').map(word => capitalizeFirst(word)).join(' ');
}

// Color mapping function - assigns colors to Pokémon types
// This creates a visual connection between data and presentation
function getTypeColor(type) {
    // Comprehensive color mapping based on traditional Pokémon type colors
    // Using hex color codes for precise color control
    const typeColors = {
        normal: '#A8A878',    // Tan/beige for normal types
        fire: '#F08030',      // Orange-red for fire types
        water: '#6890F0',     // Blue for water types
        electric: '#F8D030',  // Yellow for electric types
        grass: '#78C850',     // Green for grass types
        ice: '#98D8D8',       // Light blue for ice types
        fighting: '#C03028',  // Dark red for fighting types
        poison: '#A040A0',    // Purple for poison types
        ground: '#E0C068',    // Brown for ground types
        flying: '#A890F0',    // Light purple for flying types
        psychic: '#F85888',   // Pink for psychic types
        bug: '#A8B820',       // Yellow-green for bug types
        rock: '#B8A038',      // Dark tan for rock types
        ghost: '#705898',     // Dark purple for ghost types
        dragon: '#7038F8',    // Blue-purple for dragon types
        dark: '#705848',      // Dark brown for dark types
        steel: '#B8B8D0',     // Gray for steel types
        fairy: '#EE99AC'      // Light pink for fairy types
    };
    // Return specific color or default if type not found
    return typeColors[type] || '#68A090';
}

// =============================================================================
// ENHANCED FEATURES IMPLEMENTATION
// Dark Mode, Autocomplete, Favorites, Type Effectiveness
// =============================================================================

// Dark Mode Toggle Functionality
function toggleDarkMode() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    // Toggle dark mode class
    body.classList.toggle('dark-mode');
    
    // Update icon and save preference
    const isDarkMode = body.classList.contains('dark-mode');
    themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode);
    
    console.log('Dark mode:', isDarkMode ? 'enabled' : 'disabled');
}

// Initialize dark mode from saved preference
function initializeDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (savedDarkMode) {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    }
}

// Search Autocomplete Functionality
function initializeAutocomplete() {
    const searchInput = document.getElementById('pokemon-search');
    const dropdown = document.getElementById('autocomplete-dropdown');
    let currentHighlight = -1;
    
    if (!searchInput || !dropdown) return;
    
    // Show autocomplete suggestions
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        currentHighlight = -1;
        
        if (query.length < 2) {
            hideAutocomplete();
            return;
        }
        
        // Filter Pokemon that match the query
        const suggestions = popularPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query) || 
            pokemon.id.toString().includes(query)
        ).slice(0, 8); // Limit to 8 suggestions
        
        if (suggestions.length > 0) {
            showAutocomplete(suggestions);
        } else {
            hideAutocomplete();
        }
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentHighlight = Math.min(currentHighlight + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentHighlight = Math.max(currentHighlight - 1, -1);
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentHighlight >= 0 && items[currentHighlight]) {
                const pokemonName = items[currentHighlight].dataset.pokemon;
                searchInput.value = pokemonName;
                fetchPokemon(pokemonName);
                hideAutocomplete();
            } else {
                // Normal search
                document.getElementById('search-btn').click();
            }
        } else if (e.key === 'Escape') {
            hideAutocomplete();
        }
    });
    
    // Hide autocomplete when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            hideAutocomplete();
        }
    });
}

function showAutocomplete(suggestions) {
    const dropdown = document.getElementById('autocomplete-dropdown');
    
    dropdown.innerHTML = suggestions.map(pokemon => `
        <div class="autocomplete-item" data-pokemon="${pokemon.name}">
            <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
            <span class="pokemon-name">${capitalizeFirst(pokemon.name)}</span>
        </div>
    `).join('');
    
    // Add click listeners
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
            const pokemonName = item.dataset.pokemon;
            document.getElementById('pokemon-search').value = pokemonName;
            fetchPokemon(pokemonName);
            hideAutocomplete();
        });
    });
    
    dropdown.classList.add('show');
}

function hideAutocomplete() {
    const dropdown = document.getElementById('autocomplete-dropdown');
    dropdown.classList.remove('show');
}

function updateHighlight(items) {
    items.forEach((item, index) => {
        item.classList.toggle('highlighted', index === currentHighlight);
    });
}

// Favorites System Functionality
function toggleFavorite(pokemon) {
    const pokemonId = pokemon.id;
    const index = favoritesPokemon.findIndex(fav => fav.id === pokemonId);
    
    if (index > -1) {
        // Remove from favorites
        favoritesPokemon.splice(index, 1);
        console.log('Removed from favorites:', pokemon.name);
    } else {
        // Add to favorites
        const favoriteData = {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork']?.front_default || 
                   pokemon.sprites.other.dream_world?.front_default || 
                   pokemon.sprites.front_default
        };
        favoritesPokemon.push(favoriteData);
        console.log('Added to favorites:', pokemon.name);
    }
    
    // Save to localStorage
    localStorage.setItem('pokemonFavorites', JSON.stringify(favoritesPokemon));
    
    // Update favorites display
    updateFavoritesDisplay();
    
    // Update the heart button in current Pokemon display
    updateFavoriteButton(pokemon);
    
    return favoritesPokemon.some(fav => fav.id === pokemonId);
}

function updateFavoritesDisplay() {
    const favoritesSection = document.getElementById('favorites-section');
    const favoritesGrid = document.getElementById('favorites-grid');
    
    if (!favoritesSection || !favoritesGrid) return;
    
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
            <div class="favorite-item" onclick="searchPokemon('${pokemon.name}')">
                <button class="remove-favorite" onclick="event.stopPropagation(); removeFavorite(${pokemon.id})" title="Remove from favorites">✕</button>
                <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy">
                <div class="favorite-name">${capitalizeFirst(pokemon.name)}</div>
            </div>
        `).join('');
    }
}

function removeFavorite(pokemonId) {
    favoritesPokemon = favoritesPokemon.filter(fav => fav.id !== pokemonId);
    localStorage.setItem('pokemonFavorites', JSON.stringify(favoritesPokemon));
    updateFavoritesDisplay();
    
    // Update heart button if this Pokemon is currently displayed
    const currentPokemonCard = document.querySelector('.pokemon-card');
    if (currentPokemonCard) {
        const currentId = parseInt(currentPokemonCard.querySelector('.pokemon-id').textContent.replace('#', ''));
        if (currentId === pokemonId) {
            const heartBtn = document.querySelector('.favorite-btn');
            if (heartBtn) {
                heartBtn.classList.remove('favorited');
                heartBtn.innerHTML = '<span class="heart-icon">🤍</span> Add to Favorites';
            }
        }
    }
}

function updateFavoriteButton(pokemon) {
    const favoriteBtn = document.querySelector('.favorite-btn');
    if (!favoriteBtn) return;
    
    const isFavorited = favoritesPokemon.some(fav => fav.id === pokemon.id);
    
    if (isFavorited) {
        favoriteBtn.classList.add('favorited');
        favoriteBtn.innerHTML = '<span class="heart-icon">❤️</span> Remove from Favorites';
    } else {
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.innerHTML = '<span class="heart-icon">🤍</span> Add to Favorites';
    }
}

// Type Effectiveness Display
function showTypeEffectiveness(pokemonTypes) {
    const effectivenessSection = document.getElementById('type-effectiveness');
    const superEffectiveEl = document.getElementById('super-effective-types');
    const notVeryEffectiveEl = document.getElementById('not-very-effective-types');
    const noEffectEl = document.getElementById('no-effect-types');
    
    if (!effectivenessSection || !pokemonTypes || pokemonTypes.length === 0) return;
    
    // Combine effectiveness for all types
    const combinedEffectiveness = {
        superEffective: new Set(),
        notVeryEffective: new Set(),
        noEffect: new Set()
    };
    
    pokemonTypes.forEach(typeObj => {
        const typeName = typeObj.type.name;
        const effectiveness = typeEffectiveness[typeName];
        
        if (effectiveness) {
            effectiveness.weakTo.forEach(type => combinedEffectiveness.superEffective.add(type));
            effectiveness.resistantTo.forEach(type => combinedEffectiveness.notVeryEffective.add(type));
            effectiveness.immuneTo.forEach(type => combinedEffectiveness.noEffect.add(type));
        }
    });
    
    // Display the effectiveness
    superEffectiveEl.innerHTML = Array.from(combinedEffectiveness.superEffective).map(type => 
        `<span class="type-badge-small" style="background-color: ${getTypeColor(type)}">${capitalizeFirst(type)}</span>`
    ).join('') || '<span style="color: #6c757d;">None</span>';
    
    notVeryEffectiveEl.innerHTML = Array.from(combinedEffectiveness.notVeryEffective).map(type => 
        `<span class="type-badge-small" style="background-color: ${getTypeColor(type)}">${capitalizeFirst(type)}</span>`
    ).join('') || '<span style="color: #6c757d;">None</span>';
    
    noEffectEl.innerHTML = Array.from(combinedEffectiveness.noEffect).map(type => 
        `<span class="type-badge-small" style="background-color: ${getTypeColor(type)}">${capitalizeFirst(type)}</span>`
    ).join('') || '<span style="color: #6c757d;">None</span>';
    
    effectivenessSection.style.display = 'block';
}

function hideTypeEffectiveness() {
    const effectivenessSection = document.getElementById('type-effectiveness');
    if (effectivenessSection) {
        effectivenessSection.style.display = 'none';
    }
}

// Modern sharing functionality with fallback handling
// Demonstrates progressive enhancement and feature detection
function copyPokemonInfo(name, id) {
    // Create shareable text content
    const text = `Check out this cool Pokémon: ${capitalizeFirst(name)} #${id}!`;
    
    // Modern Clipboard API with Promise-based error handling
    // navigator.clipboard is a modern API that returns Promises
    navigator.clipboard.writeText(text).then(() => {
        // Success callback - executed if copying succeeds
        alert('Pokémon info copied to clipboard!');
    }).catch(() => {
        // Error callback - executed if copying fails (permissions, browser support, etc.)
        alert('Share feature not supported on this device');
    });
}

// =============================================================================
// EVENT HANDLING SYSTEM - Modern DOM manipulation and user interaction
// Since we use 'defer' in HTML, the DOM is already loaded when this script runs
// This eliminates the need for DOMContentLoaded event listener wrapper
// =============================================================================

console.log('Setting up event listeners - DOM ready thanks to defer attribute');

// Initialize all enhanced features
initializeDarkMode();
initializeAutocomplete();
updateFavoritesDisplay();
initializeGamingFeatures();

// DOM element selection - get references to interactive elements
// Using const because these references won't change
// 'defer' ensures these elements exist when the script executes
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const surpriseBtn = document.getElementById('surprise-btn');
const searchInput = document.getElementById('pokemon-search');
const themeToggle = document.getElementById('theme-toggle');

// Dark mode toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
}

// Event listener for search button - modern event handling pattern
// addEventListener is preferred over onclick for multiple reasons:
// 1. Can attach multiple listeners to same event
// 2. Better separation of HTML and JavaScript
// 3. More control over event behavior
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        // Arrow function maintains lexical scope
        // Input validation before making API call
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            fetchPokemon(searchTerm);
        } else {
            // User feedback for empty input
            alert('Please enter a Pokémon name or ID!');
        }
    });
}

// Simple event listener for random button
// Function reference passed directly (no parentheses to avoid immediate execution)
if (randomBtn) {
    randomBtn.addEventListener('click', getRandomPokemon);
}

// Special surprise button - demonstrates array usage and random selection
if (surpriseBtn) {
    surpriseBtn.addEventListener('click', () => {
        // Array of legendary/popular Pokémon for special feature
        // This creates a curated experience
        const specialPokemon = ['mewtwo', 'mew', 'articuno', 'zapdos', 'moltres', 'dragonite', 'lugia', 'ho-oh', 'celebi', 'rayquaza', 'dialga', 'palkia', 'giratina', 'arceus'];
        
        // Random array element selection
        // Math.floor(Math.random() * array.length) is the standard pattern
        const randomSpecial = specialPokemon[Math.floor(Math.random() * specialPokemon.length)];
        fetchPokemon(randomSpecial);
    });
}

// Keyboard event handling - enhanced user experience
if (searchInput) {
    // 'keypress' event for Enter key support
    searchInput.addEventListener('keypress', (e) => {
        // Event object 'e' contains information about the key pressed
        if (e.key === 'Enter') {
            // Simulate button click for consistent behavior
            searchBtn.click();
        }
    });
    
    // Auto-focus for immediate user interaction
    // This improves UX by making the search input ready to use
    searchInput.focus();
}

// =============================================================================
// INTERACTIVE GAMING FEATURES IMPLEMENTATION
// Comparison Tool, Battle Calculator, Evolution Chain, Quiz Game, Movesets
// =============================================================================

// Gaming state management
let currentComparisonSlots = { slot1: null, slot2: null };
let currentBattleSetup = { attacker: null, defender: null };
let currentQuizGame = {
    currentPokemon: null,
    score: 0,
    streak: 0,
    options: [],
    revealed: false
};
let isShinyMode = false;

// Gaming Navigation System
function initializeGamingFeatures() {
    const gamingButtons = document.querySelectorAll('.gaming-btn');
    
    // Initially hide all gaming sections
    const gamingSections = ['comparison-tool', 'battle-calculator', 'evolution-chain', 'quiz-game', 'moveset-display'];
    gamingSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Add click listeners to gaming buttons
    gamingButtons.forEach(button => {
        button.addEventListener('click', () => {
            const feature = button.dataset.feature;
            toggleGamingFeature(feature, button);
        });
    });
}

function toggleGamingFeature(feature, button) {
    let section;
    switch(feature) {
        case 'comparison':
            section = document.getElementById('comparison-tool');
            break;
        case 'battle':
            section = document.getElementById('battle-calculator');
            break;
        case 'evolution':
            section = document.getElementById('evolution-chain');
            break;
        case 'quiz':
            section = document.getElementById('quiz-game');
            break;
        case 'moves':
            section = document.getElementById('moveset-display');
            break;
        case 'shiny':
            toggleShinyMode();
            return; // Don't show/hide a section for shiny mode
    }
    
    if (!section) return;
    
    const isActive = button.classList.contains('active');
    
    // Remove active state from all buttons and hide all sections
    document.querySelectorAll('.gaming-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#comparison-tool, #battle-calculator, #evolution-chain, #quiz-game, #moveset-display').forEach(sec => sec.style.display = 'none');
    
    if (!isActive) {
        // Activate the selected feature
        button.classList.add('active');
        section.style.display = 'block';
        
        // Initialize feature-specific functionality
        switch(feature) {
            case 'comparison':
                initializeComparison();
                break;
            case 'battle':
                initializeBattle();
                break;
            case 'evolution':
                initializeEvolution();
                break;
            case 'quiz':
                initializeQuiz();
                break;
            case 'moves':
                initializeMoves();
                break;
        }
    }
}

// =============================================================================
// POKEMON COMPARISON TOOL
// =============================================================================

function initializeComparison() {
    updateComparisonDisplay();
}

async function addToComparison(pokemonName, slot) {
    try {
        const pokemon = await fetchPokemonData(pokemonName);
        if (pokemon) {
            currentComparisonSlots[slot] = pokemon;
            updateComparisonDisplay();
        }
    } catch (error) {
        console.error('Error adding Pokemon to comparison:', error);
        alert('Failed to load Pokemon for comparison');
    }
}

function updateComparisonDisplay() {
    const slot1Element = document.getElementById('comparison-slot-1');
    const slot2Element = document.getElementById('comparison-slot-2');
    
    updateComparisonSlot(slot1Element, currentComparisonSlots.slot1, 'slot1');
    updateComparisonSlot(slot2Element, currentComparisonSlots.slot2, 'slot2');
}

function updateComparisonSlot(element, pokemon, slotId) {
    if (!element) return;
    
    if (!pokemon) {
        element.innerHTML = `
            <h4>Pokemon ${slotId === 'slot1' ? '1' : '2'}</h4>
            <div class="comparison-placeholder">
                <p>Add a Pokemon to compare</p>
                <input type="text" placeholder="Enter Pokemon name..." id="${slotId}-input">
                <button onclick="addPokemonToSlot('${slotId}')">Add Pokemon</button>
            </div>
        `;
        return;
    }
    
    const image = pokemon.sprites.other['official-artwork']?.front_default || 
                  pokemon.sprites.front_default;
    
    element.innerHTML = `
        <h4>${capitalizeFirst(pokemon.name)} #${pokemon.id}</h4>
        <img src="${image}" alt="${pokemon.name}" class="comparison-image" style="width: 120px; height: 120px; object-fit: contain;">
        <div class="comparison-stats">
            ${pokemon.stats.map(stat => `
                <div class="comparison-stat">
                    <span>${formatStatName(stat.stat.name)}</span>
                    <span><strong>${stat.base_stat}</strong></span>
                </div>
            `).join('')}
        </div>
        <div class="comparison-types">
            ${pokemon.types.map(type => 
                `<span class="type-badge-small" style="background-color: ${getTypeColor(type.type.name)}">${capitalizeFirst(type.type.name)}</span>`
            ).join('')}
        </div>
        <button onclick="removeFromComparison('${slotId}')" style="margin-top: 1rem;">Remove</button>
    `;
}

function addPokemonToSlot(slotId) {
    const input = document.getElementById(`${slotId}-input`);
    if (input && input.value.trim()) {
        addToComparison(input.value.trim(), slotId);
    }
}

function removeFromComparison(slotId) {
    currentComparisonSlots[slotId] = null;
    updateComparisonDisplay();
}

function clearComparison() {
    currentComparisonSlots.slot1 = null;
    currentComparisonSlots.slot2 = null;
    updateComparisonDisplay();
}

// =============================================================================
// BATTLE DAMAGE CALCULATOR
// =============================================================================

function initializeBattle() {
    updateBattleDisplay();
}

async function addToBattle(pokemonName, role) {
    try {
        const pokemon = await fetchPokemonData(pokemonName);
        if (pokemon) {
            currentBattleSetup[role] = pokemon;
            updateBattleDisplay();
        }
    } catch (error) {
        console.error('Error adding Pokemon to battle:', error);
        alert('Failed to load Pokemon for battle');
    }
}

function updateBattleDisplay() {
    const attackerElement = document.getElementById('battle-attacker');
    const defenderElement = document.getElementById('battle-defender');
    
    updateBattleSlot(attackerElement, currentBattleSetup.attacker, 'attacker');
    updateBattleSlot(defenderElement, currentBattleSetup.defender, 'defender');
    
    // Update battle calculation if both Pokemon are present
    if (currentBattleSetup.attacker && currentBattleSetup.defender) {
        calculateBattleDamage();
    }
}

function updateBattleSlot(element, pokemon, role) {
    if (!element) return;
    
    if (!pokemon) {
        element.innerHTML = `
            <h4>${capitalizeFirst(role)}</h4>
            <div class="battle-slot">
                <p>Select ${role} Pokemon</p>
            </div>
            <div class="battle-controls">
                <input type="text" placeholder="Enter Pokemon name..." id="${role}-input">
                <button onclick="addPokemonToBattle('${role}')">Add ${capitalizeFirst(role)}</button>
            </div>
        `;
        return;
    }
    
    const image = pokemon.sprites.other['official-artwork']?.front_default || 
                  pokemon.sprites.front_default;
    
    element.innerHTML = `
        <h4>${capitalizeFirst(pokemon.name)} (${capitalizeFirst(role)})</h4>
        <div class="battle-slot">
            <img src="${image}" alt="${pokemon.name}" style="width: 100px; height: 100px; object-fit: contain;">
        </div>
        <div class="battle-controls">
            <label>Level:</label>
            <input type="number" value="50" min="1" max="100" id="${role}-level" onchange="calculateBattleDamage()">
            
            <label>Move Type:</label>
            <select id="${role}-move-type" onchange="calculateBattleDamage()">
                ${Object.keys(typeEffectiveness).map(type => 
                    `<option value="${type}">${capitalizeFirst(type)}</option>`
                ).join('')}
            </select>
            
            <label>Move Power:</label>
            <input type="number" value="80" min="1" max="200" id="${role}-move-power" onchange="calculateBattleDamage()">
            
            <button onclick="removeFromBattle('${role}')">Remove</button>
        </div>
    `;
}

function addPokemonToBattle(role) {
    const input = document.getElementById(`${role}-input`);
    if (input && input.value.trim()) {
        addToBattle(input.value.trim(), role);
    }
}

function removeFromBattle(role) {
    currentBattleSetup[role] = null;
    updateBattleDisplay();
    
    // Clear battle result
    const resultElement = document.getElementById('battle-result');
    if (resultElement) {
        resultElement.innerHTML = '';
    }
}

function calculateBattleDamage() {
    const attacker = currentBattleSetup.attacker;
    const defender = currentBattleSetup.defender;
    
    if (!attacker || !defender) return;
    
    // Get battle parameters
    const attackerLevel = parseInt(document.getElementById('attacker-level')?.value || 50);
    const movePower = parseInt(document.getElementById('attacker-move-power')?.value || 80);
    const moveType = document.getElementById('attacker-move-type')?.value || 'normal';
    
    // Calculate type effectiveness
    const defenderTypes = defender.types.map(t => t.type.name);
    let effectiveness = 1;
    
    defenderTypes.forEach(defType => {
        const typeChart = typeEffectiveness[defType];
        if (typeChart) {
            if (typeChart.weakTo.includes(moveType)) effectiveness *= 2;
            if (typeChart.resistantTo.includes(moveType)) effectiveness *= 0.5;
            if (typeChart.immuneTo.includes(moveType)) effectiveness *= 0;
        }
    });
    
    // Basic damage calculation (simplified Pokemon damage formula)
    const attackStat = attacker.stats.find(s => s.stat.name === 'attack').base_stat;
    const defenseStat = defender.stats.find(s => s.stat.name === 'defense').base_stat;
    
    const baseDamage = Math.floor(
        ((((2 * attackerLevel / 5 + 2) * movePower * attackStat / defenseStat) / 50) + 2) * effectiveness
    );
    
    // Display result
    const resultElement = document.getElementById('battle-result');
    if (resultElement) {
        let effectivenessText = '';
        if (effectiveness === 0) effectivenessText = "It has no effect!";
        else if (effectiveness < 1) effectivenessText = "It's not very effective...";
        else if (effectiveness > 1) effectivenessText = "It's super effective!";
        else effectivenessText = "It's normally effective.";
        
        resultElement.innerHTML = `
            <div class="battle-result">
                <h4>Battle Result</h4>
                <p><strong>Damage:</strong> ${baseDamage} HP</p>
                <p><strong>Effectiveness:</strong> ${effectiveness}x</p>
                <p><em>${effectivenessText}</em></p>
            </div>
        `;
    }
}

// =============================================================================
// EVOLUTION CHAIN VIEWER
// =============================================================================

function initializeEvolution() {
    const currentPokemon = getCurrentDisplayedPokemon();
    if (currentPokemon) {
        showEvolutionChain(currentPokemon.name);
    }
}

async function showEvolutionChain(pokemonName) {
    try {
        const pokemon = await fetchPokemonData(pokemonName);
        if (!pokemon) return;
        
        // Fetch species data to get evolution chain URL
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        
        // Fetch evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        
        displayEvolutionChain(evolutionData.chain);
        
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
        const evolutionDisplay = document.getElementById('evolution-display');
        if (evolutionDisplay) {
            evolutionDisplay.innerHTML = '<p>Could not load evolution chain for this Pokemon.</p>';
        }
    }
}

async function displayEvolutionChain(chain) {
    const evolutionDisplay = document.getElementById('evolution-display');
    if (!evolutionDisplay) return;
    
    const evolutionStages = [];
    
    // Traverse the evolution chain
    let currentStage = chain;
    while (currentStage) {
        const pokemonData = await fetchPokemonData(currentStage.species.name);
        if (pokemonData) {
            const evolutionMethod = currentStage.evolution_details[0];
            evolutionStages.push({
                pokemon: pokemonData,
                method: evolutionMethod
            });
        }
        
        // Move to next evolution (take first evolution if multiple)
        currentStage = currentStage.evolves_to[0] || null;
    }
    
    // Display evolution stages
    evolutionDisplay.innerHTML = evolutionStages.map((stage, index) => {
        const pokemon = stage.pokemon;
        const method = stage.method;
        const image = pokemon.sprites.other['official-artwork']?.front_default || 
                     pokemon.sprites.front_default;
        
        let evolutionText = '';
        if (method) {
            if (method.min_level) evolutionText = `Level ${method.min_level}`;
            else if (method.item) evolutionText = `Use ${method.item.name}`;
            else if (method.trigger) evolutionText = capitalizeFirst(method.trigger.name);
        }
        
        const arrow = index < evolutionStages.length - 1 ? '<div class="evolution-arrow"></div>' : '';
        
        return `
            <div class="evolution-stage" onclick="searchPokemon('${pokemon.name}')">
                <img src="${image}" alt="${pokemon.name}" class="evolution-image">
                <div class="evolution-name">${capitalizeFirst(pokemon.name)}</div>
                <div class="evolution-level">${evolutionText}</div>
            </div>
            ${arrow}
        `;
    }).join('');
}

// =============================================================================
// POKEMON QUIZ GAME - "WHO'S THAT POKEMON?"
// =============================================================================

function initializeQuiz() {
    generateNewQuizQuestion();
}

async function generateNewQuizQuestion() {
    try {
        // Generate random Pokemon for the question
        const randomId = Math.floor(Math.random() * 1010) + 1;
        const correctPokemon = await fetchPokemonData(randomId);
        
        if (!correctPokemon) {
            generateNewQuizQuestion(); // Try again
            return;
        }
        
        // Generate 3 additional random options
        const options = [correctPokemon];
        while (options.length < 4) {
            const optionId = Math.floor(Math.random() * 1010) + 1;
            const optionPokemon = await fetchPokemonData(optionId);
            
            if (optionPokemon && !options.find(p => p.id === optionPokemon.id)) {
                options.push(optionPokemon);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        currentQuizGame.currentPokemon = correctPokemon;
        currentQuizGame.options = options;
        currentQuizGame.revealed = false;
        
        displayQuizQuestion();
        
    } catch (error) {
        console.error('Error generating quiz question:', error);
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = '<p>Error generating quiz question. Please try again.</p>';
        }
    }
}

function displayQuizQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    const pokemon = currentQuizGame.currentPokemon;
    const image = pokemon.sprites.other['official-artwork']?.front_default || 
                 pokemon.sprites.front_default;
    
    quizContainer.innerHTML = `
        <div class="quiz-score">
            <span>Score: ${currentQuizGame.score}</span>
            <span>Streak: ${currentQuizGame.streak}</span>
        </div>
        
        <div class="quiz-image-container">
            <img src="${image}" alt="Mystery Pokemon" class="quiz-image silhouette" id="quiz-image">
        </div>
        
        <div class="quiz-options" id="quiz-options">
            ${currentQuizGame.options.map((option, index) => `
                <button class="quiz-option" onclick="selectQuizAnswer(${index})">
                    ${capitalizeFirst(option.name)}
                </button>
            `).join('')}
        </div>
        
        <div class="quiz-actions">
            <button onclick="revealQuizAnswer()" class="action-btn">💡 Reveal</button>
            <button onclick="generateNewQuizQuestion()" class="action-btn secondary">⏭️ Skip</button>
        </div>
    `;
}

function selectQuizAnswer(optionIndex) {
    const selectedPokemon = currentQuizGame.options[optionIndex];
    const correctPokemon = currentQuizGame.currentPokemon;
    const isCorrect = selectedPokemon.id === correctPokemon.id;
    
    // Update score
    if (isCorrect) {
        currentQuizGame.score += 10;
        currentQuizGame.streak++;
    } else {
        currentQuizGame.streak = 0;
    }
    
    // Update UI
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
        option.classList.add('disabled');
        if (index === optionIndex) {
            option.classList.add(isCorrect ? 'correct' : 'incorrect');
        }
        if (currentQuizGame.options[index].id === correctPokemon.id) {
            option.classList.add('correct');
        }
    });
    
    // Reveal the image
    revealQuizAnswer();
    
    // Show next question button
    setTimeout(() => {
        const actionsDiv = document.querySelector('.quiz-actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = `
                <button onclick="generateNewQuizQuestion()" class="action-btn">➡️ Next Question</button>
                <button onclick="resetQuizGame()" class="action-btn secondary">🔄 Reset Game</button>
            `;
        }
    }, 2000);
}

function revealQuizAnswer() {
    const quizImage = document.getElementById('quiz-image');
    if (quizImage) {
        quizImage.classList.remove('silhouette');
        quizImage.classList.add('revealed');
        currentQuizGame.revealed = true;
    }
}

function resetQuizGame() {
    currentQuizGame.score = 0;
    currentQuizGame.streak = 0;
    generateNewQuizQuestion();
}

// =============================================================================
// MOVESET DISPLAY
// =============================================================================

function initializeMoves() {
    const currentPokemon = getCurrentDisplayedPokemon();
    if (currentPokemon) {
        showPokemonMoves(currentPokemon.name);
    }
}

async function showPokemonMoves(pokemonName) {
    try {
        const pokemon = await fetchPokemonData(pokemonName);
        if (!pokemon) return;
        
        // Fetch move details
        const movePromises = pokemon.moves.slice(0, 20).map(async moveObj => {
            try {
                const moveResponse = await fetch(moveObj.move.url);
                const moveData = await moveResponse.json();
                return {
                    name: moveData.name,
                    type: moveData.type.name,
                    power: moveData.power || 0,
                    accuracy: moveData.accuracy || 0,
                    pp: moveData.pp || 0,
                    learnMethod: moveObj.version_group_details[0]?.move_learn_method.name || 'unknown'
                };
            } catch (error) {
                return null;
            }
        });
        
        const moves = (await Promise.all(movePromises)).filter(move => move !== null);
        
        displayPokemonMoves(moves, pokemon.name);
        
    } catch (error) {
        console.error('Error fetching Pokemon moves:', error);
        const movesetContainer = document.getElementById('moveset-container');
        if (movesetContainer) {
            movesetContainer.innerHTML = '<p>Could not load moves for this Pokemon.</p>';
        }
    }
}

function displayPokemonMoves(moves, pokemonName) {
    const movesetContainer = document.getElementById('moveset-container');
    if (!movesetContainer) return;
    
    // Separate moves by learning method
    const levelUpMoves = moves.filter(move => move.learnMethod === 'level-up');
    const tmMoves = moves.filter(move => move.learnMethod === 'machine');
    
    movesetContainer.innerHTML = `
        <div class="moves-section">
            <h4>Level-up Moves</h4>
            <div class="moves-grid">
                ${levelUpMoves.map(move => `
                    <div class="move-item">
                        <span class="move-name">${formatAbilityName(move.name)}</span>
                        <div class="move-details">
                            <span class="move-type" style="background-color: ${getTypeColor(move.type)}">${capitalizeFirst(move.type)}</span>
                            <span class="move-power">${move.power || '--'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="tms-section">
            <h4>TM/TR Moves</h4>
            <div class="moves-grid">
                ${tmMoves.map(move => `
                    <div class="move-item">
                        <span class="move-name">${formatAbilityName(move.name)}</span>
                        <div class="move-details">
                            <span class="move-type" style="background-color: ${getTypeColor(move.type)}">${capitalizeFirst(move.type)}</span>
                            <span class="move-power">${move.power || '--'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// =============================================================================
// SHINY POKEMON VARIANTS
// =============================================================================

function toggleShinyMode() {
    isShinyMode = !isShinyMode;
    const body = document.body;
    
    if (isShinyMode) {
        body.classList.add('shiny-mode');
        console.log('Shiny mode activated! ✨');
    } else {
        body.classList.remove('shiny-mode');
        console.log('Shiny mode deactivated');
    }
    
    // Update all displayed Pokemon images to show shiny variants
    updateShinyImages();
}

function updateShinyImages() {
    const pokemonImages = document.querySelectorAll('.pokemon-image, .sprite, .evolution-image, .quiz-image');
    pokemonImages.forEach(img => {
        if (isShinyMode) {
            // Add shiny effect
            img.style.filter = 'hue-rotate(180deg) saturate(1.5) brightness(1.1)';
            img.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        } else {
            // Remove shiny effect
            img.style.filter = '';
            img.style.boxShadow = '';
        }
    });
}

// =============================================================================
// UTILITY FUNCTIONS FOR GAMING FEATURES
// =============================================================================

async function fetchPokemonData(pokemonName) {
    // Check cache first
    const cleanName = pokemonName.toString().toLowerCase().trim();
    if (pokemonCache.has(cleanName)) {
        return pokemonCache.get(cleanName);
    }
    
    try {
        const response = await fetch(`${POKEMON_ENDPOINT}/${cleanName}`);
        if (!response.ok) {
            throw new Error(`Pokemon not found: ${pokemonName}`);
        }
        
        const pokemonData = await response.json();
        pokemonCache.set(cleanName, pokemonData);
        return pokemonData;
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        return null;
    }
}

function getCurrentDisplayedPokemon() {
    const pokemonCard = document.querySelector('.pokemon-card');
    if (!pokemonCard) return null;
    
    const nameElement = pokemonCard.querySelector('.pokemon-name');
    if (!nameElement) return null;
    
    return { name: nameElement.textContent.toLowerCase() };
}

// =============================================================================
// GLOBAL SCOPE EXPORTS - Making functions available for onclick handlers
// These assignments make functions callable from HTML onclick attributes
// =============================================================================

// Export functions to global scope for HTML onclick compatibility
// While event listeners are preferred, onclick attributes still need global functions
window.searchPokemon = searchPokemon;
window.getRandomPokemon = getRandomPokemon;
window.toggleFavorite = toggleFavorite;
window.removeFavorite = removeFavorite;
window.copyPokemonInfo = copyPokemonInfo;

// Gaming feature functions
window.addPokemonToSlot = addPokemonToSlot;
window.removeFromComparison = removeFromComparison;
window.clearComparison = clearComparison;
window.addPokemonToBattle = addPokemonToBattle;
window.removeFromBattle = removeFromBattle;
window.calculateBattleDamage = calculateBattleDamage;
window.showEvolutionChain = showEvolutionChain;
window.selectQuizAnswer = selectQuizAnswer;
window.revealQuizAnswer = revealQuizAnswer;
window.generateNewQuizQuestion = generateNewQuizQuestion;
window.resetQuizGame = resetQuizGame;
window.showPokemonMoves = showPokemonMoves;
window.toggleShinyMode = toggleShinyMode;
