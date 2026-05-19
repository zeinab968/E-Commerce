let signEmail = document.querySelector("#login-email")
let signPass = document.querySelector("#login-password")
let signBtn = document.querySelector("#login-submit-btn")

 getEmail =  localStorage.getItem("email")
 getPass =  localStorage.getItem("passWord")

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
 signBtn.addEventListener("click" , function(e){
    e.preventDefault();

     if (signEmail.value === ""|| signPass.value === "" ){
            showToast("Please check your data again", "error")
        }
    else{
        if ((getEmail && getEmail.trim() === signEmail.value && getPass && getPass.trim()=== signPass.value)){
        showToast("Welcome to our website !", "success")
            setTimeout(()=>{
                window.location = "index.html"
            },1500)
    }
   
}

     
 })

