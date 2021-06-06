const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const players_utils = require("./players_utils");

async function getTeamNameByID(team_id)
{
  // fetch team by id and return it's details
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
    //get all teams with names matching the input query and return the ID of the most relevant 
    const team = await axios.get(`${api_domain}/teams/search/${team_name}`, {
        params: {
          api_token: process.env.api_token,
          include: "league",
        },
      });
    let filtered_teams = []
    team.data.data.map(function(team){
      if(team.league.data.id == 271)
      filtered_teams.push(team);
    })
    //if no appropriate teams found, return -1  
    if(filtered_teams.length == 0)
      return -1;
    const id = choose_name(filtered_teams,team_name);
    
    return(id);
}
function choose_name(teams,name)
{
  // look for team names starting with the input query as they are most likely to be what the user ment
  for (team in teams)
  {
    var team_name = teams[team].name;
    if(team_name.indexOf(name.toLowerCase()) == 0 || team_name.indexOf(name.toUpperCase()) == 0 )
    {
      return teams[team].id;
    }
  }
  //if none found, return the first team found
  return teams[0].id;

}
async function getTeamsInfo(team_ids)
{   
  // get the players info for each player in each team
    let teams_info = await players_utils.getPlayersByTeam(team_ids)
    
    return teams_info;
}


exports.getTeamNameByID = getTeamNameByID;
exports.getTeamIDByName = getTeamIDByName;
exports.getTeamsInfo = getTeamsInfo;
