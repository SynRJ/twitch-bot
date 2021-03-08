const sfx = require('./sfx');
const db = require('./db');
const vars = require('./vars');
const config = require('./config');
const utils = require('./utils');
const xpCommands = require('./xp');
const fs = require('fs');
const directory = config.paths.timers;
var commandsList = [];
var stopTimer = false;
var timerIsOn = false;  

async function initCommands()
{
  commandsList = await db.fetchCommands(vars.commandCategories.MOD);
}

function isValidCommand(command)
{
  return Object.keys(commandsList).indexOf(command) >= 0;
}

function process(user, command, args)
{
  xpCommands.processMessage(user, command, "mod");

  if (command === '!killsfx') 
  {
    return sfx.kill(user, command);
  }
  else if (command === '!killsfxq') 
  {
    return sfx.clearQueue(user, command);
  }
  else if (command === '!timer')
  {
    console.log(args);
    if (args.length > 1)
    {
      if (args[1] === 'stop')
      {
        stopTimer = true;
        return `a arrêté le timer grâce à son petit doigt robotique. ${utils.getRandom(vars.beepboopPhrases)}`;
      }
      else if (!isNaN(+args[1]))
      {
        var duration = +args[1];
        return setupTimer(duration);
      }
    }

    var duration = 5;
    return setupTimer(duration);
  }
  else if (command === '!start' && user === 'synrj')
  {
    return setupTimer(5, "SOON", "start");
  }
  else if (command === '!perso' && args.length === 2)
  {
    return processCharacter(args[1]);
  }
}

function processCharacter(game)
{
  var game = game.toUpperCase();
  var beep = utils.getRandom(vars.beepboopPhrases);
  var characters = vars.characters[game];
  if (characters == undefined)
  {
    return `ne connait pas ce jeu. ${beep}`;
  }
  return `choisit ${utils.getRandom(characters)}. ${beep}`;
}

function setupTimer(durationInMinutes, endText, filename)
{
  if (timerIsOn) 
  {
    return `refuse, un minuteur est déjà en cours. ${utils.getRandom(vars.beepboopPhrases)} 🤖`;
  }

  if (durationInMinutes <= 0 || durationInMinutes > 180)
  {
    return `n'est pas d'accord pour lancer ce type de minuteur. ${utils.getRandom(vars.beepboopPhrases)} 🤖`;
  }

  if (!fs.existsSync(directory)) 
  {
    fs.mkdirSync(directory);
  }

  if (filename == null)
  {
    filename = "timer";
  }

  stopTimer = false;
  timerIsOn = true;
  var currentSeconds = 0;
  var currentMinutes = 0;
  var fileName = `${directory}${filename}.txt`;

  console.log(fileName);

  timer(
    durationInMinutes * 60 * 1000,
    function(timeleft) 
    {
      currentMinutes = Math.floor(timeleft / 60);
      currentSeconds = timeleft % 60;
      if (currentMinutes <= 9) currentMinutes = "0" + currentMinutes;
      if (currentSeconds <= 9) currentSeconds = "0" + currentSeconds;
      fs.writeFile(fileName, currentMinutes + ":" + currentSeconds, function (err) 
      {
        if (err) console.log(err);          
      });
    },
    function() {
      timerIsOn = false;
      if (endText)
      {
        fs.writeFile(fileName, endText, function (err) 
        {
          if (err) console.log(err);
        });
      }
      else
      {
        fs.unlink(fileName, function () {});
      }
    }
  );
  
  return `démarre un minuteur de ${durationInMinutes} minutes. ${utils.getRandom(vars.beepboopPhrases)}`; 
}

function timer(time, update, complete) 
{
  var start = new Date().getTime();
  var interval = setInterval(function() {
    var now = time-(new Date().getTime()-start);
    if (now <= 0 || stopTimer) {
      clearInterval(interval);
      complete();
    }
    else update(Math.floor(now / 1000));
  }, 100);
}

module.exports = {
  process,
  initCommands,
  setupTimer,
  isValidCommand
};