import { errorResponse } from "./errorResponse.js";
import { httpService } from "./httpService.js";
import {
  $,
  create,
  capitalize,
  getIcon,
  spriteAdapter,
  addEvent,
} from "./utilities.js";

class Pokedex {
  constructor(div) {
    this.limit = 20;
    this.pokemons = [];
    this.stage = $(div) || null;
  }

  async init() {
    this.addStage();
    await this.loadPokemons();
    await this.getPokemonList();
  }

  addStage() {
    const stage = `
    <header><div class="logo"><div></header>
    <main><div class="pokemon-list"></div></main>
    <footer></footer>
    <div class="modal" id="modal"><div>`;
    this.stage.innerHTML = stage;
  }

  async loadPokemons() {
    try {
      const endpoint = `pokemon?offset=0&limit=${this.limit}`;
      const { data } = await httpService.get(endpoint);
      const pokemons = await data.results;
      this.pokemons = pokemons;
    } catch (error) {
      errorResponse(this.stage, error);
    }
  }

  async getPokemonList() {
    const pokemonList = $(".pokemon-list");
    this.pokemons.forEach(async (pokemon, i) => {
      const id = i + 1;
      pokemonList.append(this.createCard(id));

      const { data } = await httpService(pokemon.url);
      await this.insertData(data);

      this.pokemons[i].data = data;
    });
  }

  createCard(id) {
    const card = create("a");
    card.classList.add("card", "pending");
    card.id = `p${id}`;

    card.innerHTML = `
    <div class="card-number"></div>
    <div class="card-image"></div>
    <h3></h3>`;

    return card;
  }

  async insertData(data) {
    const { id, sprites, species, name } = data;
    const card = $(`#p${id}`);

    const number = card.querySelector(".card-number");
    const image = card.querySelector(".card-image");
    const title = card.querySelector("h3");

    const { front } = spriteAdapter(sprites);
    const { data: specie } = await httpService(species.url);
    const { name: color } = specie.color;

    this.pokemons[id - 1].color = color;

    number.innerHTML = id;
    image.innerHTML = `<img src="${front}" alt="${name}">`;
    title.innerHTML = capitalize(name);

    card.classList.add(`card-${color}`);
    card.classList.remove("pending");

    // listener
    card.addEventListener("click", e => {
      this.openModal({ data, color });
    });
  }

  openModal({ data, color }) {
    const classColor = `modal-${color}`;
    const modal = $("#modal");
    modal.removeAttribute("class");
    modal.classList.add("modal", "open", classColor);

    const { id, sprites, name } = data;
    const { svg, animatedFront, animatedBack } = spriteAdapter(sprites);

    const prev = id - 1 || this.limit;
    const next = id + 1 > this.limit ? 1 : id + 1;

    modal.innerHTML = `<a class='toReturn'></a>
    <div class="container">
      <div class="modal-header">
        <a class="left" data-id="${prev}">${getIcon("chevron-left")}</a>
        <a class="right" data-id="${next}">${getIcon("chevron-right")}</a>
        <h2>${capitalize(name)}</h2>
        <div>
          type
        </div>
      </div>
      
      <div class="modal-body">
        <div class="number">${id}</div>
        <div class="close">${getIcon("times-circle")}</div>
        <div class="image">
          <img src="${svg}" alt="${name}" />
        </div>
        <div class="content">
          <div class="thumbs">
            <img src="${animatedFront}" alt="${name}" />
            <img src="${animatedBack}" alt="${name}" />
          </div>
          <div class="stats">
            grafico
          </div>
          <div class="abilities">
            habilidades
          </div>
          <div class="moves">
            ataques
          </div>
        </div>
      </div>
    </div>`;

    // listener
    addEvent(modal, ".toReturn", "click", e => {
      this.closeModal(classColor);
    });

    addEvent(modal, ".close", "click", e => {
      this.closeModal(classColor);
    });

    addEvent(modal, ".left", "click", e => {
      this.goToOpen(e);
    });

    addEvent(modal, ".right", "click", e => {
      this.goToOpen(e);
    });
  }

  closeModal(classColor) {
    const modal = $(".modal");
    modal.classList.remove("open", classColor);
  }
  goToOpen(e) {
    const id = e.currentTarget.getAttribute("data-id");
    const { data, color } = this.pokemons[id - 1];
    this.openModal({ data, color });
  }
}

const pokedex = new Pokedex("#app");
pokedex.init();

// SVG: ;
// ANIMATED: ;

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
