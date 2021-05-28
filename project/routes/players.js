var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
let app = express();

app.get(`*`, async (req, res, next) => {
  try {
    console.log("im here");
    console.log(req.playerId);
    res.send(req.query);
    //   const player_details = await players_utils.getPlayersByTeam(playerId);
    //   res.send(player_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
