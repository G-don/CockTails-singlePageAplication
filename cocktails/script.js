const searchBtn = document.getElementById('search-btn');
const drinkList = document.getElementById('drink');
const drinkDetailsContent = document.querySelector('.drink-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');


searchBtn.addEventListener('click', getDrinkList);
drinkList.addEventListener('click', getDrinkRecipe);
recipeCloseBtn.addEventListener('click', () => {
    drinkDetailsContent.parentElement.classList.remove('showRecipe');
});


function getDrinkList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
  
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(text => {
        let data = text && JSON.parse(text);
        let html = "";
        if (data.drinks) {
          data.drinks.forEach(drink => {
            html += `
              <div class="drink-item" data-id="${drink.idDrink}">
                <div class="drink-img">
                  <img src="${drink.strDrinkThumb}" alt="food">
                </div>
                <div class="drink-name">
                  <h3>${drink.strDrink}</h3>
                  <a href="#" class="recipe-btn">Get Recipe</a>
                </div>
              </div>
            `;
          });
          drinkList.classList.remove('notFound');
        } else {
          html = '<div class="error">Sorry, Tone didn\'t find any recipe! Try a different spirit!</div>';
          drinkList.classList.add('notFound');
        }
        drinkList.innerHTML = html;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }


function getDrinkRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let drinkItem = e.target.parentElement.parentElement;
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkItem.dataset.id}`)
        .then(response => response.json())
        .then(data => drinkRecipeModal(data.drinks));
    }
}


function drinkRecipeModal(drink){
    console.log(drink);
    drink = drink[0];
    let html = `
        <h2 class = "recipe-title">${drink.strDrink}</h2>
        <p class = "recipe-category">${drink.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p class="instruct">${drink.strInstructions}</p>
        </div>
        <div class = "recipe-measures">
            <h3 class="measure">Measures:</h3>
    `;
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient !== null && ingredient !== '') {
            html += `<p class="instruct">${ingredient} - ${measure}</p>`;
        }
    }
    html += `
        </div>
        <div class="recipe-measures">
        <h3 class="help">Some help from Tone:</h3>
        <p class="instruct">1 oz = 30ML || TSP = Table Spoon</p>
        
        </div>
        <div class = "recipe-drink-img">
            <img src = "${drink.strDrinkThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "https://www.youtube.com/results?search_query=${drink.strDrink} cocktail" target = "_blank">Watch Video</a>
        </div>
    `;
    drinkDetailsContent.innerHTML = html;
    drinkDetailsContent.parentElement.classList.add('showRecipe');
}

