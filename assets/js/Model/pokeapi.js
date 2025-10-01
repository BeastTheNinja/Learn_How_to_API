
// API Configuration - Constants for our external API
// Using const ensures these values cannot be accidentally changed
const POKEAPI_BASE = 'https://pokeapi.co/api/v2';  // Base URL for PokéAPI
const POKEMON_ENDPOINT = `${POKEAPI_BASE}/pokemon`; // Template literal to build endpoint


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
