// Control main menu (mobile)
const menuMainBtn = document.getElementById("menu-hamburger");
const menuMainContainer = document.getElementById("app-container-menu");
const menuHamburger = document.getElementById("hamburger")
console.log(menuHamburger)
// Toggle menu by icon click
menuMainBtn.addEventListener("click", function () {
  menuHamburger.classList.toggle("active-hamburger");
  menuMainContainer.classList.toggle("app-open-menu");
  // Detect outside click
});
document.addEventListener("click", function clickOutsideMenu(event) {
  let clickMenuContainer = menuMainContainer.contains(event.target);
  let clickMenuBtn = menuMainBtn.contains(event.target);
  if (
    !clickMenuContainer &&
    !clickMenuBtn &&
    menuMainContainer.classList.contains("app-open-menu")
  ) {
    // Close menu
    menuMainContainer.classList.toggle("app-open-menu");
    document.removeEventListener("click", clickOutsideMenu);
  }
});