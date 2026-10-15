// ===============================
// PSV WEBSITE NAVIGATIE
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const standingsTable = document.querySelector("#standings-table");
    const standingsStatus = document.querySelector("#stand-update-status");

    const matchDate = document.querySelector("#match-date");
    const matchStatus = document.querySelector("#match-update-status");

    if (matchDate && matchStatus) {
        fetch("match.json?updated=" + Date.now(), { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Wedstrijdinformatie kon niet worden geladen.");
                }

                return response.json();
            })
            .then(function (data) {
                if (!data.match) {
                    matchDate.textContent = "Nog geen wedstrijd bekend";
                    matchStatus.textContent = "Er is geen aankomende Eredivisie-wedstrijd van PSV gevonden.";
                    return;
                }

                const match = data.match;
                const homeTeamName = document.querySelector("#home-team-name");
                const awayTeamName = document.querySelector("#away-team-name");
                const homeTeamLogo = document.querySelector("#home-team-logo");
                const awayTeamLogo = document.querySelector("#away-team-logo");
                const homeTeamLocation = document.querySelector("#home-team-location");
                const awayTeamLocation = document.querySelector("#away-team-location");
                const venue = document.querySelector("#match-venue");

                homeTeamName.textContent = match.homeTeam.name;
                awayTeamName.textContent = match.awayTeam.name;
                homeTeamLogo.textContent = match.homeTeam.tla;
                awayTeamLogo.textContent = match.awayTeam.tla;
                homeTeamLogo.classList.toggle("psv-logo", match.homeTeam.tla === "PSV");
                homeTeamLogo.classList.toggle("ajax-logo", match.homeTeam.tla !== "PSV");
                awayTeamLogo.classList.toggle("psv-logo", match.awayTeam.tla === "PSV");
                awayTeamLogo.classList.toggle("ajax-logo", match.awayTeam.tla !== "PSV");
                homeTeamLocation.textContent = match.homeTeam.tla === "PSV" ? "THUIS" : "UIT";
                awayTeamLocation.textContent = match.awayTeam.tla === "PSV" ? "THUIS" : "UIT";
                venue.textContent = "🏟️ " + (match.venue || "Locatie nog niet bekend");
                matchDate.textContent = new Intl.DateTimeFormat("nl-NL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Amsterdam"
                }).format(new Date(match.utcDate));
                matchStatus.textContent = "Laatst bijgewerkt: " +
                    new Intl.DateTimeFormat("nl-NL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Europe/Amsterdam"
                    }).format(new Date(data.updatedAt)) +
                    " • wordt automatisch elke 6 uur vernieuwd.";
            })
            .catch(function (error) {
                matchDate.textContent = "Wedstrijdinformatie niet beschikbaar";
                matchStatus.textContent = error.message;
            });
    }

    if (standingsTable && standingsStatus) {
        fetch("stand.json?updated=" + Date.now(), { cache: "no-store" })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Stand kon niet worden geladen.");
                }

                return response.json();
            })
            .then(function (data) {
                if (!Array.isArray(data.standings) || data.standings.length === 0) {
                    throw new Error("Er is nog geen stand beschikbaar.");
                }

                standingsTable.replaceChildren();

                data.standings.forEach(function (team) {
                    const row = document.createElement("tr");
                    const isPsv = team.tla === "PSV" ||
                        team.shortName === "PSV" ||
                        team.name === "PSV Eindhoven";

                    if (isPsv) {
                        row.classList.add("psv-row");
                    }

                    [team.position, team.shortName || team.name, team.playedGames, team.points]
                        .forEach(function (value) {
                            const cell = document.createElement("td");
                            cell.textContent = value;
                            row.appendChild(cell);
                        });

                    standingsTable.appendChild(row);
                });

                const updatedAt = new Date(data.updatedAt);
                standingsStatus.textContent = "Laatst bijgewerkt: " +
                    new Intl.DateTimeFormat("nl-NL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Europe/Amsterdam"
                    }).format(updatedAt) +
                    " • wordt automatisch elke 6 uur vernieuwd.";
            })
            .catch(function (error) {
                standingsTable.replaceChildren();
                const row = document.createElement("tr");
                const cell = document.createElement("td");
                cell.colSpan = 4;
                cell.textContent = "De stand is tijdelijk niet beschikbaar.";
                row.appendChild(cell);
                standingsTable.appendChild(row);
                standingsStatus.textContent = error.message;
            });
    }

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