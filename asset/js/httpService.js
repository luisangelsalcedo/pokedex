export const httpService = axios.create({
  baseURL: "https://pokeapi.co/api/v2/",
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});
