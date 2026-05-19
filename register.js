let firstName = document.querySelector("#reg-first-name")
let lastName = document.querySelector("#reg-last-name")
let email = document.querySelector("#reg-email")
let passWord = document.querySelector("#reg-password")
let confirmPass = document.querySelector("#reg-confirm-password")
// icon to show or hide password
let showPassIcon = document.querySelector(".fa-eye")
// register btn
let creatBtn = document.querySelector("#register-submit-btn")

// Custom toast notification function
function showToast(message, type) {
    // Remove any existing toast
    let oldToast = document.querySelector(".custom-toast")
    if (oldToast) oldToast.remove()

    // Create toast element
    let toast = document.createElement("div")
    toast.className = `custom-toast ${type}`

    // Pick icon based on type
    let icon = type === "success" ? "fa-circle-check" : "fa-circle-exclamation"

    toast.innerHTML = `
        <span class="toast-icon"><i class="fa-solid ${icon}"></i></span>
        <span class="toast-message">${message}</span>
        <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
        <div class="toast-progress"></div>
    `

    document.body.appendChild(toast)

    // Show with animation (small delay so transition triggers)
    setTimeout(() => toast.classList.add("show"), 10)

    // Close button
    toast.querySelector(".toast-close").addEventListener("click", () => {
        toast.classList.remove("show")
        toast.classList.add("hide")
        setTimeout(() => toast.remove(), 400)
    })

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show")
        toast.classList.add("hide")
        setTimeout(() => toast.remove(), 400)
    }, 3000)
}


creatBtn.addEventListener("click", function(e){
    e.preventDefault()
    if (firstName.value === ""|| lastName.value === "" ||
         email.value === "" ||passWord.value === "" || passWord.value !== confirmPass.value ){
            showToast("Please check your data again", "error")
        }
        else{
            localStorage.setItem("firstName", firstName.value)
            localStorage.setItem("lastName" , lastName.value)
            localStorage.setItem("email" , email.value)
            localStorage.setItem("passWord" ,passWord.value)
            localStorage.setItem("confirmPass" , confirmPass.value)

            showToast("Account created successfully!", "success")

            setTimeout(()=>{
                window.location = "login.html"
            },1500)
        }
 
})
