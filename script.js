document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById("burgerToggle");
    const homeMenu = document.querySelector(".HOME");

    burger.addEventListener("change", () => {
        if (burger.checked) {
            homeMenu.style.display = "flex";
        } else {
            homeMenu.style.display = "none";
        }
    });
});
