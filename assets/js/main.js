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
import './view/gamingDisplay.js';

// Controllers - Logic layer (import specific functions we need)
import { initializePokemonController, searchPokemon, getRandomPokemon, handleToggleFavorite, handleRemoveFavorite } from './controller/pokemonController.js';
import { initializeApp, showTypeEffectiveness } from './controller/appController.js';
import { 
    initializeGamingFeatures, 
    addPokemonToSlot, 
    removeFromComparison, 
    clearComparison,
    addPokemonToBattle,
    removeFromBattle,
    calculateBattleDamage,
    showEvolutionChain,
    generateNewQuizQuestion,
    selectQuizAnswer,
    revealQuizAnswer,
    resetQuizGame,
    showPokemonMoves,
    toggleShinyMode,
    showBattleCalculator,
    calculateDamage,
    startQuizGame
} from './controller/gamingController.js';

// Import utility functions that need to be globally available
import { copyPokemonInfo } from './view/utilityFunctions.js';

// Application initialization
function startApplication() {
    console.log('Initializing PokéDex Explorer App...');
    
    try {
        // Initialize all controllers in the correct order
        initializePokemonController();
        initializeApp();
        initializeGamingFeatures();
        
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
window.searchPokemon = searchPokemon;
window.getRandomPokemon = getRandomPokemon;
window.handleToggleFavorite = handleToggleFavorite;
window.handleRemoveFavorite = handleRemoveFavorite;
window.copyPokemonInfo = copyPokemonInfo;

// Gaming features global exports
window.addPokemonToSlot = addPokemonToSlot;
window.removeFromComparison = removeFromComparison;
window.clearComparison = clearComparison;
window.addPokemonToBattle = addPokemonToBattle;
window.removeFromBattle = removeFromBattle;
window.calculateBattleDamage = calculateBattleDamage;
window.showEvolutionChain = showEvolutionChain;
window.generateNewQuizQuestion = generateNewQuizQuestion;
window.selectQuizAnswer = selectQuizAnswer;
window.revealQuizAnswer = revealQuizAnswer;
window.resetQuizGame = resetQuizGame;
window.showPokemonMoves = showPokemonMoves;
window.toggleShinyMode = toggleShinyMode;
window.showBattleCalculator = showBattleCalculator;
window.calculateDamage = calculateDamage;
window.startQuizGame = startQuizGame;