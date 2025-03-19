import API_KEY from "./config.js";  // Import API key securely

const API_KEY = "YOUR_NASA_API_KEY"; // Replace with your API key
const photosContainer = document.getElementById("photos");
const dateInput = document.getElementById("dateInput");
const solInput = document.getElementById("solInput");
const fetchPhotosBtn = document.getElementById("fetchPhotos");

document.getElementById("fetchPhotos").addEventListener("click", fetchPhotos);

fetchPhotosBtn.addEventListener("click", fetchPhotos);

async function fetchPhotos() {
    const date = document.getElementById("dateInput").value;
    const sol = document.getElementById("solInput").value;
    
    // Construct API request URL
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
        
        displayPhotos(data.photos);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayPhotos(photos) {
    photosContainer.innerHTML = "";
    
    if (photos.length === 0) {
        photosContainer.innerHTML = "<p>No photos found for this date/sol.</p>";
        return;
    }

    photos.forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.img_src;
        img.alt = "Mars Rover Photo";
        img.classList.add("rover-photo");
        photosContainer.appendChild(img);
    });
}
