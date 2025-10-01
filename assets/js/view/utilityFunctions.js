// Utility Functions View - Helper functions for formatting and display
// This file contains utility functions used throughout the view layer

// String manipulation utility - handles capitalization
export function capitalizeFirst(str) {
    // charAt(0) gets first character, slice(1) gets rest of string
    // This is more reliable than other capitalization methods
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Data mapping function - converts API stat names to user-friendly names
// Object mapping is a common pattern for data transformation
export function formatStatName(statName) {
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
export function formatAbilityName(abilityName) {
    // Method chaining - multiple operations in sequence
    // split('-') creates array of words separated by hyphens
    // map() transforms each word by capitalizing it
    // join(' ') combines words back into string with spaces
    return abilityName.split('-').map(word => capitalizeFirst(word)).join(' ');
}

// Color mapping function - assigns colors to Pokémon types
// This creates a visual connection between data and presentation
export function getTypeColor(type) {
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
        steel: '#B8B8D0',     // Silver for steel types
        fairy: '#EE99AC'      // Pink for fairy types
    };
    
    // Return the color for the type, or a default gray if type not found
    return typeColors[type.toLowerCase()] || '#68A090';
}

// Theme management functions
export function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDark);
    
    // Update the theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    }
    
    console.log(`Dark mode ${isDark ? 'enabled' : 'disabled'}`);
}

export function initializeDarkMode() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = savedTheme === 'true';
    
    if (prefersDark) {
        document.body.classList.add('dark-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) icon.textContent = '☀️';
        }
    }
}

// Copy functionality for sharing
export function copyPokemonInfo(pokemonName, pokemonId) {
    const text = `Check out ${capitalizeFirst(pokemonName)}! Pokémon #${pokemonId}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Pokémon info copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Pokémon info copied to clipboard!');
    }
}

// Simple notification system
export function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, duration);
}