const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getTeamNameByID(team_id)
{
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    const team_name = team.data.data.name;
    
    return(team_name);
}
async function getTeamIDByName(team_name)
{
    const team = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    const team_id = team.data.data.id;
    
    return(team_id);
}
async function getTeamsByPartialName(team_name)
{
    let partial = new RegExp(team_name,'i');
    const teams = await axios.get(`${api_domain}/teams/search/${partial}`, {
        params: {
          api_token: process.env.api_token,
        },
      });
    
    
    return(teams);
}


exports.getTeamNameByID = getTeamNameByID;
exports.getTeamIDByName = getTeamIDByName;
exports.getTeamsByPartialName = getTeamsByPartialName;