var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DButils = require("./utils/DButils");

router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    if(league_details === null){
      res.send(404, "Please try another time, there is no league in the time being.");
    }
    else{
      res.send(league_details);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
