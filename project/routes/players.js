var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");
const DButils = require("./utils/DButils");
let app = express();

router.get("/playerFullDetails/:playerID", async (req, res, next) => {
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
  try
  {
    let players_details = players_utils.getPlayersDetailsByName(req.params.playerName);
    
  }
  catch (error) {
    next(error);
  }
}
)

module.exports = router;