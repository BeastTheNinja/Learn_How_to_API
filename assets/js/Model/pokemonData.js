// Pokemon Data Model - Static data and popular Pokemon for autocomplete
// This file contains static data that doesn't change during the application lifecycle

// Autocomplete data - popular Pokemon for suggestions
export const popularPokemon = [
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
export const typeEffectiveness = {
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

// Utility functions for Pokemon data
export function getRandomPokemonId() {
    // Generate random Pokemon ID between 1 and 1010
    return Math.floor(Math.random() * 1010) + 1;
}