
const API           = 'https://pokeapi.co/api/v2/pokemon';
const count         = 150;
const pokemones     = document.getElementById('pokemones');
const info          = document.getElementById('info');
const infoContainer = document.querySelector('.info-container');


const init = ()=>{
    fetch(`${API}?offset=0&limit=${count}`)
        .then(response => response.json())
        .then(pokemonJson => createPokeContainer(pokemonJson))
}


const createPokeContainer = pokemonJson => {
    const pokeList = pokemonJson.results;
    // console.log(pokemonJson.results);

    pokeList.forEach(({name, url}, i) => {

        fetch(url)
            .then(response => response.json())
            .then(pokemon => insertPokemon(pokemon))
        
        const pid = i + 1;

        // div
        const pokeDiv = document.createElement('div');
        pokeDiv.classList.add('pokemon');
        pokeDiv.id = pid;
        
        // numero de pokemon
        const pokeNumber = document.createElement('p');
        pokeNumber.classList.add('num');
        pokeNumber.innerText = pid;

        // nombre del pokemon
        const pokeName = document.createElement('p');
        pokeName.innerText = name;

        pokeDiv.append(pokeName, pokeNumber);
        pokemones.append(pokeDiv);
    });
}

const insertPokemon = ({id, sprites, species})=>{

    const pokeDiv = document.getElementById(id);

    // imagen
    const pokeimg = document.createElement('img');
    pokeimg.setAttribute('src', sprites.front_default);

    // especie / color
    const pokeSpeciesURL = species.url;

    fetch(pokeSpeciesURL).then(response => response.json()).then(species =>{
        
        pokeDiv.setAttribute('data-color', species.color.name);
        pokeDiv.addEventListener('click', (event) => pokeAlertInfo(event.currentTarget.id));
        pokeDiv.prepend(pokeimg);
        
    });    
}

const pokeAlertInfo = pokemonID => {

    //get pokemon
    const pokeURL = `${API}/${pokemonID}`;
    fetch(pokeURL).then(response => response.json()).then(pokemon => getDataPokemon(pokemon));
    
    const nextID = (parseInt(pokemonID) >= count) ? 1 : parseInt(pokemonID) + 1;
    const prevID = (parseInt(pokemonID) <= 1) ? count : parseInt(pokemonID) - 1;

    //btn next
    const btnNext = document.createElement('a');
    btnNext.innerHTML = '<i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>';
    btnNext.classList.add('btn-next');
    btnNext.addEventListener('click', () => pokeAlertInfo(nextID));

    //btn prev
    const btnPrev = document.createElement('a');
    btnPrev.innerHTML = '<i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>';
    btnPrev.classList.add('btn-prev');
    btnPrev.addEventListener('click', () => pokeAlertInfo(prevID));

    //btn cerrar
    const btnClose = document.createElement('a');
    btnClose.innerHTML = '<i class="fa fa-times-circle fa-2x" aria-hidden="true"></i>';
    btnClose.classList.add('btn-close');
    btnClose.addEventListener('click', () => cerrarModal());

    //container
    const container = document.createElement('div');
    container.classList.add('container');

    infoContainer.setAttribute('id', `poke${pokemonID}`);
    infoContainer.classList.add('active');
    info.innerText = '';
    info.prepend(btnNext, btnPrev, btnClose, container);
    
}

const getDataPokemon = ({ id, name, sprites, abilities, species, types, moves })=>{

    //Habilidad ES
    // const pokeAbilitiURL = pokemon.abilities[0].ability.url;
    // fetch(pokeAbilitiURL).then(response => response.json()).then(abiliti => {
    //     const abilitiName = (abiliti.names.find(element => element.language.name === 'es').name);
    //     const abilitiEfect = (abiliti.flavor_text_entries.find(element => element.language.name === 'es').flavor_text);
    //     const abilitiResponse = `<h3>Habilidad</h3> ${abilitiName}: ${abilitiEfect}`;
    // });

    console.log(id)


    //imagen
    const pokeIMG = sprites.other.dream_world.front_default;
    const pokeimgFront = sprites.front_default;
    const pokeimgBack = sprites.back_default;

    //Habilidades
    const pokeAbility = abilities.map(a => a.ability.name).join(', ');

    //movimientos
    const pokeMoves = moves.map(m => m.move.name);
    const pokeMovesResumen = (pokeMoves.length > 10) ? pokeMoves.slice(0, 10).join(', ') + '...' : pokeMoves.join(', ');

    //especie / color
    const pokeSpeciesURL = species.url;
    fetch(pokeSpeciesURL).then(response => response.json()).then(s => {
        infoContainer.setAttribute('data-color', s.color.name);
    });

    //tipo de pokemon
    const pokeTypes = types.map(t => t.type.name);
    let pokeTypesHTML = '';
    pokeTypes.forEach(tipo =>  pokeTypesHTML+=`<span>${tipo}</span>`);
    
    info.lastChild.innerHTML = `
        <div>
            <div><h1>${name}<small>${pokeTypesHTML}</small></h1></div>
            <div class="images">
                <div class="img">
                    <img src="${pokeIMG}" alt="${name}">
                </div>
                <div class="imgs">
                    <div><img src="${pokeimgFront}" alt="${name} (vista de frente)"></div>
                    <div><img src="${pokeimgBack}" alt="${name} (vista de trasera)"></div>
                </div>
            </div> 
            <div class="info">
                <div><h3>Abilities</h3> ${pokeAbility}</div>
                <div><h3>Moves</h3> ${pokeMovesResumen}</div>
            </div>
        </div>            
        <div class="bg"><span class="num">${id}</span></div>
        `;
    
}

const cerrarModal = ()=>{
    infoContainer.classList.remove('active');
    info.innerHTML = '';
}

init();