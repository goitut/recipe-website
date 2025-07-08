const { getRandomValues } = require("crypto");

const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const searchForm = document.getElementById("search-form");

const searchInput = document.getElementById("search-input");

const resultsGrid = document.getElementById("results-grid");

const messageArea = document.getElementById("message-area");

const randomButton = document.getElementById("random-button");



searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm) {
    searchRecipes(searchTerm);
  } else {
    showMessage("Please enter a search term", true);
    resultsGrid.innerHTML = "";


  }
});

async function searchRecipes(query) {
  showMessage(`searching for ${query}....`, false, true)
  resultsGrid.innerHTML = "";

  try {
    const response = await fetch(`${SEARCH_API_URL}${query}`);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    clearMessage();
    console.log("data: ", data);

    if (data.meals) {
      displayRecipe(data.meals);
    } else {
      showMessage(`No recipe found for ${query},`)
    }
    clearMessage();
    console.log("data:", data);


  } catch (error) {
    showMessage("something went wrong, Please try again.", true);
  }

}

function showMessage(message, isError = false, isLoading = false) {
  messageArea.textContent = message;
  if (isError) messageArea.classList.add("error");
  if (isLoading) messageArea.classList.add("loading");
}

function clearMessage() {
  messageArea.textContent = "";
  messageArea.className = "message";
}

function displayRecipe(recipes) {
  if (!recipes || recipes.lenghth === 0) {
    showMessage("No recipes to display");
    return;
  }

  recipes.forEach((recipe) => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipe-item");
    recipeDiv.dataset.id = recipe.idMeal;

    recipeDiv.innerHTML = `
           <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
          <h3>${recipe.strMeal}</h3>
    `;

    resultsGrid.appendChild(recipeDiv);
  })
}


randomButton.addEventListener("click", getRandomRecipe);

async function getRandomRecipe() {
  showMessage("Fetching a random recipe...", false, true);
  resultsGrid.innerHTML = "";

  try {
    const response = await fetch(RANDOM_API_URL);
    if (!response.ok) throw new Error("Something went wrong");
    const data = await response.json();

    clearMessage();

    if (data.meals && data.meals. lenghth > 0) {
      displayRecipes(data.meals);
    } else {
      showMessage("Could not fetch a random recipe. Please try again.", true);
    }

  } catch(error) {
    showMessage(
      "Failed to fetch a random recipe. Please chech your connection and try again.",
    );
  }
}