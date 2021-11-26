
const API = 'https://pokeapi.co/api/v2/pokemon';
const countPoke     = 150;
const pokemones     = document.getElementById('pokemones');
const info          = document.getElementById('info');
const infoContainer = document.querySelector('.info-container');


const init = ()=>{
    fetch(`${API}?offset=0&limit=${countPoke}`)
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

    //especie / color
    const pokeSpeciesURL = pokemon.species.url;
    fetch(pokeSpeciesURL).then(response => response.json()).then(species =>{
        pokeDiv.setAttribute('data-color', species.color.name);
    });
    
    pokeDiv.prepend(pokeimg);
    pokeDiv.addEventListener('click', (event)=>{
        
        
        pokeAlertInfo(pokemon.id);
    })
    
}

const pokeAlertInfo = (pokemonID)=>{


    const nextID = (parseInt(pokemonID) >= countPoke) ? 1 : parseInt(pokemonID) + 1;
    const prevID = (parseInt(pokemonID) <= 1) ? countPoke : parseInt(pokemonID) - 1;

    //pokemon
    const pokeURL = `${API}/${pokemonID}`;
    fetch(pokeURL).then(response => response.json()).then(pokemon => {
        //imagen
        const pokeIMG = pokemon.sprites.other.dream_world.front_default;
        const pokeimgFront = pokemon.sprites.front_default;
        const pokeimgBack = pokemon.sprites.back_default;

        //Habilidad
        // const pokeAbilitiURL = pokemon.abilities[0].ability.url;
        // fetch(pokeAbilitiURL).then(response => response.json()).then(abiliti => {
        //     const abilitiName = (abiliti.names.find(element => element.language.name === 'es').name);
        //     const abilitiEfect = (abiliti.flavor_text_entries.find(element => element.language.name === 'es').flavor_text);
        //     const abilitiResponse = `<h3>Habilidad</h3> ${abilitiName}: ${abilitiEfect}`;
        // });

        const pokeAbility = pokemon.abilities.map(ablity => ablity.ability.name);

        //especie / color
        const pokeSpeciesURL = pokemon.species.url;
        fetch(pokeSpeciesURL).then(response => response.json()).then(species => {
            infoContainer.setAttribute('data-color', species.color.name);
        });

        //tipo de pokemon
        const pokeTypes = pokemon.types.map(t => t.type.name);
        let pokeTypesHTML = '';
        pokeTypes.forEach(tipo => {
            pokeTypesHTML += `<span>${tipo}</span>`;
        });

        //movimientos
        const pokeMoves = pokemon.moves.map(m => m.move.name);
        const pokeMovesResumen = (pokeMoves.length > 10) ? pokeMoves.slice(0, 10).join(', ') + '...' : pokeMoves.join(', ');

        info.innerHTML = `
            <div>
                <div><h1>${pokemon.name}<small>${pokeTypesHTML}</small></h1></div>
                <div class="img">
                    <img src="${pokeIMG}" alt="${pokemon.name}">
                </div>
                <div class="imgs">
                    <div><img src="${pokeimgFront}" alt="${pokemon.name} (vista de frente)"></div>
                    <div><img src="${pokeimgBack}" alt="${pokemon.name} (vista de trasera)"></div>
                </div>
                <div class="info">
                    <div><h3>Abilities</h3> ${pokeAbility.join(', ')}</div>
                    <div><h3>Moves</h3> ${pokeMovesResumen}</div>
                </div>
            </div>            
            <div class="bg"></div>
            `;



        //btn cerrar
        const btnClose = document.createElement('a');
        btnClose.innerHTML = '<i class="fa fa-times-circle fa-2x" aria-hidden="true"></i>';
        btnClose.classList.add('btn-close');
        btnClose.addEventListener('click', () => {
            cerrarModal();
        })

        //btn next
        const btnNext = document.createElement('a');
        btnNext.innerHTML = '<i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>';
        btnNext.classList.add('btn-next');
        btnNext.addEventListener('click', () => {
            pokeAlertInfo(nextID);
        })

        //btn prev
        const btnPrev = document.createElement('a');
        btnPrev.innerHTML = '<i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>';
        btnPrev.classList.add('btn-prev');
        btnPrev.addEventListener('click', () => {
            pokeAlertInfo(prevID);
        })

        infoContainer.setAttribute('id', `poke${pokemon.id}`);
        infoContainer.classList.add('active');
        info.prepend(btnClose, btnNext, btnPrev);
    });
    

    

    
}
const cerrarModal = ()=>{
    infoContainer.classList.remove('active');
    info.innerHTML = '';
}

init();