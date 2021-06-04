var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("./utils/DButils");


router.get("/gamesOfTheSeason", async (req, res, next) => {

    const futureGames = await DButils.execQuery(
        "SELECT * from games where CAST( GETDATE() AS DATE )<=game_date ;"
      );
    const pastGames = await DButils.execQuery(
        "SELECT * from games where CAST( GETDATE() AS DATE )>game_date ;"
      );

      res.send({"pastGames": pastGames,
                "futureGames": futureGames });
  
      next();
    });

module.exports = router;
