
// Pokemon API Model - Handles all API interactions and caching
// This file contains API configuration and data fetching functions

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
export async function fetchPokemon(pokemonName) {
    // try/catch block for comprehensive error handling
    // 'try' contains code that might fail, 'catch' handles any errors
    try {
        // Data sanitization - clean user input to prevent issues
        // toString() ensures we can handle both strings and numbers
        // toLowerCase() makes search case-insensitive
        // trim() removes leading/trailing whitespace
        const cleanName = pokemonName.toString().toLowerCase().trim();
        
        // Cache check - avoid unnecessary API calls for better performance
        // Map.has() is O(1) operation - very fast lookup
        if (pokemonCache.has(cleanName)) {
            console.log('Using cached data for:', cleanName);
            return pokemonCache.get(cleanName);
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
        
        return pokemonData;
        
    } catch (error) {
        // Error handling - catch any errors from the try block
        // This includes network errors, JSON parsing errors, or custom thrown errors
        console.error('Error fetching Pokémon:', error);
        throw error; // Re-throw to let the caller handle the error display
    }
}

// Clear cache function for development/debugging
export function clearPokemonCache() {
    pokemonCache.clear();
    console.log('Pokemon cache cleared');
}

// Get cache size for debugging
export function getCacheSize() {
    return pokemonCache.size;
}

// Preload popular Pokemon for better user experience
export async function preloadPopularPokemon() {
    const popularNames = ['pikachu', 'charizard', 'blastoise', 'venusaur'];
    
    for (const name of popularNames) {
        try {
            await fetchPokemon(name);
        } catch (error) {
            console.warn(`Failed to preload ${name}:`, error.message);
        }
    }
    
    console.log(`Preloaded ${getCacheSize()} Pokemon`);
}
