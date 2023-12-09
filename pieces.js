import {
  reviewsAddListener,
  sendReviewsAddListener,
  displayReviews
} from './avis.js';

// Retrieving pieces potentially stored in localStorage
let pieces = window.localStorage.getItem('pieces');
if (pieces === null) {
  // Retrieve parts from the JSON file
  // const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());
  const response = await fetch('http://localhost:8081/pieces');
  pieces = await response.json();

  // Transforme the pieces into JSON
  const piecesValue = JSON.stringify(pieces);

  // Store the information in localStorage
  window.localStorage.setItem('pieces', piecesValue);
} else {
  pieces = JSON.parse(pieces);
}

// Call the function to add the listener on the reviews form
sendReviewsAddListener();

// Function that generates the entire web page
function generatePieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i];

    // Retrieve the DOM element that will host the cards
    const sectionSheets = document.querySelector('.sheets');

    // Create a tag dedicated to an automotive piece
    const pieceElement = document.createElement('article');

    // Create the img element
    const imageElement = document.createElement('img');
    // Access index i of the pieces list to configure the image source
    imageElement.src = article.image;

    const nameElement = document.createElement('h2');
    nameElement.innerText = article.name;

    const priceElement = document.createElement('p');
    priceElement.innerText = `Prix: ${article.price} € (${
      article.price < 35 ? '€' : '€€€'
    })`;

    const categoryElement = document.createElement('p');
    categoryElement.innerText = article.category ?? '(aucune catégorie)';

    const descriptionElement = document.createElement('p');
    descriptionElement.innerText =
      article.description ?? 'Pas de description pour le moment.';

    const stockElement = document.createElement('p');
    stockElement.innerText = article.availability
      ? 'En stock'
      : 'Rupture de stock';

    // Create reviews button to display reviews
    const reviewsButton = document.createElement('button');
    reviewsButton.dataset.id = article.id;
    reviewsButton.textContent = 'Afficher les avis';

    // Attach the article tag to the Sheets section
    sectionSheets.appendChild(pieceElement);
    // Attach the image to pieceElement (the article tag)
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nameElement);
    pieceElement.appendChild(priceElement);
    pieceElement.appendChild(categoryElement);
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(stockElement);
    // appended reviews button to its parent
    pieceElement.appendChild(reviewsButton);
  }

  // Call reviewsAddListener function
  reviewsAddListener();
}

// Initial display of the page
generatePieces(pieces);

// Retrieving reviews potentially stored in localStorage
for (let i = 0; i < pieces.length; i++) {
  const id = pieces[i].id;
  const reviewsJSON = window.localStorage.getItem(`piece-reviews-${id}`);
  const reviews = JSON.parse(reviewsJSON);

  if (reviews !== null) {
    const pieceElement = document.querySelector(`article[data-id="${id}"]`);

    // Add a check to ensure pieceElement is not null before calling displayReviews
    if (pieceElement) {
      displayReviews(pieceElement, reviews);
    }
  }
}

// sort button management
const sortButton = document.querySelector('.btn-sort');

sortButton.addEventListener('click', function () {
  const orderedPieces = Array.from(pieces);
  orderedPieces.sort(function (a, b) {
    return a.price - b.price;
  });
  // Clearing the screen and regenerating the page
  document.querySelector('.sheets').innerHTML = '';
  generatePieces(orderedPieces);
});

// filter button management
const filterButton = document.querySelector('.btn-filter');

filterButton.addEventListener('click', function () {
  const filteredPieces = pieces.filter(function (piece) {
    return piece.price <= 35;
  });
  // Clearing the screen and regenerating the page with only the filtered pieces
  document.querySelector('.sheets').innerHTML = '';
  generatePieces(filteredPieces);
});

// descending button management
const descendingButton = document.querySelector('.btn-descending');

descendingButton.addEventListener('click', function () {
  const orderedPieces = Array.from(pieces);
  orderedPieces.sort(function (a, b) {
    return b.price - a.price;
  });
  // Clearing the screen and regenerating the page
  document.querySelector('.sheets').innerHTML = '';
  generatePieces(orderedPieces);
});

// no description button management
const noDescriptionButton = document.querySelector('.btn-no-desc');

noDescriptionButton.addEventListener('click', function () {
  const filteredPieces = pieces.filter(function (piece) {
    return piece.description;
  });
  // Clearing the screen and regenerating the page with only the filtered pieces
  document.querySelector('.sheets').innerHTML = '';
  generatePieces(filteredPieces);
});

// map the articles list
const articleNames = pieces.map(piece => piece.name);
// console.log(articleNames);

// delete non affordable articles
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].price > 35) {
    articleNames.splice(i, 1);
  }
}
// console.log(articleNames);

const pElement = document.createElement('p');
pElement.innerText = 'Pièces abordables';

// create affordables list
const affordablesElements = document.createElement('ul');

// add each name to the affordables list
for (let i = 0; i < articleNames.length; i++) {
  const articleNamesElement = document.createElement('li');
  articleNamesElement.innerHTML = articleNames[i];
  affordablesElements.appendChild(articleNamesElement);
}

// add the header and then the list to the filter results block
document
  .querySelector('.affordables')
  .appendChild(pElement)
  .appendChild(affordablesElements);

// created two lists from pieces list
const availableArticlesNames = pieces.map(piece => piece.name);
// console.log(availableArticlesNames);
const availableArticlesPrices = pieces.map(piece => piece.price);
// console.log(availableArticlesPrices);

// delete non available articles from the two lists above
for (let i = pieces.length - 1; i >= 0; i--) {
  if (!pieces[i].availability) {
    availableArticlesNames.splice(i, 1);
    availableArticlesPrices.splice(i, 1);
  }
}
// console.log(availableArticlesNames);
// console.log(availableArticlesPrices);

// create availables list
const availablesElements = document.createElement('ul');

// add each name and price to the availables list
for (let i = 0; i < availableArticlesNames.length; i++) {
  const availableArticleNamesElement = document.createElement('li');
  availableArticleNamesElement.innerHTML = `${availableArticlesNames[i]} - ${availableArticlesPrices[i]} €`;
  availablesElements.appendChild(availableArticleNamesElement);
}

const pAvailableElement = document.createElement('p');
pAvailableElement.innerText = 'Pièces disponibles:';
document
  .querySelector('.availables')
  .appendChild(pAvailableElement)
  .appendChild(availablesElements);

// retrieve input tag reference
const maxPriceInput = document.querySelector('#max-price');

maxPriceInput.addEventListener('input', function () {
  const filteredPieces = pieces.filter(function (piece) {
    return piece.price <= maxPriceInput.value;
  });
  // Clearing the screen and regenerating the page with only the filtered pieces
  document.querySelector('.sheets').innerHTML = '';
  generatePieces(filteredPieces);
});

// Adding the listener to update localStorage data
const updateButton = document.querySelector('.btn-update');
updateButton.addEventListener('click', function () {
  window.localStorage.removeItem('pieces');
});
