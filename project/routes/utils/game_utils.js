const DButils = require("./DButils");

function addEvents(pastGames, EventLogs)
{
  // combines the list of events for a game from the joint table 
  // with table records of games
    for(ev in EventLogs)
    {
      let gameID = EventLogs[ev]['logEventId'];
      let gameEve = EventLogs[ev];
      for(game in pastGames)
      {
        if(pastGames[game]['eventLogId'] == gameID)
        {
          try{pastGames[game]['events'].push(gameEve);}
          catch
          {
            pastGames[game]['events'] = [];
            pastGames[game]['events'].push(gameEve);
          }
          
        }
        
      }
      
    }
    return pastGames;
}
async function checkValid(req)
{
  let h_id = req.body.home_team_id;
  let a_id = req.body.away_team_id;
  h_id = Number(h_id);
  a_id = Number(a_id);
  if(h_id == NaN || a_id == NaN || h_id < 0 || a_id < 0)
    return false;
  let stage = req.body.stage;
  var stages = ['playoff','Qualifiers','Houses','Knockout'];
  if(!stages.includes(stage))
    return false;
  let fieldID = req.body.fieldId;
  let refereeID = req.body.refereeId;
  const refs = await DButils.execQuery("SELECT * FROM dbo.Referees");
  const fields = await DButils.execQuery("SELECT * FROM dbo.Fields");
  if(!(refs.find((x) => x.referee_id == refereeID))||!(fields.find((x) => x.field_id == fieldID)))
    return false;
  let date = req.body.game_date;
  
  return valiDate(date);
  
}

function valiDate(date)
{
 let time = new Date(date);
 timec = time.getTime()
 if (!(timec === timec))
  return false;
today = new Date();
return timec > today.getTime();

}
exports.checkValid = checkValid;
exports.addEvents = addEvents;