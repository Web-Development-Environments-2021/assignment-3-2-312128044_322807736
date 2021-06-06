var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");
const DButils = require("./utils/DButils");
let app = express();

router.get("/playerFullDetails/:playerID", async (req, res, next) => {
  // get player full details by ID
  try {

    const player_details = await players_utils.getPlayerDetailsByID(req.params.playerID);
    var dets =player_details.player_details.data;
    var teamName = await team_utils.getTeamNameByID(dets.team_id);
    
    var alldets =
    {
      "fullName" : dets.fullname,
      "teamName" : teamName,
      "imageUrl" : dets.image_path,
      "positionNum" : dets.position_id,
      "commonName" : dets.common_name,
      "nationality" : dets.nationality,
      "birthdate" : dets.birthdate,
      "birthCountry":dets.birthcountry,
      "height": dets.height,
      "weight": dets.weight,



    };
    res.send(alldets);
    

  } catch (error) {
    next(error);
  }
});

router.get("/playerFullDetails/search/:playerName", async (req, res, next) => {
  // get player full details of all player matching the name
  try
  {
    const players_details = await players_utils.getPlayersDetailsByName(req.params.playerName);
    const pd = players_details.data
    let player_arr = [];
    for(index in pd)
    {
      
        let player = pd[index];
        try{
          let lg_id = player.team.data.league.data.id;
          if(lg_id != 271)
            continue;
        }
        catch{
          continue;
        }
        
        player_arr.push(players_utils.extractFullData(player))

    }
    if(player_arr.length == 0) // if no players found
    {
      res.status(404).send("no matches found for query, please try a different name");
    }
    else
      res.send(player_arr);
  }
  catch (error) {
    next(error);
  }
}
)

module.exports = router;