import { writeFile } from "node:fs/promises";

const token = process.env.FOOTBALL_DATA_API_KEY;

if (!token) {
    throw new Error("The existing FOOTBAL_DATA_API_KEY repository secret is not configured.");
}

const response = await fetch(
    "https://api.football-data.org/v4/competitions/DED/standings",
    { headers: { "X-Auth-Token": token } }
);

if (!response.ok) {
    throw new Error(`Football-data API returned HTTP ${response.status}.`);
}

const result = await response.json();
const totalStanding = result.standings?.find((standing) => standing.type === "TOTAL");
const table = totalStanding?.table;

if (!Array.isArray(table) || table.length === 0) {
    throw new Error("The API response did not contain an Eredivisie table.");
}

const standings = table.map((entry) => {
    if (
        !Number.isInteger(entry.position) ||
        !entry.team?.name ||
        !Number.isInteger(entry.playedGames) ||
        !Number.isInteger(entry.points)
    ) {
        throw new Error("The API response contains an invalid standings entry.");
    }

    return {
        position: entry.position,
        name: entry.team.name,
        shortName: entry.team.shortName || entry.team.name,
        tla: entry.team.tla || null,
        playedGames: entry.playedGames,
        points: entry.points
    };
});

const database = {
    competition: result.competition?.name || "Eredivisie",
    season: result.season?.startDate?.slice(0, 4) || null,
    updatedAt: new Date().toISOString(),
    standings
};

await writeFile(
    new URL("../stand.json", import.meta.url),
    `${JSON.stringify(database, null, 2)}\n`
);
