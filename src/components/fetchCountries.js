export function getCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=capital,population,flags,languages,name`
  ).then(response => {
   if (!response.ok) {
     throw new Error('Not found!');
   }
   return response.json();
 })
}
