import API_KEY from "./config.js";  // Secure API Key

// Selecting elements from DOM
const photosContainer = document.getElementById("photos");
const dateInput = document.getElementById("dateInput");
const solInput = document.getElementById("solInput");
const fetchPhotosBtn = document.getElementById("fetchPhotos");
const eventSelect = document.getElementById("eventSelect");

// Preselected Significant Date: 2018-06-01 (Martian Spring)
const DEFAULT_DATE = "2018-06-01";

// Fetch photos when the page loads
window.addEventListener("DOMContentLoaded", () => {
    fetchSignificantDatePhotos(DEFAULT_DATE, "2018 Martian Spring");
});

// Event listener to fetch photos based on user selection
fetchPhotosBtn.addEventListener("click", () => {
    const date = dateInput.value;
    const sol = solInput.value;
    
    if (date) {
        fetchSignificantDatePhotos(date, `Mars Rover Photos for ${date}`);
    } else if (sol) {
        fetchPhotosBySol(sol);
    } else {
        displayError("Please select an Earth date or Martian sol.");
    }
});

// Event listener for the dropdown to fetch event-specific photos
eventSelect.addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    if (selectedDate) {
        fetchSignificantDatePhotos(selectedDate, `Significant Mars Rover Event: ${selectedDate}`);
    }
});

// Function to fetch photos for a specific Earth date
async function fetchSignificantDatePhotos(date, description) {
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.photos || data.photos.length === 0) {
            displayError(`No photos found for ${date}.`);
            return;
        }

        displayPhotos(data.photos, description);
    } catch (error) {
        console.error("Error fetching data:", error);
        displayError("Failed to load Mars Rover photos. Please try again later.");
    }
}

// Function to fetch photos by Martian Sol
async function fetchPhotosBySol(sol) {
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.photos || data.photos.length === 0) {
            displayError(`No photos found for Sol ${sol}.`);
            return;
        }

        displayPhotos(data.photos, `Mars Rover Photos for Sol ${sol}`);
    } catch (error) {
        console.error("Error fetching data:", error);
        displayError("Failed to load Mars Rover photos. Please try again later.");
    }
}

// Function to display selected Mars Rover photos with captions
function displayPhotos(photos, description) {
    photosContainer.innerHTML = "";  // Clear previous results

    const title = document.createElement("h2");
    title.textContent = description;
    photosContainer.appendChild(title);

    // Select first 3 photos or fewer if not available
    const selectedPhotos = photos.length >= 3 ? photos.slice(0, 3) : photos;

    selectedPhotos.forEach(photo => {
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

// Function to display error messages
function displayError(message) {
    photosContainer.innerHTML = `<p class="error">${message}</p>`;
}
