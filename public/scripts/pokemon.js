const fetchData = async () =>
  fetch("/pokemon-data").then((data) => data.json());

const createFragments = ([tag, attrs, ...content]) => {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }
  if (content.length === 1 && typeof content[0] === "string") {
    element.textContent = content;
    return element;
  }
  element.append(...content.map((c) => createFragments(c)));
  return element;
};

const createImage = ({ name, img_url }) => ["img", {
  src: `${img_url}`,
  alt: `${name} image`,
  class: "image",
}, ""];

const createHeader = ({ name, types }) => {
  const pokemonName = ["h4", { class: "name" }, name];
  const pokemonTypes = types.map(
    (type) => ["span", { class: `type ${type.toLowerCase()}` }, type],
  );
  const typeContainer = ["div", { class: "pokemon-type" }, ...pokemonTypes];
  return ["div", { class: "header" }, pokemonName, typeContainer];
};

const createStatTableRows = ({ stats }) => {
  const tableData = Object.entries(stats).map((
    [key, value],
  ) => ["tr", { class: "row" }, ["td", { class: "stat-name" }, key], [
    "td",
    { class: "value" },
    value ? value.toString() : "Unknown",
  ]]);
  return tableData;
};

const createPokemonCard = (pokemon) => {
  const img = ["div", { class: "image-container" }, createImage(pokemon)];
  const metadata = ["div", { class: "meta-data" }, createHeader(pokemon)];
  const statsData = [
    "table",
    { class: "stats-info" },
    ...createStatTableRows(pokemon),
  ];
  const card = createFragments([
    "div",
    { class: "card" },
    img,
    metadata,
    statsData,
  ]);
  return card;
};

const filterPokemonOnType = (allPokemon, pokemonType) =>
  allPokemon.filter((pokemon) => pokemon.types.includes(pokemonType));

const createNavigationLinks = (types) => {
  const navigation = types.map((
    type,
  ) => ["li", { class: "navigation" }, ["a", {
    class: "link",
    href: type === "all" ? "/" : type,
  }, type]]);
  return navigation;
};

const createNavigation = () => {
  const pokemonTypes = [
    "all",
    "bug",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "normal",
    "poison",
    "psychic",
    "steel",
    "water",
  ];
  return [
    "ul",
    { class: "side-bar-contents" },
    ...createNavigationLinks(pokemonTypes),
  ];
};

const renderPage = (cardsContainer, allPokemon, pokemonType, navContainer) => {
  const navigation = createNavigation();
  navContainer.append(createFragments(navigation));
  const pokemon = pokemonType === ""
    ? allPokemon
    : filterPokemonOnType(allPokemon, pokemonType);
  const cards = pokemon.map(createPokemonCard);
  cardsContainer.append(...cards);
};

window.onload = (e) => {
  const type = window.location.pathname.split("/").pop();
  const cardsContainer = document.querySelector(".cards-container");
  const navContainer = document.querySelector(".nav-container");
  fetchData().then((allPokemon) =>
    renderPage(cardsContainer, allPokemon, type, navContainer)
  );
};
