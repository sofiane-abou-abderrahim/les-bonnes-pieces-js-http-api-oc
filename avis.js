export function reviewsAddListener() {
  const piecesElements = document.querySelectorAll('.sheets article button');

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener('click', async function (event) {
      const id = event.target.dataset.id;
      const response = await fetch(`http://localhost:8081/pieces/${id}/avis`);
      const reviews = await response.json();

      const pieceElement = event.target.parentElement;

      const reviewsElement = document.createElement('p');
      for (let i = 0; i < reviews.length; i++) {
        reviewsElement.innerHTML += `${reviews[i].user}: ${reviews[i].comment} <br>`;
      }
      pieceElement.appendChild(reviewsElement);
    });
  }
}
