var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  // returns full details of a team by ID
  let team_details = [];
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    const name = team_details.player_details[0].team_name;
    
    var full_details = 
    {
      "name": name,
      "players":team_details.player_details,
      "teamLogo": team_details.teamLogo
    };
    res.send(full_details);
  } catch (error) {
    next(error);
  }
});

router.get("/teamFullDetails/search/:teamName", async (req, res, next) => {
  // returns the most relevant team with matching name
  let team_details = [];

  try {
    const team_ids = await team_utils.getTeamIDByName(req.params.teamName);
    if(team_ids == -1)
    {
      res.status(404).send("no results match your query, try typing in different name or partial name");
    }
    else
    {
      const team_details = await team_utils.getTeamsInfo(team_ids);
      const name = team_details.player_details[0].team_name;
      let full_dets = 
      {
        "name": name,
        "players":team_details.player_details,
        "teamLogo": team_details.teamLogo
      }
      res.send(full_dets);
    }
    
  } catch (error) {
    next(error);
  }
});



module.exports = router;
