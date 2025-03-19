import API_KEY from "./config.js";  // Secure API Key

// Selecting elements from DOM
const photosContainer = document.getElementById("photos");
const dateInput = document.getElementById("dateInput");
const solInput = document.getElementById("solInput");
const fetchPhotosBtn = document.getElementById("fetchPhotos");

// Event listener to trigger photo fetch
fetchPhotosBtn.addEventListener("click", fetchPhotos);

// Function to fetch Mars Rover photos based on input
async function fetchPhotos() {
    const date = dateInput.value;
    const sol = solInput.value;
    
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${API_KEY}`;

    if (date) {
        url += `&earth_date=${date}`;
    } else if (sol) {
        url += `&sol=${sol}`;
    } else {
        alert("Please enter an Earth date or a Martian sol.");
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Parse and display selected photos
        displayPhotos(data.photos);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to display selected Mars Rover photos
function displayPhotos(photos) {
    photosContainer.innerHTML = "";  // Clear previous results

    if (photos.length === 0) {
        photosContainer.innerHTML = "<p>No photos found for this date/sol.</p>";
        return;
    }

    // Select first 3 photos or a random 3 if more than 3 exist
    const selectedPhotos = photos.length >= 3 ? photos.slice(0, 3) : photos;

    selectedPhotos.forEach(photo => {
        // Destructuring the necessary data
        const { img_src, earth_date, sol, camera: { name } } = photo;

        // Create a container for each photo
        const photoCard = document.createElement("div");
        photoCard.classList.add("photo-card");

        // Create image element
        const img = document.createElement("img");
        img.src = img_src;
        img.alt = `Mars Rover Photo from Camera ${name}`;
        img.classList.add("rover-photo");

        // Create text details
        const details = document.createElement("p");
        details.innerHTML = `
            <strong>Earth Date:</strong> ${earth_date} <br>
            <strong>Martian Sol:</strong> ${sol} <br>
            <strong>Camera:</strong> ${name}
        `;

        // Append elements to photo card
        photoCard.appendChild(img);
        photoCard.appendChild(details);

        // Append photo card to the container
        photosContainer.appendChild(photoCard);
    });
}
