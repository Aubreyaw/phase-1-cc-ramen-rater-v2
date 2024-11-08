// index.js
document.addEventListener("DOMContentLoaded", function() {
  main()
})
// Callbacks
const mainAPI = 'http://localhost:3000/ramens';

let currentRamenId = null

const displayRamens = () => {
  fetch(mainAPI)
  .then(response => response.json())
  .then(ramens => {
    console.log(ramens);
    const ramenMenuDiv = document.getElementById("ramen-menu");
    ramens.forEach(ramen => {
      const ramenImage = document.createElement("img");
      ramenImage.src = ramen.image;
      ramenImage.setAttribute('data-id', ramen.id)
      ramenMenuDiv.appendChild(ramenImage);
      ramenImage.addEventListener('click', () => handleClick(ramen));
     
    });

    if (ramens.length > 0) {
      handleClick(ramens[0]);
    }

  })
  .catch(error => console.error("Error fetching ramens", error));

};

const handleClick = (ramen) => {
  const ramenImage = document.querySelector('.detail-image');
  const ramenName = document.querySelector('.name');
  const restaurantName = document.querySelector('.restaurant');
  const ramenRating = document.getElementById('rating-display');
  const ramenComment = document.getElementById('comment-display');

  ramenImage.src = ramen.image;
  ramenName.textContent = ramen.name;
  restaurantName.textContent = ramen.restaurant;
  ramenRating.textContent = ramen.rating;
  ramenComment.textContent = ramen.comment;

  currentRamenId = ramen.id;
  console.log("Ramen clicked, ID set to", currentRamenId)
};

const updateRamenForm = document.getElementById("edit-ramen")

const handleUpdateSubmitListener = () => {
  updateRamenForm.addEventListener('submit', event => {
    event.preventDefault();

    console.log("Update form Submitted");

    if (currentRamenId === null) {
      console.error("No ramen selected");
      return;
    }
    
const updatedRating = event.target['edit-rating'].value;
const updatedComment = event.target['edit-comment'].value;
console.log("Current Ramen ID:", currentRamenId)
console.log(`New Rating: ${updatedRating}, New Comment: ${updatedComment}`);

    fetch(`${mainAPI}/${currentRamenId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        rating: updatedRating,
        comment: updatedComment
      })
    })
    .then(response => response.json())
    .then(updatedRamen => {
      document.getElementById('rating-display').textContent = updatedRamen.rating;
      document.getElementById('comment-display').textContent = updatedRamen.comment;
      updateRamenForm.reset();
    })
    .catch(error => console.error("Error updating ramen", error));
  });
};

const addSubmitListener = () => {
  const form = document.getElementById('new-ramen');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch(mainAPI)
      .then(response => response.json())
      .then(ramens => {
        const maxId = Math.max(...ramens.map(ramen => parseInt(ramen.id)), 0);
        const newId = (maxId + 1).toString(); 
      

    const newRamenSubmission = {
      id: newId,
      name: event.target['new-name'].value,
      restaurant: event.target['new-restaurant'].value,
      image: event.target['new-image'].value,
      rating: event.target['new-rating'].value,
      comment: event.target['new-comment'].value,
    }; 
    
    fetch(mainAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newRamenSubmission)
    })
    .then(response => response.json())
    .then(newRamenSubmission => {
      const ramenMenuDiv = document.getElementById("ramen-menu");
      const newRamenImage = document.createElement('img');
      newRamenImage.src = newRamenSubmission.image;
      ramenMenuDiv.appendChild(newRamenImage);
      newRamenImage.addEventListener('click', () => handleClick(newRamenSubmission));
      form.reset()
    })
    .catch(error => console.error("New ramen creation error", error));
  });
})
}

  const deleteButton = document.createElement('button')
  deleteButton.className = "styled-button";
  deleteButton.textContent = "Delete Ramen";
  updateRamenForm.appendChild(deleteButton);

  deleteButton.addEventListener('click', () => {
    fetch(`${mainAPI}/${currentRamenId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
    .then(() => {
      const ramenMenuDiv = document.getElementById("ramen-menu");
      const ramenImages = ramenMenuDiv.querySelectorAll("img");

      ramenImages.forEach(image => {
        if (image.getAttribute('data-id') == currentRamenId) {
          ramenMenuDiv.removeChild(image);
        }
      });

      const ramenImage = document.querySelector('.detail-image');
      const ramenName = document.querySelector('.name');
      const restaurantName = document.querySelector('.restaurant');
      const ramenRating = document.getElementById('rating-display');
      const ramenComment = document.getElementById('comment-display');

      ramenImage.src = '';
      ramenName.textContent = '';
      restaurantName.textContent = '';
      ramenRating.textContent = '';
      ramenComment.textContent = '';

      currentRamenId = null
    })
    .catch(error => console.error("ramen delete failed", error))
  });

// deleteRamen();

//////

const main = () => {
  displayRamens();
  addSubmitListener();
  handleUpdateSubmitListener();
};



// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};
