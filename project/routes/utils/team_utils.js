const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const players_utils = require("./players_utils");

async function getTeamNameByID(team_id)
{
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    const team_name = team.data.data;
    
    return(team_name);
}
async function getTeamIDByName(team_name)
{
    ids = [];
    const team = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    
    team.data.data.map((team) => ids.push(team.id));
    
    return(ids);
}
async function getTeamsInfo(team_ids)
{
    let promises = [];
    team_ids.map((id)=>promises.push(players_utils.getPlayersByTeam(id)));
    
    let teams_info = await Promise.all(promises);
    
    return teams_info;
}


exports.getTeamNameByID = getTeamNameByID;
exports.getTeamIDByName = getTeamIDByName;
exports.getTeamsInfo = getTeamsInfo;
