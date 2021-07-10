const DButils = require("./DButils");

function addEvents(pastGames, EventLogs) {
    // combines the list of events for a game from the joint table 
    // with table records of games
    for (ev in EventLogs) {
        let gameID = EventLogs[ev]['logEventId'];
        let gameEve = EventLogs[ev];
        for (game in pastGames) {
            if (pastGames[game]['eventLogId'] == gameID) {
                try { pastGames[game]['events'].push(gameEve); } catch {
                    pastGames[game]['events'] = [];
                    pastGames[game]['events'].push(gameEve);
                }

            }

        }

    }
    return pastGames;
}
async function checkValid(req) {
    let h_id = req.body.home_team_id;
    let a_id = req.body.away_team_id;
    h_id = Number(h_id);
    a_id = Number(a_id);
    if (h_id == NaN || a_id == NaN || h_id < 0 || a_id < 0)
        return false;
    let stage = req.body.stage;
    var stages = ['playoff', 'Qualifiers', 'Houses', 'Knockout'];
    if (!stages.includes(stage))
        return false;
    let fieldID = req.body.fieldId;
    let refereeID = req.body.refereeId;
    const refs = await DButils.execQuery("SELECT * FROM dbo.Referees");
    const fields = await DButils.execQuery("SELECT * FROM dbo.Fields");
    if (!(refs.find((x) => x.referee_id == refereeID)) || !(fields.find((x) => x.field_id == fieldID)))
        return false;
    let date = req.body.game_date;

    return valiDate(date);

}

function valiDate(date) {
    let time = new Date(date);
    timec = time.getTime()
    if (!(timec === timec))
        return false;
    today = new Date();
    return timec > today.getTime();

}

function array2srting(games_ids_list) {

    if (games_ids_list.length <= 0) {
        return -1;
    }
    let toreturn = "(";
    for (id in games_ids_list) {
        toreturn += `${games_ids_list[id]},`
    }
    toreturn = toreturn.substring(0, toreturn.length - 1) + ")";
    return toreturn;
}

async function getGamesInfo(games_ids_list) {
    // maps players info through each id
    let game_id_string = array2srting(games_ids_list);

    if (game_id_string == -1) {
        return {
            "past_games": [],
            "future_games": []

        }
    }

    const past_games = await DButils.execQuery(
        "SELECT g.game_id,t1.teamName as home_team_name,t2.teamName as away_team_name ,g.game_date, g.h_score,g.a_score, g.eventLogId ,g.stage," +
        "r.name as referee ,f.name as field " +
        "from games as g " +
        "inner join referees as r on r.referee_id = g.refereeId " +
        "inner join [dbo].[Fields] as f on f.field_id = g.fieldId " +
        "inner join [dbo].[Teams] as t1 on t1.team_id=g.home_team_id " +
        "inner join [dbo].[Teams] as t2 on t2.team_id=g.away_team_id " +
        `where  game_id in ${game_id_string} and CAST(GETDATE() AS DATE )>game_date `);

    // `SELECT * FROM dbo.Games where game_id in ${game_id_string} and CAST( GETDATE() AS DATE )>game_date`);
    const future_games = await DButils.execQuery(
        "SELECT g.game_id,t1.teamName as home_team_name,t2.teamName as away_team_name ,g.game_date, g.stage," +
        "r.name as referee ,f.name as field " +
        "from games as g " +
        "inner join referees as r on r.referee_id = g.refereeId " +
        "inner join [dbo].[Fields] as f on f.field_id = g.fieldId " +
        "inner join [dbo].[Teams] as t1 on t1.team_id=g.home_team_id " +
        "inner join [dbo].[Teams] as t2 on t2.team_id=g.away_team_id " +
        `where game_id in ${game_id_string} and CAST(GETDATE() AS DATE )<=game_date`);
    // `SELECT * FROM dbo.Games where game_id in ${game_id_string} and CAST( GETDATE() AS DATE )<=game_date`);

    // execute promises

    let toReturn = {
        "past_games": past_games,
        "future_games": future_games
    };
    return toReturn;
}

exports.checkValid = checkValid;
exports.addEvents = addEvents;
exports.getGamesInfo = getGamesInfo;