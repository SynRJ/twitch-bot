const es = require('./elastic');
const queueIsOffMessage = "semble dire que la file d'attente n'est pas lancée ou est en pause. \"!q start\" pour la démarrer.";
var gameQueue = [];
var queueOn = false;

function process(args, user, mod)
{
  es.indexChatMessage(user, "!q", "queue");

  if (args.length === 1) 
  {    
    return displayQueue();
  }

  var action = args[1];

  if (mod)
  {
    switch (action)
    {  
      case 'help':
        return "!q <start, pause, reset, join, leave>";

      case 'start':
        return startQueue();
        
      case 'pause':
        return pauseQueue();
        
      case 'next':
        return nextInQueue();
      
      case 'reset':
        return resetQueue();
    }
  } 
  else
  {
    switch (action)
    {  
      case 'help':
        return "!q <join, leave>";
    }
  }
  
  if (action === 'join')
  {
    return joinQueue(user);
  }
  else if (action === 'leave')
  {
    return leaveQueue(user);
  }
}

function nextInQueue()
{  
  if (!queueOn)
  {
    return queueIsOffMessage;
  }
  
  if (gameQueue.length === 0)
  {
    return `fouille frénétiquement la file d'attente. Non, décidemment, elle est belle et bien vide.`;
  }
  
  var user = gameQueue.splice(0, 1)[0];

  return `extirpe délicatement ${user} de la file d'attente. C'est ton tour !`;
}

function joinQueue(user)
{
  if (!queueOn)
  {
    return queueIsOffMessage;
  }

  const index = gameQueue.indexOf(user)
  if (index === -1) {      
    gameQueue.push(user);
    return `a ajouté ${user} dans la file (position ${gameQueue.length}).`;
  }
  else 
  {
    return `indique que ${user} est déjà dans la file (position ${index+1}).`;
  }
}

function leaveQueue(user)
{
  if (!queueOn)
  {
    return queueIsOffMessage;
  }

  const index = gameQueue.indexOf(user);
  if (index > -1) 
  {
    gameQueue.splice(index, 1);
    return `a expulsé ${user} hors de la file d'attente.`;
  } 
  else 
  {
    return `fait remarquer que ${user} n'est pas dans la file d'attente. Mais il le pulvérise quand même, pour faire bonne mesure.`;
  }
}

function resetQueue()
{
  gameQueue = [];
  return `a purgé la file d'attente sans vergogne.`;
}

function pauseQueue()
{
  if (queueOn)
  {
    queueOn = false;
    return `a mis en pause la file d'attente. Pas touche.`;
  }
  else
  {
    return queueIsOffMessage;
  }
}

function startQueue()
{  
  if (!queueOn)
  {
    queueOn = true;
    return `a démarré dans la file d'attente.`;
  }
  else 
  {          
    return `La file d'attente est déjà en cours.`;
  }
}

function displayQueue()
{
  if (!queueOn)
  {  
    return queueIsOffMessage;
  }

  if (gameQueue.length === 0)
  {
    return "La file d'attente est vide.";
  }

  var temp = gameQueue;
  temp.splice(5);
  return "Prochaines personnes dans la file : " + temp.join(", ");
}

module.exports = {
    process
};