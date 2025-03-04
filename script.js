async function getRecipes() {
    const searchTerm = document.getElementById('searchTerm').value;
    if (!searchTerm) return;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();
    document.getElementById('recipes').innerHTML = data.meals ? data.meals.map(meal => `
        <div class="recipe-card">
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="Recipe">
            <button onclick="getRecipeDetails('${meal.idMeal}')">View Recipe</button>
            <button onclick="saveToFavorites('${meal.strMeal}', '${meal.strMealThumb}', '${meal.idMeal}')">Add to Favorites</button>
        </div>
    `).join('') : '<p>No recipes found.</p>';
}

async function getRecipeDetails(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];
    document.getElementById('popupTitle').innerText = meal.strMeal;
    document.getElementById('popupCategory').innerText = `Category: ${meal.strCategory}`;
    document.getElementById('popupIngredients').innerHTML = Object.keys(meal)
        .filter(key => key.startsWith('strIngredient') && meal[key])
        .map(key => `<li>${meal[key]}</li>`)
        .join('');
    document.getElementById('popupInstructions').innerText = meal.strInstructions;
    document.getElementById('popup').style.display = 'block';
}
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}
function saveToFavorites(name, image, id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.id === id)) {
        favorites.push({ name, image, id });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.getElementById('favorites').innerHTML = favorites.map(fav => `
        <div class="recipe-card">
            <h3>${fav.name}</h3>
            <img src="${fav.image}" alt="Recipe">
            <button onclick="getRecipeDetails('${fav.id}')">View Recipe</button>
            <button onclick="removeFromFavorites('${fav.id}')">Remove</button>
        </div>
    `).join('');
}
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}
displayFavorites();