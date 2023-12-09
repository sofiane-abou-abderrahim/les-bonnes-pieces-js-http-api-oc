export function reviewsAddListener() {
  const piecesElements = document.querySelectorAll('.sheets article button');

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener('click', async function (event) {
      const id = event.target.dataset.id;
      const response = await fetch(`http://localhost:8081/pieces/${id}/avis`);
      const reviews = await response.json();

      // Call setItem
      window.localStorage.setItem(
        `piece-reviews-${id}`,
        JSON.stringify(reviews)
      );

      const pieceElement = event.target.parentElement;

      // Call the function
      displayReviews(pieceElement, reviews);
    });
  }
}

// Created function to display reviews
export function displayReviews(pieceElement, reviews) {
  const reviewsElement = document.createElement('p');
  for (let i = 0; i < reviews.length; i++) {
    reviewsElement.innerHTML += `${reviews[i].user}: ${reviews[i].comment} <br>`;
    reviewsElement.innerHTML += `${reviews[i].nbStars} <br>`;
  }
  pieceElement.appendChild(reviewsElement);
}

export function sendReviewsAddListener() {
  const reviewsForm = document.querySelector('.reviews-form');
  reviewsForm.addEventListener('submit', function (event) {
    // Disable the default behavior of the browser
    event.preventDefault();

    // Creating the object for the new reviews
    const reviews = {
      pieceId: parseInt(event.target.querySelector('[name=piece-id]').value),
      user: event.target.querySelector('[name=user').value,
      comment: event.target.querySelector('[name=comment]').value,
      nbStars: parseInt(event.target.querySelector('[name=nbStars]').value)
    };

    // Create the payload in a JSON format
    const payload = JSON.stringify(reviews);

    // Call the fetch function with all the necessary information
    fetch('http://localhost:8081/avis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });
  });
}

// Chart.js display reviews graphic
export async function displayReviewsGraphic() {
  // Calculate the total number of comments per quantity of stars awarded
  const reviews = await fetch('http://localhost:8081/avis').then(reviews =>
    reviews.json()
  );
  // Create an array of 5 elements initialized to 0
  const nb_commentaires = [0, 0, 0, 0, 0];
}
