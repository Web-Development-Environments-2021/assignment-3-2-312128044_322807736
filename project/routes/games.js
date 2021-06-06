var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("./utils/DButils");
const game_utils = require("./utils/game_utils");


router.get("/gamesOfTheStage", async (req, res, next) => {
    // fetch future games and past games with cross refrencing of ids to names
    const futureGamesOfTheStage = await DButils.execQuery(
      "SELECT g.game_id,g.home_team_id ,g.away_team_id,g.game_date,g.stage, "+
      "r.name as referee ,f.name as field " +
      "from games as g "+
      "inner join referees as r on r.referee_id = g.refereeId "+
      "inner join [dbo].[Fields] as f on f.field_id = g.fieldId "+
      "where CAST(GETDATE() AS DATE )<=game_date and stage = 'playoff' "
      );
    const pastGamesOfTheStage = await DButils.execQuery(
        "SELECT g.game_id,g.home_team_id,g.away_team_id,g.game_date, g.h_score,g.a_score, g.eventLogId ,g.stage,"+
        "r.name as referee ,f.name as field "+
        "from games as g "+
        "inner join referees as r on r.referee_id = g.refereeId "+
        "inner join [dbo].[Fields] as f on f.field_id = g.fieldId "+
        "where CAST( GETDATE() AS DATE )>game_date and stage = 'playoff'"  
    );

    const EventLogs = await DButils.execQuery(
      "SELECT * from Events ;"
    );
    // add events to pastGames
    game_utils.addEvents(pastGamesOfTheStage,EventLogs);
    res.send({"pastGames": pastGamesOfTheStage,
                "futureGames": futureGamesOfTheStage });
  
      next();
    });

module.exports = router;
