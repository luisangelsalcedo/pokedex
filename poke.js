
const API = 'https://pokeapi.co/api/v2/pokemon/';
const pokemones = document.getElementById('pokemones');
const info = document.getElementById('info');
const infoContainer = document.querySelector('.info-container');


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

    //imagen
    const pokeimg = document.createElement('img');
    pokeimg.setAttribute('src', pokemon.sprites.front_default);

    pokeDiv.prepend(pokeimg);

    pokeDiv.addEventListener('click', ()=>{
        pokeAlertInfo(pokemon);
        infoContainer.classList.add('active');
    })
    
}

const pokeAlertInfo = (pokemon)=>{

    
    //imagen
    const pokeIMG = pokemon.sprites.other.dream_world.front_default;
    const pokeimgFront = pokemon.sprites.front_default;
    const pokeimgBack = pokemon.sprites.back_default;

    //ataque
    const pokeAttackURL = pokemon.abilities[0].ability.url;

    //tipo de pokemon
    const pokeTypes = pokemon.types.map(t => t.type.name);
    console.log(pokeTypes.join());



    fetch(pokeAttackURL)
        .then(response => response.json())
        .then(attack => {
            const attackName = (attack.names.find(element => element.language.name === 'es').name);
            const attackEfect = (attack.flavor_text_entries.find(element => element.language.name === 'es').flavor_text);
            const attackResponse = `${attackName}: ${attackEfect}`;
            info.innerHTML = `
            <div><h1>${pokemon.name}</h1><div>
            <div class="img">
                <img src="${pokeIMG}" alt="${pokemon.name}">
            </div>
            <div class="imgs">
                <div><img src="${pokeimgFront}" alt="${pokemon.name} (vista de frente)"></div>
                <div><img src="${pokeimgBack}" alt="${pokemon.name} (vista de trasera)"></div>
            </div>
            <div class="info">
                <div><b>ataque:</b> ${attackResponse}</div>
                <div><b>tipo:</b> ${pokeTypes.join()}</div>
            </div>
            `;
        });
}

const cerrarModal = ()=>{
    infoContainer.classList.remove('active');
}

init();