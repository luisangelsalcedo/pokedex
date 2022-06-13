import { errorResponse } from "./errorResponse.js";
import { httpService } from "./httpService.js";
import { $, create, capitalize } from "./utilities.js";

class Pokedex {
  constructor(div) {
    this.limit = 150;
    this.pokemons = [];

    this.stage = $(div) || null;
  }

  async init() {
    await this.loadPokemons();
    await this.getPokemonList();
  }

  async loadPokemons() {
    try {
      const endpoint = `pokemon`;
      const { data } = await httpService.get(endpoint);
      const pokemons = await data.results;
      this.pokemons = pokemons;
    } catch (error) {
      errorResponse(this.stage, error);
    }
  }

  async getPokemonList() {
    const pokemonList = create("div");
    pokemonList.classList.add("pokemon-list");
    this.pokemons.forEach(async (pokemon, i) => {
      const id = i + 1;
      pokemonList.append(this.createCard(id));

      const { data } = await httpService(pokemon.url);
      await this.insertData(data);

      this.pokemons[i].data = data;
    });
    this.stage.append(pokemonList);
  }

  createCard(id) {
    const card = create("a");
    card.classList.add("card");
    card.classList.add("pending");
    card.id = `poke-${id}`;

    // number
    const number = create("div");
    number.classList.add("card-number");

    // image
    const image = create("div");
    image.classList.add("card-image");

    // name
    const title = create("h3");

    card.append(number, image, title);
    return card;
  }

  async insertData(data) {
    const { id, sprites, species, name } = data;
    const card = $(`#poke-${id}`);
    const number = card.querySelector(".card-number");
    const image = card.querySelector(".card-image");
    const title = card.querySelector("h3");

    const source = sprites.front_default;
    const { data: specie } = await httpService(species.url);
    const { name: color } = specie.color;

    number.innerHTML = id;
    image.innerHTML = `<img src="${source}" alt="${name}">`;
    title.innerHTML = capitalize(name);

    card.classList.add(`card-${color}`);
    card.classList.remove("pending");

    // listener
    card.addEventListener("click", () => {
      console.log(name);
    });
  }
}

const pokedex = new Pokedex("#app");
pokedex.init();

// SVG: sprites.other.dream_world.front_default;
// ANIMATED: sprites.versions["generation-v"]["black-white"].animated.front_default;

// const API = "https://pokeapi.co/api/v2/pokemon";
// const count = 150;
// const pokemones = document.getElementById("pokemones");
// const info = document.getElementById("info");
// const infoContainer = document.querySelector(".info-container");

// const init = async () => {
//   // fetch(`${API}?offset=0&limit=${count}`)
//   //     .then(response => response.json())
//   //     .then(pokemonJson => createPokeContainer(pokemonJson))
//   const response = await axios.get(`${API}?offset=0&limit=${count}`);
//   const post = await response.data;
//   createPokeContainer(post);
// };

// const createPokeContainer = pokemonJson => {
//   const pokeList = pokemonJson.results;
//   // console.log(pokemonJson.results);

//   pokeList.forEach(({ name, url }, i) => {
//     // fetch(url)
//     //     .then(response => response.json())
//     //     .then(pokemon => insertPokemon(pokemon))

//     const fetchPokemon = async () => {
//       const response = await axios.get(url);
//       const pokemon = await response.data;
//       insertPokemon(pokemon);
//     };
//     fetchPokemon();

//     const pid = i + 1;

//     // div
//     const pokeDiv = document.createElement("div");
//     pokeDiv.classList.add("pokemon");
//     pokeDiv.id = pid;

//     // numero de pokemon
//     const pokeNumber = document.createElement("p");
//     pokeNumber.classList.add("num");
//     pokeNumber.innerText = pid;

//     // nombre del pokemon
//     const pokeName = document.createElement("p");
//     pokeName.innerText = name;

//     pokeDiv.append(card)(pokeName, pokeNumber);
//     pokemones.append(pokeDiv);
//   });
// };

// const insertPokemon = ({ id, sprites, species }) => {
//   const pokeDiv = document.getElementById(id);

//   // imagen
//   const pokeimg = document.createElement("img");
//   pokeimg.setAttribute("src", sprites.front_default);

//   // especie / color
//   const pokeSpeciesURL = species.url;

//   // fetch(pokeSpeciesURL).then(response => response.json()).then(species =>{

//   //     pokeDiv.setAttribute('data-color', species.color.name);
//   //     pokeDiv.addEventListener('click', (event) => pokeAlertInfo(event.currentTarget.id));
//   //     pokeDiv.prepend(pokeimg);

//   // });

//   const fetchPokeSpecies = async () => {
//     const response = await axios.get(pokeSpeciesURL);
//     const species = await response.data;

//     pokeDiv.setAttribute("data-color", species.color.name);
//     pokeDiv.addEventListener("click", event =>
//       pokeAlertInfo(event.currentTarget.id)
//     );
//     pokeDiv.prepend(pokeimg);
//   };
//   fetchPokeSpecies();
// };

// const pokeAlertInfo = pokemonID => {
//   //get pokemon
//   const pokeURL = `${API}/${pokemonID}`;
//   // fetch(pokeURL).then(response => response.json()).then(pokemon => getDataPokemon(pokemon));

//   const fetchPokeData = async () => {
//     const response = await axios.get(pokeURL);
//     const pokemon = await response.data;
//     getDataPokemon(pokemon);
//   };
//   fetchPokeData();

//   const nextID = parseInt(pokemonID) >= count ? 1 : parseInt(pokemonID) + 1;
//   const prevID = parseInt(pokemonID) <= 1 ? count : parseInt(pokemonID) - 1;

//   //btn next
//   const btnNext = document.createElement("a");
//   btnNext.innerHTML =
//     '<i class="fa fa-chevron-right fa-2x" aria-hidden="true"></i>';
//   btnNext.classList.add("btn-next");
//   btnNext.addEventListener("click", () => pokeAlertInfo(nextID));

//   //btn prev
//   const btnPrev = document.createElement("a");
//   btnPrev.innerHTML =
//     '<i class="fa fa-chevron-left fa-2x" aria-hidden="true"></i>';
//   btnPrev.classList.add("btn-prev");
//   btnPrev.addEventListener("click", () => pokeAlertInfo(prevID));

//   //btn cerrar
//   const btnClose = document.createElement("a");
//   btnClose.innerHTML =
//     '<i class="fa fa-times-circle fa-2x" aria-hidden="true"></i>';
//   btnClose.classList.add("btn-close");
//   btnClose.addEventListener("click", () => cerrarModal());

//   //container
//   const container = document.createElement("div");
//   container.classList.add("container");

//   infoContainer.setAttribute("id", `poke${pokemonID}`);
//   infoContainer.classList.add("active");
//   info.innerText = "";
//   info.prepend(btnNext, btnPrev, btnClose, container);
// };

// const getDataPokemon = ({
//   id,
//   name,
//   sprites,
//   abilities,
//   species,
//   types,
//   moves,
// }) => {
//   //Habilidad ES
//   // const pokeAbilitiURL = pokemon.abilities[0].ability.url;
//   // fetch(pokeAbilitiURL).then(response => response.json()).then(abiliti => {
//   //     const abilitiName = (abiliti.names.find(element => element.language.name === 'es').name);
//   //     const abilitiEfect = (abiliti.flavor_text_entries.find(element => element.language.name === 'es').flavor_text);
//   //     const abilitiResponse = `<h3>Habilidad</h3> ${abilitiName}: ${abilitiEfect}`;
//   // });

//   console.log(id);

//   //imagen
//   const pokeIMG = sprites.other.dream_world.front_default;
//   const pokeimgFront = sprites.front_default;
//   const pokeimgBack = sprites.back_default;

//   //Habilidades
//   const pokeAbility = abilities.map(a => a.ability.name).join(", ");

//   //movimientos
//   const pokeMoves = moves.map(m => m.move.name);
//   const pokeMovesResumen =
//     pokeMoves.length > 10
//       ? pokeMoves.slice(0, 10).join(", ") + "..."
//       : pokeMoves.join(", ");

//   //especie / color
//   const pokeSpeciesURL = species.url;
//   // fetch(pokeSpeciesURL).then(response => response.json()).then(s => {
//   //     infoContainer.setAttribute('data-color', s.color.name);
//   // });

//   const fetchPokeSpecies = async () => {
//     const response = await axios.get(pokeSpeciesURL);
//     const s = await response.data;
//     infoContainer.setAttribute("data-color", s.color.name);
//   };
//   fetchPokeSpecies();

//   //tipo de pokemon
//   const pokeTypes = types.map(t => t.type.name);
//   let pokeTypesHTML = "";
//   pokeTypes.forEach(tipo => (pokeTypesHTML += `<span>${tipo}</span>`));

//   info.lastChild.innerHTML = `
//         <div>
//             <div><h1>${name}<small>${pokeTypesHTML}</small></h1></div>
//             <div class="images">
//                 <div class="img">
//                     <img src="${pokeIMG}" alt="${name}">
//                 </div>
//                 <div class="imgs">
//                     <div><img src="${pokeimgFront}" alt="${name} (vista de frente)"></div>
//                     <div><img src="${pokeimgBack}" alt="${name} (vista de trasera)"></div>
//                 </div>
//             </div>
//             <div class="info">
//                 <div><h3>Abilities</h3> ${pokeAbility}</div>
//                 <div><h3>Moves</h3> ${pokeMovesResumen}</div>
//             </div>
//         </div>
//         <div class="bg"><span class="num">${id}</span></div>
//         `;
// };

// const cerrarModal = () => {
//   infoContainer.classList.remove("active");
//   info.innerHTML = "";
// };

// init();
