var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/teamFullDetails/:teamId", async(req, res, next) => {
    // returns full details of a team by ID
    let team_details = [];
    try {
        const team_details = await players_utils.getPlayersByTeam(
            req.params.teamId
        );
        const name = team_details.player_details[0].team_name;

        var full_details = {
            "name": name,
            "players": team_details.player_details,
            "teamLogo": team_details.teamLogo
        };
        res.send(full_details);
    } catch (error) {
        next(error);
    }
});

router.get("/teamFullDetails/search/:teamName", async(req, res, next) => {
    // returns the most relevant team with matching name
    let team_details = [];

    try {
        const team_ids = await team_utils.getTeamIDByName(req.params.teamName);
        if (team_ids == -1) {
            res.status(404).send("no results match your query, try typing in different name or partial name");
        } else {
            const team_details = await team_utils.getTeamsInfo(team_ids);
            const name = team_details.player_details[0].team_name;

            const futureGames = await DButils.execQuery(
                "SELECT g.game_id,t1.teamName as home_team_name,t2.teamName as away_team_name ,g.game_date, g.stage," +
                "r.name as referee ,f.name as field " +
                "from games as g " +
                "inner join referees as r on r.referee_id = g.refereeId " +
                "inner join [dbo].[Fields] as f on f.field_id = g.fieldId " +
                "inner join [dbo].[Teams] as t1 on t1.team_id=g.home_team_id " +
                "inner join [dbo].[Teams] as t2 on t2.team_id=g.away_team_id " +
                `where CAST(GETDATE() AS DATE )<=game_date and (t1.teamName= '${name}' or t2.teamName = '${name}')`
            );
            const pastGames = await DButils.execQuery(
                "SELECT g.game_id,t1.teamName as home_team_name,t2.teamName as away_team_name ,g.game_date, g.h_score,g.a_score, g.eventLogId ,g.stage," +
                "r.name as referee ,f.name as field " +
                "from games as g " +
                "inner join referees as r on r.referee_id = g.refereeId " +
                "inner join [dbo].[Fields] as f on f.field_id = g.fieldId " +
                "inner join [dbo].[Teams] as t1 on t1.team_id=g.home_team_id " +
                "inner join [dbo].[Teams] as t2 on t2.team_id=g.away_team_id " +
                `where CAST(GETDATE() AS DATE )>game_date and (t1.teamName = '${name}' or t2.teamName = '${name}')`
            );
            // console.log('*************', team_details);
            let full_dets = {
                "name": name,
                "players": team_details.player_details,
                "teamLogo": team_details.teamLogo,
                "pastGames": pastGames,
                "futureGames": futureGames,

            }
            res.send(full_dets);
        }

    } catch (error) {
        next(error);
    }
});



module.exports = router;