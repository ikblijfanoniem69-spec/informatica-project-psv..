// ===============================
// PSV WEBSITE NAVIGATIE
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    // Alle navigatielinks ophalen
    const navigationLinks = document.querySelectorAll(".nav-links a");

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const linkText = this.textContent.trim();

            // HOME
            if (linkText === "Home") {
                event.preventDefault();
                window.location.href = "index.html";
            }

            // SELECTIE
            if (linkText === "Selectie") {
                event.preventDefault();
                window.location.href = "selectie.html";
            }

            // STADION
            if (linkText === "Stadion") {
                event.preventDefault();
                window.location.href = "stadion.html";
            }

        });

    });


    // ===============================
    // NIEUWS DROPDOWN
    // ===============================

    const newsLinks = document.querySelectorAll(
        '.dropdown-menu a[href*="nieuws"]'
    );

    newsLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const linkText = this.textContent.trim();

            if (linkText === "Laatste nieuws") {
                event.preventDefault();
                window.location.href = "nieuws.html";
            }

            if (linkText === "Transfers") {
                event.preventDefault();
                window.location.href = "nieuws.html#transfers";
            }

            if (linkText === "Clubnieuws") {
                event.preventDefault();
                window.location.href = "nieuws.html#clubnieuws";
            }

        });

    });

});