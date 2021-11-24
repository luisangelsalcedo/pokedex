
const API = 'https://pokeapi.co/api/v2/pokemon/';
const pokemones = document.getElementById('pokemones');

const init = ()=>{
    fetch(API)
        .then(response => response.json())
        .then(pokemonJson => createPokeContainer(pokemonJson))
}


const createPokeContainer = pokemonJson => {
    const pokeList = pokemonJson.results;
    // console.log(pokemonJson.results);

    pokeList.forEach((el, i) => {
        fetch(el.url)
            .then(response => response.json())
            .then(pokemon => pokemonHTML(pokemon))
            // console.log(el.url);

        const pokeDiv = document.createElement('div');
        pokeDiv.classList.add('pokemon', `poke${i + 1}`);
        
        const pokeName = document.createElement('p');
        pokeName.innerText = el.name;

        pokeDiv.append(pokeName);
        pokemones.append(pokeDiv);

    });
}

const pokemonHTML = (pokemon)=>{
    const pokeDiv = document.querySelector(`.poke${pokemon.id}`);
    // console.log(pokemon);

    const pokeimg = document.createElement('img');
    pokeimg.setAttribute('src', pokemon.sprites.front_default);

    const pokeAttack = pokemon.abilities[0].ability.name;
    const pokeAttackURL = pokemon.abilities[0].ability.url;    
    
    pokeDiv.addEventListener('click', ()=>{
        pokeAttackAlert(pokeAttackURL);
    })
    pokeDiv.prepend(pokeimg);
}

const pokeAttackAlert = (attackURL)=>{
    fetch(attackURL)
        .then(response => response.json())
        .then(attack => {
            const attackName = (attack.names.find(element => element.language.name === 'es').name);
            const attackEfect = (attack.flavor_text_entries.find(element => element.language.name === 'es').flavor_text);
            const attackResponse = `${attackName}: ${attackEfect}`;
            alert(attackResponse);
        });
}

init();