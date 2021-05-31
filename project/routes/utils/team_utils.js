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
    console.log(team_name);
    return(team_name);
}
exports.getTeamNameByID = getTeamNameByID;