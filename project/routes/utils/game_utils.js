
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

exports.addEvents = addEvents;