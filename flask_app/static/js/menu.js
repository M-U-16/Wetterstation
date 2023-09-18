// Control main menu (mobile)
const menuMainBtn = document.getElementById("menu-hamburger");
const menuMainContainer = document.getElementById("container-menu-settings");
// Toggle menu by icon click
menuMainBtn.addEventListener("click", function () {
  this.classList.toggle("btn-active");
  this.setAttribute("aria-expanded", this.classList.contains("btn-active"));
  menuMainContainer.classList.toggle("menu-settings-open");
  // Detect outside click
  document.addEventListener("click", function clickOutsideMenu(event) {
    let clickMenuContainer = menuMainContainer.contains(event.target);
    let clickMenuBtn = menuMainBtn.contains(event.target);
    if (
      !clickMenuContainer &&
      !clickMenuBtn &&
      menuMainContainer.classList.contains("menu-settings-open")
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