const registerForm = document.querySelector("#register-form");
const firstName = document.querySelector("#reg-first-name");
const lastName = document.querySelector("#reg-last-name");
const email = document.querySelector("#reg-email");
const password = document.querySelector("#reg-password");
const confirmPassword = document.querySelector("#reg-confirm-password");

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

function setPasswordVisibility(buttonId, input) {
    document.querySelector(buttonId)?.addEventListener("click", (event) => {
        const button = event.currentTarget;
        const isVisible = input.type === "text";
        input.type = isVisible ? "password" : "text";
        button.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
        button.querySelector("i").classList.toggle("fa-eye", isVisible);
        button.querySelector("i").classList.toggle("fa-eye-slash", !isVisible);
    });
}

setPasswordVisibility("#toggle-reg-password", password);
setPasswordVisibility("#toggle-reg-confirm", confirmPassword);

password.addEventListener("input", () => {
    const value = password.value;
    const strength = [
        value.length >= 8,
        /[A-Z]/.test(value) && /[a-z]/.test(value),
        /\d/.test(value),
        /[^A-Za-z0-9]/.test(value)
    ].filter(Boolean).length;
    const colors = ["#b34c3d", "#ba7937", "#79784e", "#4f7255"];
    const labels = ["Too short", "Fair", "Good", "Strong"];
    document.querySelectorAll(".strength-bar").forEach((bar, index) => {
        bar.style.background = index < strength ? colors[Math.max(0, strength - 1)] : "#e8e5de";
    });
    const strengthText = document.querySelector("#strength-text");
    strengthText.textContent = value ? labels[Math.max(0, strength - 1)] : "";
    strengthText.style.color = value ? colors[Math.max(0, strength - 1)] : "";
});

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [
        { input: firstName, error: document.querySelector("#reg-first-name-error"), message: "Enter your first name." },
        { input: lastName, error: document.querySelector("#reg-last-name-error"), message: "Enter your last name." },
        { input: email, error: document.querySelector("#reg-email-error"), message: "Enter a valid email address." },
        { input: password, error: document.querySelector("#reg-password-error"), message: "Use a password with at least 8 characters." },
        { input: confirmPassword, error: document.querySelector("#reg-confirm-password-error"), message: "Passwords must match." }
    ];
    let isValid = true;
    fields.forEach(({ input, error }) => {
        error.textContent = "";
        input.closest(".input-group").classList.remove("error");
    });

    const setError = (input, error, message) => {
        error.textContent = message;
        input.closest(".input-group").classList.add("error");
        isValid = false;
    };
    if (!firstName.value.trim()) setError(firstName, fields[0].error, fields[0].message);
    if (!lastName.value.trim()) setError(lastName, fields[1].error, fields[1].message);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) setError(email, fields[2].error, fields[2].message);
    if (password.value.length < 8) setError(password, fields[3].error, fields[3].message);
    if (!confirmPassword.value || confirmPassword.value !== password.value) {
        setError(confirmPassword, fields[4].error, fields[4].message);
    }
    if (!isValid) return;

    localStorage.setItem("firstName", firstName.value.trim());
    localStorage.setItem("lastName", lastName.value.trim());
    localStorage.setItem("email", email.value.trim());
    localStorage.setItem("passWord", password.value);
    showToast("Your account is ready. Sign in to continue.", "success");
    window.setTimeout(() => { window.location.href = "login.html"; }, 900);
});
