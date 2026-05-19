const logo = document.querySelector(".logo")
const bar = document.querySelector(".bar")
const links = document.querySelector(".links")
const closeButton = document.querySelector(".close")
const cardsContainer = document.querySelector(".card-container")
const searchInput = document.querySelector(".search input")
// login user info
let topheaderLinks = document.querySelector(".top-header-links")
let userInfo = document.querySelector("#user")
let userName = document.querySelector("#user_info")

// clickable logo

logo.addEventListener("click", function() {
    window.location.reload();
});

if (localStorage.getItem("firstName")) {
    topheaderLinks.remove()
    userInfo.style.display = "block"
    userName.innerHTML = `welcome ` + localStorage.getItem("firstName")
}
//! Fetch data 

let dataArray = null;

fetch(`https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json`)
    .then((respond) => respond.json())
    .then((data) => {
        dataArray = data;
        displayCards(data)
    })
function displayCards(data) {
    if (!cardsContainer) return; 
    cardsContainer.innerHTML = " "
    data.map((e, index) => {

        cardsContainer.innerHTML += `
      <div class="card" data-index =${index}>
            <div class="image">
                <img src=${e.image}>
            </div> <!-- image -->
            <div class="content">
                <h2>${e.name}</h2>
                <p>${e.subCategory}</p>
            </div> <!-- content -->
               <div class="details">
                    <button class = "add-btn">More Details</button>
                </div> <!-- details -->
         </div> <!-- card -->
    `
    })
}
function search() {
    const query = searchInput.value.trim().toLowerCase();


    if (query === "") {
        cardsContainer.classList.remove("sorry")
        displayCards(dataArray)
        return;
    }

    // Filter products client-side (this API is a static JSON file)
    const filtered = dataArray.filter((e) =>
        e.name.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        e.subCategory.toLowerCase().includes(query) ||
        e.keywords.some(k => k.toLowerCase().includes(query))
    );

    if (filtered.length > 0) {
        cardsContainer.classList.remove("sorry")
        displayCards(filtered)
    } else {
        cardsContainer.innerHTML = "sorry not found"
        cardsContainer.classList.add("sorry")
    }
}
bar.addEventListener("click", () => {
    links.classList.add("open")
})

closeButton.addEventListener("click", () => {
    links.classList.remove("open")
})
searchInput.addEventListener("keydown", (e) => {
    if (e.key == 'Enter') {
        search()
    }
})
searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
        search()
    }
})

cardsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
        const card = e.target.closest(".card");
        const index = card.dataset.index;
        localStorage.setItem("selectedProduct", JSON.stringify(dataArray[index]));
        window.location = "product.html";
    }
});



