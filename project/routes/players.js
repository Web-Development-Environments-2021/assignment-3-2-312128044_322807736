var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const DButils = require("./utils/DButils");
let app = express();

router.get("/playerFullDetails/:playerID", async (req, res, next) => {
  try {
    
    const player_details = await players_utils.getPlayerDetailsByID(req.params.playerID);
    console.log(req.params.playerID);
    res.status(200).send(player_details);
    
    //   const player_details = await players_utils.getPlayersByTeam(playerId);
    //   res.send(player_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
