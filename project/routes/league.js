var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("./utils/DButils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});


router.use("/addGame",async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM Users where title = 'FAR' ")
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
    const next_id =await DButils.execQuery(
      "SELECT COUNT(home_team_id) as c FROM dbo.Games"
    );
    if (games.find((x) => x.home_team_id === req.body.home_team_id && 
        x.away_team_id === req.body.away_team_id &&
        x.game_date === req.body.game_date ))
      throw { status: 409, message: "game already exists" };
  
    
    // add the new username
    await DButils.execQuery(
      `Insert into dbo.Games(game_id,home_team_id,away_team_id, game_date, field, referee_id)
        VALUES ('${ next_id[0]['c']+1}','${req.body.home_team_id}', '${req.body.away_team_id}', '${req.body.game_date}','${req.body.fieldId}','${req.body.coachId}')`
    );
    res.status(201).send("game added successfully");
  } catch (error) {
    next(error);
  }
});


module.exports = router;
