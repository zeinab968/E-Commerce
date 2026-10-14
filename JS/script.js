const menuButton = document.querySelector(".bar");
const menu = document.querySelector(".links");
const closeButton = document.querySelector(".close");
const cartButton = document.querySelector(".cart");
const cartPanel = document.querySelector(".added-items");
const cartBadge = document.querySelector(".cart > span:not(.cart-label)");
const cardsContainer = document.querySelector(".card-container");
const categoryFilters = document.querySelector(".category-filters");
const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");
const cartStorageKey = "emanStoreCart";

const productName = (product) => String(product.name || "Untitled item");
const productCategory = (product) => String(product.category || product.subCategory || "Collection");
const productPrice = (product) => {
    const cents = Number(product.priceCents);
    return Number.isFinite(cents) ? cents / 100 : Number(product.price) || 0;
};

if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
        menu.classList.add("open");
        menuButton.setAttribute("aria-expanded", "true");
    });
}

if (closeButton && menu) {
    closeButton.addEventListener("click", () => {
        menu.classList.remove("open");
        menuButton?.setAttribute("aria-expanded", "false");
    });
}

const storedFirstName = localStorage.getItem("firstName");
const topHeaderLinks = document.querySelector(".top-header-links");
const userInfo = document.querySelector("#user");
const userName = document.querySelector("#user_info");
if (storedFirstName && topHeaderLinks && userInfo && userName) {
    topHeaderLinks.remove();
    userInfo.style.display = "block";
    userName.textContent = `Welcome, ${storedFirstName}`;
}

function readCart() {
    const storedCart = localStorage.getItem(cartStorageKey);
    if (!storedCart) return [];

    try {
        const cart = JSON.parse(storedCart);
        if (!Array.isArray(cart)) throw new TypeError("Saved cart must be a list.");
        return cart.filter((item) => item && item.product && Number.isInteger(item.quantity) && item.quantity > 0);
    } catch (error) {
        console.error("Unable to read the saved shopping bag.", error);
        return [];
    }
}

let cartItems = readCart();

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    renderCart();
}

function renderCart() {
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    if (cartBadge) cartBadge.textContent = String(itemCount);
    if (!cartPanel) return;

    cartPanel.replaceChildren();
    if (cartItems.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Your bag is waiting for something lovely.";
        cartPanel.append(emptyMessage);
        return;
    }

    let totalPrice = 0;
    cartItems.forEach((item, index) => {
        const price = productPrice(item.product);
        totalPrice += price * item.quantity;

        const line = document.createElement("div");
        line.className = "cart-line";
        const image = document.createElement("img");
        image.src = item.product.image || "";
        image.alt = productName(item.product);

        const details = document.createElement("div");
        const name = document.createElement("h3");
        name.textContent = productName(item.product);
        const subtotal = document.createElement("p");
        subtotal.textContent = `$${(price * item.quantity).toFixed(2)}`;
        details.append(name, subtotal);

        const controls = document.createElement("div");
        controls.className = "cart-quantity";
        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", `Remove one ${productName(item.product)}`);
        decrease.dataset.cartAction = "decrease";
        decrease.dataset.cartIndex = String(index);
        const quantity = document.createElement("span");
        quantity.textContent = String(item.quantity);
        const increase = document.createElement("button");
        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", `Add one ${productName(item.product)}`);
        increase.dataset.cartAction = "increase";
        increase.dataset.cartIndex = String(index);
        controls.append(decrease, quantity, increase);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "cart-remove";
        remove.textContent = "Remove";
        remove.dataset.cartAction = "remove";
        remove.dataset.cartIndex = String(index);

        line.append(image, details, controls);
        cartPanel.append(line, remove);
    });

    const total = document.createElement("div");
    total.className = "cart-total";
    const totalLabel = document.createElement("span");
    totalLabel.textContent = "Subtotal";
    const totalValue = document.createElement("span");
    totalValue.textContent = `$${totalPrice.toFixed(2)}`;
    total.append(totalLabel, totalValue);
    cartPanel.append(total);
}

renderCart();

if (cartButton && cartPanel) {
    cartButton.addEventListener("click", () => {
        const isOpen = cartPanel.classList.toggle("open");
        cartButton.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".cart, .added-items")) {
            cartPanel.classList.remove("open");
            cartButton.setAttribute("aria-expanded", "false");
        }
    });

    cartPanel.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-cart-action]");
        if (!actionButton) return;
        const index = Number(actionButton.dataset.cartIndex);
        const item = cartItems[index];
        if (!item) return;

        if (actionButton.dataset.cartAction === "increase") item.quantity += 1;
        if (actionButton.dataset.cartAction === "decrease") item.quantity -= 1;
        if (actionButton.dataset.cartAction === "remove" || item.quantity < 1) cartItems.splice(index, 1);
        saveCart();
    });
}

document.addEventListener("eman:add-to-cart", (event) => {
    const product = event.detail;
    if (!product) return;
    const matchingItem = cartItems.find((item) => productName(item.product) === productName(product));
    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cartItems.push({ product, quantity: 1 });
    }
    saveCart();
    if (cartPanel && cartButton) {
        cartPanel.classList.add("open");
        cartButton.setAttribute("aria-expanded", "true");
    }
});

if (cardsContainer) {
    let allProducts = [];
    let selectedCategory = "All";
    if (searchInput) {
        searchInput.value = new URLSearchParams(window.location.search).get("search") || "";
    }

    function renderCards(products) {
        cardsContainer.replaceChildren();
        if (products.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "sorry";
            emptyMessage.textContent = "No pieces found. Try another search or category.";
            cardsContainer.append(emptyMessage);
            return;
        }

        products.forEach((product) => {
            const card = document.createElement("article");
            card.className = "card";
            const imageWrap = document.createElement("div");
            imageWrap.className = "image";
            const image = document.createElement("img");
            image.src = product.image || "";
            image.alt = productName(product);
            image.loading = "lazy";
            imageWrap.append(image);

            const content = document.createElement("div");
            content.className = "content";
            const name = document.createElement("h2");
            name.textContent = productName(product);
            const category = document.createElement("p");
            category.textContent = String(product.subCategory || product.category || "EmanStore collection");
            const price = document.createElement("p");
            price.className = "product-price";
            price.textContent = `$${productPrice(product).toFixed(2)}`;
            content.append(name, category, price);

            const details = document.createElement("div");
            details.className = "details";
            const button = document.createElement("button");
            button.type = "button";
            button.className = "add-btn";
            button.textContent = "View details";
            button.dataset.productIndex = String(allProducts.indexOf(product));
            details.append(button);
            card.append(imageWrap, content, details);
            cardsContainer.append(card);
        });
    }

    function getFilteredProducts() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        return allProducts.filter((product) => {
            const searchableText = [
                productName(product),
                product.category,
                product.subCategory,
                ...(Array.isArray(product.keywords) ? product.keywords : [])
            ].join(" ").toLowerCase();
            const matchesSearch = !query || searchableText.includes(query);
            const matchesCategory = selectedCategory === "All" || productCategory(product) === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }

    function updateProducts() {
        renderCards(getFilteredProducts());
    }

    function renderCategoryFilters() {
        if (!categoryFilters) return;
        const categories = [...new Set(allProducts.map(productCategory))].sort((a, b) => a.localeCompare(b));
        categoryFilters.replaceChildren();
        ["All", ...categories].forEach((category) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `category-filter${category === selectedCategory ? " active" : ""}`;
            button.textContent = category === "All" ? "All pieces" : category;
            button.addEventListener("click", () => {
                selectedCategory = category;
                renderCategoryFilters();
                updateProducts();
            });
            categoryFilters.append(button);
        });
    }

    fetch("https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json")
        .then((response) => {
            if (!response.ok) throw new Error(`Product catalogue request failed (${response.status}).`);
            return response.json();
        })
        .then((products) => {
            if (!Array.isArray(products)) throw new TypeError("The product catalogue has an unexpected format.");
            allProducts = products;
            renderCategoryFilters();
            updateProducts();
        })
        .catch((error) => {
            console.error("Unable to load the product catalogue.", error);
            const errorMessage = document.createElement("p");
            errorMessage.className = "error-message";
            errorMessage.textContent = "We couldn't load the collection right now. Please refresh to try again.";
            cardsContainer.replaceChildren(errorMessage);
        });

    if (searchButton && searchInput) searchButton.addEventListener("click", updateProducts);
    if (searchInput) {
        searchInput.addEventListener("input", updateProducts);
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") updateProducts();
        });
    }

    cardsContainer.addEventListener("click", (event) => {
        const button = event.target.closest(".add-btn");
        if (!button) return;
        const selectedProduct = allProducts[Number(button.dataset.productIndex)];
        if (!selectedProduct) return;
        localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
        window.location.href = "product.html";
    });
} else if (searchInput && searchButton) {
    const searchCatalog = () => {
        window.location.href = `index.html?search=${encodeURIComponent(searchInput.value.trim())}#products`;
    };
    searchButton.addEventListener("click", searchCatalog);
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") searchCatalog();
    });
}
