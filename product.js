const productDetails = document.querySelector(".details-container");
const chosenItem = JSON.parse(localStorage.getItem("selectedProduct") || "null");

function formatProductPrice(product) {
    const cents = Number(product.priceCents);
    const amount = Number.isFinite(cents) ? cents / 100 : Number(product.price) || 0;
    return `$${amount.toFixed(2)}`;
}

function showProduct() {
    if (!productDetails) return;
    if (!chosenItem) {
        productDetails.innerHTML = `
            <div class="product-not-found">
                <h2>Nothing in view just yet.</h2>
                <p>Head back to the collection to find something you love.</p>
                <a href="index.html#products">Browse the collection</a>
            </div>
        `;
        return;
    }

    const card = document.createElement("article");
    card.className = "product-card";
    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image";
    const image = document.createElement("img");
    image.src = chosenItem.image || "";
    image.alt = String(chosenItem.name || "Selected product");
    imageWrap.append(image);

    const details = document.createElement("div");
    details.className = "product-details";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = String(chosenItem.subCategory || chosenItem.category || "EmanStore collection");
    const name = document.createElement("h2");
    name.textContent = String(chosenItem.name || "A thoughtful find");
    const description = document.createElement("p");
    description.className = "description";
    description.textContent = String(chosenItem.description || "A considered addition to your everyday collection.");
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatProductPrice(chosenItem);
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "cart-btn";
    addButton.textContent = "Add to bag";
    addButton.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("eman:add-to-cart", { detail: chosenItem }));
        addButton.textContent = "Added to bag";
        window.setTimeout(() => { addButton.textContent = "Add to bag"; }, 1600);
    });

    const benefits = document.createElement("div");
    benefits.className = "product-benefits";
    benefits.innerHTML = `
        <span><i class="fa-solid fa-box"></i> Carefully packed for you</span>
        <span><i class="fa-solid fa-arrow-rotate-left"></i> Easy returns</span>
    `;
    details.append(eyebrow, name, description, price, addButton, benefits);
    card.append(imageWrap, details);
    productDetails.replaceChildren(card);
}

showProduct();
