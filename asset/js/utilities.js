export const $ = selector => document.querySelector(selector);
export const create = element => document.createElement(element);

export const capitalize = name => {
  const separator = "";
  const [first, ...res] = name.split(separator);
  return first.toUpperCase() + res.join(separator);
};
