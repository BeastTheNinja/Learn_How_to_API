// Gaming Display View - Handles display of gaming features
// This file contains all display functions for comparison, battle, quiz, evolution, and moveset features

// Import utility functions
import { capitalizeFirst, formatStatName, formatAbilityName, getTypeColor } from './utilityFunctions.js';

// =============================================================================
// COMPARISON DISPLAY
// =============================================================================

export function displayComparisonResult(pokemon1, pokemon2) {
    const slot1Element = document.getElementById('comparison-slot-1');
    const slot2Element = document.getElementById('comparison-slot-2');
    
    updateComparisonSlot(slot1Element, pokemon1, 'slot1');
    updateComparisonSlot(slot2Element, pokemon2, 'slot2');
}

function updateComparisonSlot(element, pokemon, slotId) {
    if (!element) return;
    
    if (!pokemon) {
        element.innerHTML = `
            <h4>Pokemon ${slotId === 'slot1' ? '1' : '2'}</h4>
            <div class="comparison-placeholder">
                <p>Add a Pokemon to compare</p>
                <input type="text" placeholder="Enter Pokemon name..." id="${slotId}-input">
                <button onclick="window.addPokemonToSlot?.('${slotId}')">Add Pokemon</button>
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
        <button onclick="window.removeFromComparison?.('${slotId}')" style="margin-top: 1rem;">Remove</button>
    `;
}

// =============================================================================
// BATTLE DISPLAY
// =============================================================================

export function displayBattleResult(attacker, defender) {
    const attackerElement = document.getElementById('battle-attacker');
    const defenderElement = document.getElementById('battle-defender');
    
    updateBattleSlot(attackerElement, attacker, 'attacker');
    updateBattleSlot(defenderElement, defender, 'defender');
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
                <button onclick="window.addPokemonToBattle?.('${role}')">Add ${capitalizeFirst(role)}</button>
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
            <input type="number" value="50" min="1" max="100" id="${role}-level" onchange="window.calculateBattleDamage?.()">
            
            <label>Move Type:</label>
            <select id="${role}-move-type" onchange="window.calculateBattleDamage?.()">
                <option value="normal">Normal</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="electric">Electric</option>
                <option value="grass">Grass</option>
                <option value="ice">Ice</option>
                <option value="fighting">Fighting</option>
                <option value="poison">Poison</option>
                <option value="ground">Ground</option>
                <option value="flying">Flying</option>
                <option value="psychic">Psychic</option>
                <option value="bug">Bug</option>
                <option value="rock">Rock</option>
                <option value="ghost">Ghost</option>
                <option value="dragon">Dragon</option>
                <option value="dark">Dark</option>
                <option value="steel">Steel</option>
                <option value="fairy">Fairy</option>
            </select>
            
            <label>Move Power:</label>
            <input type="number" value="80" min="1" max="200" id="${role}-move-power" onchange="window.calculateBattleDamage?.()">
            
            <button onclick="window.removeFromBattle?.('${role}')">Remove</button>
        </div>
    `;
}

// =============================================================================
// EVOLUTION CHAIN DISPLAY
// =============================================================================

export async function displayEvolutionChain(chain) {
    const evolutionDisplay = document.getElementById('evolution-display');
    if (!evolutionDisplay) return;
    
    const evolutionStages = [];
    
    // Traverse the evolution chain
    let currentStage = chain;
    while (currentStage) {
        try {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentStage.species.name}`);
            const pokemonData = await pokemonResponse.json();
            
            const evolutionMethod = currentStage.evolution_details[0];
            evolutionStages.push({
                pokemon: pokemonData,
                method: evolutionMethod
            });
        } catch (error) {
            console.error('Error fetching evolution stage:', error);
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
        
        const arrow = index < evolutionStages.length - 1 ? '<div class="evolution-arrow">➡️</div>' : '';
        
        return `
            <div class="evolution-stage" onclick="window.searchPokemon?.('${pokemon.name}')">
                <img src="${image}" alt="${pokemon.name}" class="evolution-image">
                <div class="evolution-name">${capitalizeFirst(pokemon.name)}</div>
                <div class="evolution-level">${evolutionText}</div>
            </div>
            ${arrow}
        `;
    }).join('');
}

// =============================================================================
// QUIZ GAME DISPLAY
// =============================================================================

export function displayQuizQuestion(quizGame) {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    const pokemon = quizGame.currentPokemon;
    const image = pokemon.sprites.other['official-artwork']?.front_default || 
                 pokemon.sprites.front_default;
    
    quizContainer.innerHTML = `
        <div class="quiz-score">
            <span>Score: ${quizGame.score}</span>
            <span>Streak: ${quizGame.streak}</span>
        </div>
        
        <div class="quiz-image-container">
            <img src="${image}" alt="Mystery Pokemon" class="quiz-image silhouette" id="quiz-image">
        </div>
        
        <div class="quiz-options" id="quiz-options">
            ${quizGame.options.map((option, index) => `
                <button class="quiz-option" onclick="window.selectQuizAnswer?.(${index})">
                    ${capitalizeFirst(option.name)}
                </button>
            `).join('')}
        </div>
        
        <div class="quiz-actions">
            <button onclick="window.revealQuizAnswer?.()" class="action-btn">💡 Reveal</button>
            <button onclick="window.generateNewQuizQuestion?.()" class="action-btn secondary">⏭️ Skip</button>
        </div>
    `;
}

// =============================================================================
// MOVESET DISPLAY
// =============================================================================

export function displayMoveset(moves, pokemonName) {
    const movesetContainer = document.getElementById('moveset-container');
    if (!movesetContainer) return;
    
    // Separate moves by learning method
    const levelUpMoves = moves.filter(move => move.learnMethod === 'level-up');
    const tmMoves = moves.filter(move => move.learnMethod === 'machine');
    const otherMoves = moves.filter(move => move.learnMethod !== 'level-up' && move.learnMethod !== 'machine');
    
    movesetContainer.innerHTML = `
        <h3>Moveset for ${capitalizeFirst(pokemonName)}</h3>
        
        <div class="moves-section">
            <h4>Level-up Moves</h4>
            <div class="moves-grid">
                ${levelUpMoves.length > 0 ? levelUpMoves.map(move => `
                    <div class="move-item">
                        <span class="move-name">${formatAbilityName(move.name)}</span>
                        <div class="move-details">
                            <span class="move-type" style="background-color: ${getTypeColor(move.type)}">${capitalizeFirst(move.type)}</span>
                            <span class="move-power">${move.power || '--'}</span>
                        </div>
                    </div>
                `).join('') : '<p>No level-up moves found</p>'}
            </div>
        </div>
        
        <div class="moves-section">
            <h4>TM/TR Moves</h4>
            <div class="moves-grid">
                ${tmMoves.length > 0 ? tmMoves.map(move => `
                    <div class="move-item">
                        <span class="move-name">${formatAbilityName(move.name)}</span>
                        <div class="move-details">
                            <span class="move-type" style="background-color: ${getTypeColor(move.type)}">${capitalizeFirst(move.type)}</span>
                            <span class="move-power">${move.power || '--'}</span>
                        </div>
                    </div>
                `).join('') : '<p>No TM/TR moves found</p>'}
            </div>
        </div>
        
        ${otherMoves.length > 0 ? `
        <div class="moves-section">
            <h4>Other Moves</h4>
            <div class="moves-grid">
                ${otherMoves.map(move => `
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
        ` : ''}
    `;
}