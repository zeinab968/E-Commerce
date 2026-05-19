let addedItemDiv = document.querySelector(".added-items")
let cart = document.querySelector(".fa-cart-shopping")
let productDetails = document.querySelector(".details-container");
let chosenItem = JSON.parse(localStorage.getItem("selectedProduct"));
const cartBadge = document.querySelector(".cart span");

function showProduct() {

  if (!chosenItem) return;

  productDetails.innerHTML = `
    <div class="card">

      <div class="image">
        <img src="${chosenItem.image}">
      </div>
      <div class="product-details">
        <h2>${chosenItem.name}</h2>

        <p>${chosenItem.description}</p>

        <p class="price">
          Price: $${(chosenItem.priceCents / 100).toFixed(2)}
        </p>

        <button class="cart-btn">Add to Cart</button>
      </div>

    </div>
  `;
}

showProduct();
let cartBtn = document.querySelector(".cart-btn");

function toggleAddedItems() {

    if (addedItemDiv.innerHTML.trim() === "") {
        addedItemDiv.innerHTML = `
           <div class="imag">
                <img src="${chosenItem.image}" alt="">
            </div>
            <div class="right-content">
                <p class="minus-btn"><i class="fa-solid fa-minus"></i></p>
                <input type="number" placeholder="count" value="0">
                <p class="plus-btn"><i class="fa-solid fa-plus"></i></p>
            </div>
        `;

    }
    if (addedItemDiv.style.display === "flex") {
        addedItemDiv.style.display = "none";
    } else {
        addedItemDiv.style.display = "flex";
    }
             localStorage.setItem("addedItems", JSON.stringify(addedItemDiv))
}
cartBtn.addEventListener("click", toggleAddedItems);
cart.addEventListener("click", toggleAddedItems);

let count = 0; 
addedItemDiv.addEventListener("click", function(event){
  
    let countInput = addedItemDiv.querySelector("input");

    if (event.target.closest(".plus-btn")) {
      
        count++;
        countInput.value = count; 
        cartBadge.innerHTML = countInput.value;
    }

    if (event.target.closest(".minus-btn")) {
        if (count > 0) { 
            count--;
            countInput.value = count;
            cartBadge.innerHTML = `${countInput.value}`;
        }
    }
});



