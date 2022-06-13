export const errorResponse = (div, e) => {
  const { message, response } = e;
  div.innerHTML = message;
  throw new Error(message);
};
