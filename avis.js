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
  const nb_comments = [0, 0, 0, 0, 0];

  // Traverse through the reviews
  for (let comment of reviews) {
    // Increment the elements in the list corresponding to the number of stars awarded
    nb_comments[comment.nbStars - 1]++;
  }

  ///// Prepare the configuration for the chart /////
  // Legend that will be displayed on the left next to the horizontal bar
  const labels = ['5', '4', '3', '2', '1'];
  // Data and customization of the chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Étoiles attribuées',
        data: nb_comments.reverse(),
        backgroundColor: 'rgba(255, 230, 0, 1)' // Yellow color
      }
    ]
  };
  // Final configuration object
  const config = {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y'
    }
  };
  // Render the chart in the canvas element
  const reviewsGraphic = new Chart(
    document.querySelector('#reviews-graphic'),
    config
  );

  // Retrieve pieces from localStorage
  const piecesJSON = window.localStorage.getItem('pieces');
  const pieces = JSON.parse(piecesJSON);

  // Calculate the number of comments
  let nbAvailableComments = 0;
  let nbUnvailableComments = 0;

  // Iterate through the list of pieces
  for (let i = 0; i < reviews.length; i++) {
    const piece = pieces.find(p => p.id === reviews[i].pieceId);

    // Increment the correct variable using an if-else condition
    if (piece) {
      if (piece.availability) {
        nbAvailableComments++;
      } else {
        nbUnvailableComments++;
      }
    }
  }
}
