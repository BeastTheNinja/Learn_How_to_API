// Pokemon Display View - Handles main Pokemon display and UI rendering
// This file contains all functions related to displaying Pokemon information

// Import utility functions
import { capitalizeFirst, formatStatName, formatAbilityName, getTypeColor } from './utilityFunctions.js';

// Main function to display Pokémon data in HTML format
export function displayPokemon(pokemon) {
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
                <button class="action-btn secondary" onclick="window.getRandomPokemon?.()">🎲 Another Random</button>
                <button class="favorite-btn" onclick="window.handleToggleFavorite?.(${JSON.stringify(pokemon).replace(/"/g, '&quot;')})">
                    <span class="heart-icon">🤍</span> Add to Favorites
                </button>
                <button class="action-btn" onclick="window.copyPokemonInfo?.('${pokemon.name}', ${pokemon.id})">📤 Share</button>
            </div>
        </div>
    `;
}

// Error display function
export function showError(message) {
    const output = document.getElementById('output');
    if (output) {
        // Create an error UI with multiple recovery options
        output.innerHTML = `
            <div class="error-message">
                <div class="error-icon">😕</div>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <div class="error-actions">
                    <button onclick="window.getRandomPokemon?.()" class="retry-button">🎲 Try Random Pokémon</button>
                    <button onclick="document.getElementById('pokemon-search').value = ''; document.getElementById('pokemon-search').focus()" class="retry-button secondary">🔍 Search Again</button>
                </div>
            </div>
        `;
    }
}

// Loading state management functions
export function showLoadingState() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.style.display = 'block';
}

export function hideLoadingState() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) loadingElement.style.display = 'none';
}