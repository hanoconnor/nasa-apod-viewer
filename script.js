const resultsNav = document.getElementById("resultsNav");
const favouritesNav = document.getElementById("favouritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmation = document.querySelector(".save-confirmation");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Global Variables

let resultsArray = [];
let favourites = {};

// Show Content

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favouritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favouritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

// Create DOM Nodes

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favourites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA APOD";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    //Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "+ Add To Favourites";
      saveText.setAttribute("onclick", `saveFavourite('${result.url}')`);
    } else {
      saveText.textContent = "- Remove from Favourites";
      saveText.setAttribute("onclick", `removeFavourite('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    //Date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright Notice
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// Update DOM

function updateDOM(page) {
  // Get Favourites from localStorage
  if (localStorage.getItem("apodFavourites")) {
    favourites = JSON.parse(localStorage.getItem("apodFavourites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

// Get APOD Images from NASA API
async function getNasaPictures() {
  // Show Loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    console.log(error);
  }
}

// Add Result to Favourites
function saveFavourite(itemUrl) {
  // Loop through Results Array to select Favourite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item;
      // Show Save Confirmation (2s)
      saveConfirmation.hidden = false;
      setTimeout(() => {
        saveConfirmation.hidden = true;
      }, 2000);
      // Set Favourites in localStorage
      localStorage.setItem("apodFavourites", JSON.stringify(favourites));
    }
  });
}

// Remove item from Favourites
function removeFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl];
    // Set Favourites in localStorage
    localStorage.setItem("apodFavourites", JSON.stringify(favourites));
    updateDOM("favourites");
  }
}

// On Load
getNasaPictures();
