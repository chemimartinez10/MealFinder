const search = document.getElementById('search'),
    submitBtn = document.getElementById('submit'),
    randomBtn = document.getElementById('random'),
    resultHeadEl = document.getElementById('result-heading'),
    mealsEl = document.getElementById('meals'),
    singleMealEl = document.getElementById('single-meal');


//search meal from api
async function searchMeal(e) {
    e.preventDefault()


    //Clear single meal
    singleMealEl.innerHTML = ''

    //get search term
    const term = search.value
    if (term.trim()) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term.trim()}`)
        const data = await res.json()

        resultHeadEl.innerHTML = `<h2>Results for '${term}':</h2>`

        if (data.meals === null) {
            resultHeadEl.innerHTML = '<p>There are no results. Try Again!</p>'
        } else {
            mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
                <img src = "${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class = "meal-info" data-mealID=${meal.idMeal}>
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>

            `).join('');
        }
        //clear search text
        search.value = ''
    } else {
        alert('please enter a search term')
    }
}

function getMealById(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]
            addMealToDOM(meal)
        })
}

function getRandomMeal() {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0]
            addMealToDOM(meal)
        })
}

function addMealToDOM(meal) {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break
        }
    }

    mealsEl.innerHTML = ''
    resultHeadEl.innerHTML = ''

    singleMealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map(i => `<li>${i}</li>`).join('')}
            </ul>
        </div>
    </div>
    
    `
}

//Event listeners
submitBtn.addEventListener('submit', searchMeal)
randomBtn.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info')
        } else {
            return false
        }

    })
    if (mealInfo) {
        const idMeal = mealInfo.attributes['data-mealID'].value
        // const idMeal = mealInfo.getAttribute('data-mealID')
        getMealById(idMeal)

    }
})