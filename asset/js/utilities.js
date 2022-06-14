export const $ = selector => document.querySelector(selector);
export const create = element => document.createElement(element);

export const capitalize = name => {
  const separator = "";
  const [first, ...res] = name.split(separator);
  return first.toUpperCase() + res.join(separator);
};

export const getIcon = label => {
  return `<i class="fa fa-${label}" aria-hidden="true"></i>`;
};

export const spriteAdapter = sprites => ({
  front: sprites.front_default,
  back: sprites.back_default,
  svg: sprites.other.dream_world.front_default,
  animatedFront:
    sprites.versions["generation-v"]["black-white"].animated.front_default,
  animatedBack:
    sprites.versions["generation-v"]["black-white"].animated.back_default,
});

export const addEvent = (parent, selector, eventString, callback) => {
  return parent
    .querySelector(selector)
    .addEventListener(eventString, e => callback(e));
};
