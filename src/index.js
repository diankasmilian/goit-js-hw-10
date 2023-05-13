import './css/styles.css';
import { getCountries } from './components/fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  box: document.querySelector('.country-info'),
  list: document.querySelector('.country-list'),
};

refs.input.addEventListener('input', debounce(inputText, DEBOUNCE_DELAY));

function inputText() {
  const value = refs.input.value.trim();
  if (value === '') {
   updateBox('');
   updateList('');
   return
  } else {
   getCountries(value)
   .then(countries => {
      if (countries.length >= 10) {
         updateBox('');
         updateList('');
         Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else
         if (countries.length < 10 && countries.length >= 2) {
            updateBox('');
            const markupList = countries.reduce((markup, country) => markup + createMarkupList(country),
               "");
            return updateList(markupList);
         } else
      if (countries.length === 1) {
         updateList('');
        const markupBox = createMarkupBox(countries[0]);
        return updateBox(markupBox);
      }
      
   })
   .catch(onError)
  }
};

function createMarkupBox({name: {official}, capital, population, flags: {svg, alt}, languages}) {
   const languagesValue = Object.values(languages);
  return `<div class='title-box'>
  <img src="${svg}" alt="${alt}" width='50' height='40'>
   <h2 class="title">${official}</h2>
   </div>
   <p><span>Capital:</span> ${capital}</p>
   <p><span>Population:</span> ${population}</p>
   <p><span>Languages:</span> ${languagesValue}</p>`;
};

function createMarkupList({name: {official}, flags: {svg, alt}}) {
   return `<li class='countries-item'>
   <img src="${svg}" alt="${alt}" width='30' height='20'>
    <h2 class="title-list">${official}</h2>
    </li>`
};

function updateBox(markup) {
  refs.box.innerHTML = markup;
};

function updateList(markup) {
   refs.list.innerHTML = markup;;
}


function onError(err) {
   console.error(err);
   Notiflix.Notify.failure('Oops, there is no country with that name');
   
   updateBox('');
   updateList('');
 };
