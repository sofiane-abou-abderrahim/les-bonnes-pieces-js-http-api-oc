export function reviewsAddListener() {
  const piecesElements = document.querySelectorAll('.sheets article button');

  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener('click', async function (event) {
      const id = event.target.dataset.id;
      const response = await fetch(`http://localhost:8081/pieces/${id}/avis`);
    });
  }
}
