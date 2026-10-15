import { writeFile } from "node:fs/promises";

const token = process.env.FOOTBALL_DATA_API_KEY;

if (!token) {
    throw new Error("The existing FOOTBAL_DATA_API_KEY repository secret is not configured.");
}

const response = await fetch(
    "https://api.football-data.org/v4/competitions/DED/matches",
    { headers: { "X-Auth-Token": token } }
);

if (!response.ok) {
    throw new Error(`Football-data API returned HTTP ${response.status}.`);
}

const result = await response.json();

if (!Array.isArray(result.matches)) {
    throw new Error("The API response did not contain Eredivisie matches.");
}

const now = Date.now();
const match = result.matches
    .filter((entry) =>
        ["SCHEDULED", "TIMED"].includes(entry.status) &&
        new Date(entry.utcDate).getTime() > now &&
        (entry.homeTeam?.tla === "PSV" || entry.awayTeam?.tla === "PSV")
    )
    .sort((first, second) => new Date(first.utcDate) - new Date(second.utcDate))
    .map((entry) => {
        if (
            !entry.utcDate ||
            !entry.homeTeam?.name ||
            !entry.homeTeam?.tla ||
            !entry.awayTeam?.name ||
            !entry.awayTeam?.tla
        ) {
            throw new Error("The next PSV match contains incomplete team or date information.");
        }

        return {
            utcDate: entry.utcDate,
            homeTeam: {
                name: entry.homeTeam.shortName || entry.homeTeam.name,
                tla: entry.homeTeam.tla
            },
            awayTeam: {
                name: entry.awayTeam.shortName || entry.awayTeam.name,
                tla: entry.awayTeam.tla
            },
            venue: entry.venue || null
        };
    })[0] || null;

const database = {
    competition: result.competition?.name || "Eredivisie",
    season: result.filters?.season || null,
    updatedAt: new Date().toISOString(),
    match
};

await writeFile(
    new URL("../match.json", import.meta.url),
    `${JSON.stringify(database, null, 2)}\n`
);
