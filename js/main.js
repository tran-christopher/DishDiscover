const $searchBarOneInput = document.querySelector('.search-one');
const $searchBarTwoInput = document.querySelector('.search-two');
const $handleSearchOne = document.querySelector('.form-one');
const $handleSearchTwo = document.querySelector('.form-two');

const $searchResultsList = document.querySelector('.unordered-list');

const $homeView = document.querySelector('.home');
const $searchView = document.querySelector('.search');
const $selectView = document.querySelector('.select');

const $ingredientDisplay = document.querySelector('.ingredients');
const $instructionDisplay = document.querySelector('.instructions');
const $nutritionDisplay = document.querySelector('.nutrition');

const $homeButton = document.querySelector('.home-button');
const $resultsButton = document.querySelector('results-button');

$homeButton.addEventListener('click', function (event) {
  viewSwap('home');
});

// $resultsButton.addEventListener('click', function (event) {
//   viewSwap('search')
// });

$handleSearchOne.addEventListener('submit', function (event) {
  event.preventDefault();
  const criteria = $searchBarOneInput.value;
  getRecipes(criteria);
  viewSwap('search');
  $searchBarOneInput.value = '';
});

$handleSearchTwo.addEventListener('submit', function (event) {
  event.preventDefault();
  const criteria = $searchBarOneInput.value;
  getRecipes(criteria);
  viewSwap('search');
  $searchBarTwoInput.value = '';
});

function getRecipes(parameter) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.edamam.com/api/recipes/v2?type=public&q=${parameter}&app_id=b093ed76&app_key=9d739d793a989a61b52ed12591b6a75a`,
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const recipeObject = xhr.response;
    console.log(recipeObject);
    for (let i = 0; i < recipeObject.hits.length; i++) {
      const $recipeResult = searchRecipes(recipeObject.hits[i]);
      $searchResultsList.prepend($recipeResult);
    }
  });
  xhr.send();
}

function getOneRecipe(uri) {
  const encodedUri = encodeURIComponent(uri);
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.edamam.com/api/recipes/v2/by-uri?type=public&uri=${encodedUri}&app_id=b093ed76&app_key=9d739d793a989a61b52ed12591b6a75a`,
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const recipeObject = xhr.response;
    console.log(recipeObject);
    const $displayRecipe = renderRecipe(recipeObject);
    const $displayIngredients = getIngredients(recipeObject);
    const $displayInstructions = getInstructions(recipeObject);
    const $displayNutrition = getNutrition(recipeObject);
    $selectView.prepend($displayRecipe);
    $ingredientDisplay.appendChild($displayIngredients);
    $instructionDisplay.appendChild($displayInstructions);
    $nutritionDisplay.appendChild($displayNutrition);
  });
  xhr.send();
}

function searchRecipes(object) {
  const recipeUri = object.recipe.uri;
  const $li = document.createElement('li');
  const $a = document.createElement('a');

  $li.appendChild($a);
  $li.setAttribute('class', 'check column-full margin-top text-center');
  $a.setAttribute('href', '#');

  $a.textContent = object.recipe.label;

  $a.addEventListener('click', function (event) {
    event.preventDefault();
    getOneRecipe(recipeUri);
    viewSwap('select');
  });

  return $li;
}

function renderRecipe(object) {
  const $bigDiv = document.createElement('div');
  const $recipeNameDiv = document.createElement('div');
  const $recipeName = document.createElement('h2');
  const $imageDiv = document.createElement('div');
  const $image = document.createElement('img');

  $bigDiv.setAttribute('class', 'home-body height-margin');
  $recipeNameDiv.setAttribute('class', 'column-half');
  $imageDiv.setAttribute('class', 'column-half');

  $recipeName.textContent = object.hits[0].recipe.label;
  $image.src = object.hits[0].recipe.images.REGULAR.url;

  $bigDiv.appendChild($recipeNameDiv);
  $bigDiv.appendChild($imageDiv);
  $recipeNameDiv.appendChild($recipeName);
  $imageDiv.appendChild($image);

  return $bigDiv;
}

function getIngredients(object) {
  const $ingredientDiv = document.createElement('div');
  $ingredientDiv.setAttribute(
    'class',
    'column-full height-full height-margin-two',
  );
  for (let i = 0; i < object.hits[0].recipe.ingredients.length; i++) {
    const $ingredient = document.createElement('p');
    $ingredient.textContent = object.hits[0].recipe.ingredients[i].text;
    $ingredientDiv.appendChild($ingredient);
  }
  return $ingredientDiv;
}

function getInstructions(object) {
  const $instructionDiv = document.createElement('div');
  $instructionDiv.setAttribute(
    'class',
    'column-full height-full height-margin-two',
  );
  for (let i = 0; i < object.hits[0].recipe.instructionLines.length; i++) {
    const $instruction = document.createElement('p');
    $instruction.textContent = object.hits[0].recipe.instructionLines[i];
    $instructionDiv.appendChild($instruction);
  }
  return $instructionDiv;
}

function getNutrition(object) {
  const $nutritionDiv = document.createElement('div');
  $nutritionDiv.setAttribute(
    'class',
    'column-full height-full height-margin-two',
  );
  const nutritionObject = object.hits[0].recipe.totalNutrients;

  for (const key in nutritionObject) {
    if (nutritionObject.hasOwnProperty(key)) {
      const eachObject = nutritionObject[key];
      let nutritionText = `${key}: `;

      for (const property in eachObject) {
        if (eachObject.hasOwnProperty(property)) {
          nutritionText += `${property}: ${eachObject[property]}, `;
        }
      }
      nutritionText = nutritionText.slice(0, -2);
      const $nutrition = document.createElement('p');
      $nutrition.textContent = nutritionText;
      $nutritionDiv.appendChild($nutrition);
    }
  }
  return $nutritionDiv;
}

function viewSwap(view) {
  if (view === 'home') {
    $homeView.classList.remove('hidden');
    $searchView.classList.add('hidden');
    $selectView.classList.add('hidden');
  } else if (view === 'search') {
    $homeView.classList.add('hidden');
    $searchView.classList.remove('hidden');
    $selectView.classList.add('hidden');
  } else if (view === 'select') {
    $homeView.classList.add('hidden');
    $searchView.classList.add('hidden');
    $selectView.classList.remove('hidden');
  }
}
