const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginButton = document.querySelector("#login-submit-btn");

function showToast(message, type) {
    document.querySelector(".custom-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = `custom-toast ${type}`;
    toast.setAttribute("role", "status");
    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}"></i>`;
    const text = document.createElement("span");
    text.className = "toast-message";
    text.textContent = message;
    const close = document.createElement("button");
    close.type = "button";
    close.className = "toast-close";
    close.setAttribute("aria-label", "Dismiss notification");
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    toast.append(icon, text, close);
    document.body.append(toast);
    window.requestAnimationFrame(() => toast.classList.add("show"));

    const dismiss = () => {
        toast.classList.remove("show");
        toast.classList.add("hide");
        window.setTimeout(() => toast.remove(), 250);
    };
    close.addEventListener("click", dismiss);
    window.setTimeout(dismiss, 3500);
}

document.querySelector("#toggle-login-password")?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const isVisible = loginPassword.type === "text";
    loginPassword.type = isVisible ? "password" : "text";
    button.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    button.querySelector("i").classList.toggle("fa-eye", isVisible);
    button.querySelector("i").classList.toggle("fa-eye-slash", !isVisible);
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;
    const emailError = document.querySelector("#login-email-error");
    const passwordError = document.querySelector("#login-password-error");
    emailError.textContent = "";
    passwordError.textContent = "";
    loginEmail.closest(".input-group").classList.remove("error");
    loginPassword.closest(".input-group").classList.remove("error");

    let isValid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = "Enter a valid email address.";
        loginEmail.closest(".input-group").classList.add("error");
        isValid = false;
    }
    if (!password) {
        passwordError.textContent = "Enter your password.";
        loginPassword.closest(".input-group").classList.add("error");
        isValid = false;
    }
    if (!isValid) return;

    const savedEmail = (localStorage.getItem("email") || "").trim().toLowerCase();
    const savedPassword = localStorage.getItem("passWord");
    if (email !== savedEmail || password !== savedPassword) {
        showToast("Those details don't match an account. Please try again.", "error");
        return;
    }

    loginButton.disabled = true;
    showToast("You're signed in. Welcome back.", "success");
    window.setTimeout(() => { window.location.href = "index.html"; }, 900);
});
