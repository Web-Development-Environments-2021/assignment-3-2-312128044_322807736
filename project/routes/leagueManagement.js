var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const game_utils = require("./utils/game_utils");


router.get("/", async (req, res, next) => {
  // game info for homepage as described in the league_utils
  const futureGames = await DButils.execQuery(
    "SELECT g.game_id,g.home_team_id ,g.away_team_id,g.game_date, g.stage,"+
    "r.name as referee ,f.name as field " +
    "from games as g "+
    "inner join referees as r on r.referee_id = g.refereeId "+
    "inner join [dbo].[Fields] as f on f.field_id = g.fieldId "+
    "where CAST(GETDATE() AS DATE )<=game_date"
    );
  const pastGames = await DButils.execQuery(
      "SELECT g.game_id,g.home_team_id,g.away_team_id,g.game_date, g.h_score,g.a_score, g.eventLogId ,g.stage,"+
      "r.name as referee ,f.name as field "+
      "from games as g "+
      "inner join referees as r on r.referee_id = g.refereeId "+
      "inner join [dbo].[Fields] as f on f.field_id = g.fieldId "+
      "where CAST( GETDATE() AS DATE )>game_date"  
  );
  const EventLogs = await DButils.execQuery(
    "SELECT * from Events ;"
  );
  game_utils.addEvents(pastGames,EventLogs);
  
    res.send({"pastGames": pastGames,
              "futureGames": futureGames });

    next();
  });

router.use("/addGame",async function (req, res, next) {
  // add game to league
    if (req.session && req.session.user_id) {
      DButils.execQuery("SELECT user_id FROM Users where title = 'FAR' ")// check that logged in user is Football Association Represntitive
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) {
            req.user_id = req.session.user_id;
            next();
          }
          else
          {
            res.status(401).send("only representative can add games")
          }
        })
        .catch((err) => next(err));
    } else {
      res.sendStatus(401);
    }
  });
  
  
router.post("/addGame", async (req, res, next) => {
    try {
    // parameters exists
    // valid parameters
    // game exists
    const games = await DButils.execQuery(
        "SELECT home_team_id, away_team_id,game_date FROM dbo.Games"
    );
     
      if (games.find((x) => x.home_team_id === req.body.home_team_id && 
          x.away_team_id === req.body.away_team_id &&
          x.game_date === req.body.game_date ))
        throw { status: 409, message: "game already exists" };
    
      let valid = await game_utils.checkValid(req);
      if(!valid)
      {
        res.status(400).send("invalid game details, please check the API");
      }
      // add the new game
      else{
        await DButils.execQuery(
          `Insert into dbo.Games(home_team_id,away_team_id, game_date, fieldId, refereeId,stage)
            VALUES ('${req.body.home_team_id}', '${req.body.away_team_id}', '${req.body.game_date}','${req.body.fieldId}','${req.body.refereeId}','${req.body.stage}')`
        );
        res.status(201).send("game added successfully");
      }
      
    } catch (error) {
      next(error);
    }
});

module.exports = router;
  