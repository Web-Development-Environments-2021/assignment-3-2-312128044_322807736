const axios = require("axios");

const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

async function getPlayersDetailsByName(playerNames) {
  const players = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/players/search/${playerNames}`,
    {
      params: {
        include: "team",
        api_token: process.env.api_token,
      },
    }
  );
  
  return players.data;
}
async function getPlayerDetailsByID(playerId) {
  const player = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/players/${playerId}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    player_details: player.data,
    // next game details should come from DB
  };
}
async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  let toReturn =
  {"player_list": player_ids_list,
  "teamLogo" : team.data.data.logo_path 
  };
  return toReturn;
 }


async function getPlayersInfo(players_ids_list, teamLogo) {
  
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let promise_info = await Promise.all(promises);
  
  let players_info = []
  promise_info.map((prom) => players_info.push(prom))
  let rel_info = extractRelevantPlayerData(players_info);
  let toReturn = {
    "player_details": rel_info,
    "teamLogo": teamLogo
  };
  return toReturn;
}

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}
function extractFullData(player)
{
  
  let team_name ;
  try{
    team_name = player.team.data.name
  }
  catch{
    team_name ="he has no team";
  }
  
  toReturn = {
    "fullName" : player.fullname,
      "teamName" : team_name,
      "imageUrl" : player.image_path,
      "positionNum" : player.position_id,
      "commonName" : player.common_name,
      "nationality" : player.nationality,
      "birthdate" : player.birthdate,
      "birthCountry":player.birthcountry,
      "height": player.height,
      "weight": player.weight,

  }
  return toReturn;

}
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  
  let players_info = await getPlayersInfo(player_ids_list.player_list, player_ids_list.teamLogo);
  return players_info;
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersDetailsByName = getPlayersDetailsByName;
exports.extractFullData = extractFullData;
exports.getPlayerDetailsByID = getPlayerDetailsByID;

