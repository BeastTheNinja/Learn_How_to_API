// PokéDex Explorer - Main Application Entry Point
// This application demonstrates modern JavaScript ES6 modules and MVC architecture
// - ES6 Modules with import/export
// - MVC (Model-View-Controller) pattern
// - Async/await for handling API calls
// - Separation of concerns

console.log('PokéDex Explorer starting up...');

// Import all MVC components
// Models - Data layer (import for side effects to ensure they're loaded)
import './Model/pokemonData.js';
import './Model/pokeapi.js';
import './Model/favoritesPokemon.js';

// Views - Presentation layer (import for side effects)
import './view/utilityFunctions.js';
import './view/pokemonDisplay.js';
import './view/favoritesView.js';

// Controllers - Logic layer (import specific functions we need)
import { initializePokemonController } from './controller/pokemonController.js';
import { initializeApp, showTypeEffectiveness } from './controller/appController.js';

// Application initialization
function startApplication() {
    console.log('Initializing PokéDex Explorer App...');
    
    try {
        // Initialize all controllers in the correct order
        initializePokemonController();
        initializeApp();
        
        console.log('✅ PokéDex Explorer App initialized successfully!');
    } catch (error) {
        console.error('❌ Failed to initialize PokéDex Explorer:', error);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', startApplication);

// Export global functions for backward compatibility with HTML onclick handlers
// This ensures existing onclick attributes in the HTML still work
window.showTypeEffectiveness = showTypeEffectiveness;