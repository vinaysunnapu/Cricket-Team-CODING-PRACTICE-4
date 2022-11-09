const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running al localhost:3000");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};
module.exports = app;

initializeDBAndServer();

//API1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM cricket_team ORDER BY player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//API2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
   INSERT INTO 
   cricket_team( playerName, jerseyNumber, role)
   VALUES(
       
      '${playerName}',
       ${jersyNumber},
       '${role}'
   );
  `;
  const dbResponse = await db.run(addPlayerQuery);
  const playerId = dbResponse.lastID;
  response.send({ player_id: playerId });
});
