
function addEvents(pastGames, EventLogs)
{
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