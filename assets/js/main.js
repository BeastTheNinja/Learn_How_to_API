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
                <button class="action-btn" onclick="navigator.share ? navigator.share({title: 'Check out ${capitalizeFirst(pokemon.name)}!', text: 'Found this cool Pokémon: ${capitalizeFirst(pokemon.name)} #${pokemon.id}', url: window.location.href}) : copyPokemonInfo('${pokemon.name}', ${pokemon.id})">📤 Share</button>
            </div>
        </div>
    `;
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

// DOM element selection - get references to interactive elements
// Using const because these references won't change
// 'defer' ensures these elements exist when the script executes
const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const surpriseBtn = document.getElementById('surprise-btn');
const searchInput = document.getElementById('pokemon-search');

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
// GLOBAL SCOPE EXPORTS - Making functions available for onclick handlers
// These assignments make functions callable from HTML onclick attributes
// =============================================================================

// Export functions to global scope for HTML onclick compatibility
// While event listeners are preferred, onclick attributes still need global functions
window.searchPokemon = searchPokemon;
window.getRandomPokemon = getRandomPokemon;
