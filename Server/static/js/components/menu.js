// Control main menu (mobile)
const menuMainBtn = document.getElementById("menu-hamburger");
const menuMainContainer = document.getElementById("app-container-menu");
const menuHamburger = document.getElementById("hamburger")
console.log(menuHamburger)
// Toggle menu by icon click
menuMainBtn.addEventListener("click", function () {
  menuHamburger.classList.toggle("active-hamburger");
  menuMainContainer.classList.toggle("app-menu-open");
  // Detect outside click
  document.addEventListener("click", function clickOutsideMenu(event) {
    let clickMenuContainer = menuMainContainer.contains(event.target);
    let clickMenuBtn = menuMainBtn.contains(event.target);
    if (
      !clickMenuContainer &&
      !clickMenuBtn &&
      menuMainContainer.classList.contains("app-menu-open")
    ) {
      // Close menu
      menuMainBtn.classList.toggle("btn-active");
      menuMainBtn.setAttribute(
        "aria-expanded",
        menuMainBtn.classList.contains("btn-active")
      );
      menuMainContainer.classList.toggle("menu-settings-open");
      document.removeEventListener("click", clickOutsideMenu);
    }
  });
});