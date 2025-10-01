// Gaming Features Controller - Handles all interactive gaming features
// This file manages Pokemon comparison, quiz, battle calculator, evolution chains, and movesets

// Import dependencies
import { fetchPokemon } from '../Model/pokeapi.js';
import { getRandomPokemonId } from '../Model/pokemonData.js';
import { displayComparisonResult, displayBattleResult, displayEvolutionChain, displayQuizQuestion, displayMoveset } from '../view/gamingDisplay.js';
import { capitalizeFirst } from '../view/utilityFunctions.js';

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

// =============================================================================
// GAMING NAVIGATION SYSTEM
// =============================================================================

export function initializeGamingFeatures() {
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

export async function addToComparison(pokemonName, slot) {
    try {
        const pokemon = await fetchPokemon(pokemonName);
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
    displayComparisonResult(currentComparisonSlots.slot1, currentComparisonSlots.slot2);
}

export function addPokemonToSlot(slotId) {
    const input = document.getElementById(`${slotId}-input`);
    if (input && input.value.trim()) {
        addToComparison(input.value.trim(), slotId);
    }
}

export function removeFromComparison(slotId) {
    currentComparisonSlots[slotId] = null;
    updateComparisonDisplay();
}

export function clearComparison() {
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

export async function addToBattle(pokemonName, role) {
    try {
        const pokemon = await fetchPokemon(pokemonName);
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
    displayBattleResult(currentBattleSetup.attacker, currentBattleSetup.defender);
    
    // Update battle calculation if both Pokemon are present
    if (currentBattleSetup.attacker && currentBattleSetup.defender) {
        calculateBattleDamage();
    }
}

export function addPokemonToBattle(role) {
    const input = document.getElementById(`${role}-input`);
    if (input && input.value.trim()) {
        addToBattle(input.value.trim(), role);
    }
}

export function removeFromBattle(role) {
    currentBattleSetup[role] = null;
    updateBattleDisplay();
    
    // Clear battle result
    const resultElement = document.getElementById('battle-result');
    if (resultElement) {
        resultElement.innerHTML = '';
    }
}

export function calculateBattleDamage() {
    const attacker = currentBattleSetup.attacker;
    const defender = currentBattleSetup.defender;
    
    if (!attacker || !defender) return;
    
    // Get battle parameters
    const attackerLevel = parseInt(document.getElementById('attacker-level')?.value || 50);
    const movePower = parseInt(document.getElementById('attacker-move-power')?.value || 80);
    const moveType = document.getElementById('attacker-move-type')?.value || 'normal';
    
    // Calculate type effectiveness (simplified)
    const defenderTypes = defender.types.map(t => t.type.name);
    let effectiveness = 1;
    
    // Basic type effectiveness calculation
    const typeChart = {
        fire: { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
        water: { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'] },
        grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'electric', 'grass', 'ground'] },
        electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'] }
    };
    
    defenderTypes.forEach(defType => {
        const chart = typeChart[defType];
        if (chart) {
            if (chart.weak.includes(moveType)) effectiveness *= 2;
            if (chart.resist.includes(moveType)) effectiveness *= 0.5;
        }
    });
    
    // Basic damage calculation
    const attackStat = attacker.stats.find(s => s.stat.name === 'attack').base_stat;
    const defenseStat = defender.stats.find(s => s.stat.name === 'defense').base_stat;
    
    const baseDamage = Math.floor(
        ((((2 * attackerLevel / 5 + 2) * movePower * attackStat / defenseStat) / 50) + 2) * effectiveness
    );
    
    // Display result
    const resultElement = document.getElementById('battle-result');
    if (resultElement) {
        let effectivenessText = '';
        if (effectiveness < 1) effectivenessText = "It's not very effective...";
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

export async function showEvolutionChain(pokemonName) {
    try {
        const pokemon = await fetchPokemon(pokemonName);
        if (!pokemon) return;
        
        // Fetch species data to get evolution chain URL
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        
        // Fetch evolution chain
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        
        await displayEvolutionChain(evolutionData.chain);
        
    } catch (error) {
        console.error('Error fetching evolution chain:', error);
        const evolutionDisplay = document.getElementById('evolution-display');
        if (evolutionDisplay) {
            evolutionDisplay.innerHTML = '<p>Could not load evolution chain for this Pokemon.</p>';
        }
    }
}

// =============================================================================
// POKEMON QUIZ GAME
// =============================================================================

function initializeQuiz() {
    generateNewQuizQuestion();
}

export async function generateNewQuizQuestion() {
    try {
        // Generate random Pokemon for the question
        const randomId = getRandomPokemonId();
        const correctPokemon = await fetchPokemon(randomId.toString());
        
        if (!correctPokemon) {
            generateNewQuizQuestion(); // Try again
            return;
        }
        
        // Generate 3 additional random options
        const options = [correctPokemon];
        while (options.length < 4) {
            const optionId = getRandomPokemonId();
            try {
                const optionPokemon = await fetchPokemon(optionId.toString());
                if (optionPokemon && !options.find(p => p.id === optionPokemon.id)) {
                    options.push(optionPokemon);
                }
            } catch (error) {
                // Skip if Pokemon can't be fetched
                continue;
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
        
        displayQuizQuestion(currentQuizGame);
        
    } catch (error) {
        console.error('Error generating quiz question:', error);
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = '<p>Error generating quiz question. Please try again.</p>';
        }
    }
}

export function selectQuizAnswer(optionIndex) {
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
                <button onclick="window.generateNewQuizQuestion?.()" class="action-btn">➡️ Next Question</button>
                <button onclick="window.resetQuizGame?.()" class="action-btn secondary">🔄 Reset Game</button>
            `;
        }
    }, 2000);
}

export function revealQuizAnswer() {
    const quizImage = document.getElementById('quiz-image');
    if (quizImage) {
        quizImage.classList.remove('silhouette');
        quizImage.classList.add('revealed');
        currentQuizGame.revealed = true;
    }
}

export function resetQuizGame() {
    currentQuizGame.score = 0;
    currentQuizGame.streak = 0;
    generateNewQuizQuestion();
}

// Additional helper functions for HTML compatibility
export function showBattleCalculator() {
    const battleSection = document.getElementById('battle-calculator');
    if (battleSection) {
        battleSection.style.display = 'block';
        initializeBattle();
    }
}

export function calculateDamage() {
    // Alias for calculateBattleDamage for HTML compatibility
    calculateBattleDamage();
}

export function startQuizGame() {
    const quizSection = document.getElementById('quiz-game');
    if (quizSection) {
        quizSection.style.display = 'block';
        resetQuizGame();
    }
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

export async function showPokemonMoves(pokemonName) {
    try {
        const pokemon = await fetchPokemon(pokemonName);
        if (!pokemon) return;
        
        // Get first 20 moves to avoid too many API calls
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
        displayMoveset(moves, pokemon.name);
        
    } catch (error) {
        console.error('Error fetching Pokemon moves:', error);
        const movesetContainer = document.getElementById('moveset-container');
        if (movesetContainer) {
            movesetContainer.innerHTML = '<p>Could not load moves for this Pokemon.</p>';
        }
    }
}

// =============================================================================
// SHINY POKEMON VARIANTS
// =============================================================================

export function toggleShinyMode() {
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

function getCurrentDisplayedPokemon() {
    const pokemonCard = document.querySelector('.pokemon-card');
    if (!pokemonCard) return null;
    
    const nameElement = pokemonCard.querySelector('.pokemon-name');
    if (!nameElement) return null;
    
    return { name: nameElement.textContent.toLowerCase() };
}