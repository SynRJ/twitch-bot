const vars = require('./vars');
const config = require('./config');
const utils = require('./utils');
const db = require('./db');
const xpCommands = require('./xp');
const fs = require('fs');
const player = require('play-sound')(({player: "cmdmp3win"}));
const helloSoundsDirectory = config.paths.helloSounds;
const soundsDirectory = config.paths.sounds;
const soundDelay = 3000;
var commandsList = [];
var soundLastExec = 0;
var playing = false;
var soundQueue = [];
var audio = null;

async function initCommands()
{
  commandsList = await db.fetchCommands(vars.commandCategories.SFX);
}

function isValidCommand(command)
{
  return Object.keys(commandsList).indexOf(command) >= 0;
}

function process()
{
  if (soundQueue.length == 0 || playing)
  {
    return;
  }

  if (soundLastExec >= (Date.now() - soundDelay))
  {
    return;
  }

  playing = true;
  soundLastExec = Date.now();
  var command = soundQueue.shift();
  
  if (command.name.startsWith('!hello')) 
  {
    var param = null;
    
    if (command.args.length > 1)
    {
      param = command.args[1];
    }
    else 
    {
      var split = command.name.split('hello');
      if (split.length > 1)
      {
        param = split[1];
      }
    }

    var num = parseInt(param, 10);
    if (isNaN(num) || num < 1 || num > 8)
    {
      helloCommand();
      return;
    }

    helloXCommand(num);    
  }
  else
  {
    playSoundCommand(command.file)
  }
}

function kill() 
{
  if (playing)
  {
    audio.kill();  
    return utils.getRandom(vars.killSFXPhrases);
  }
  else
  {
    return "n'a trouvé aucun SFX qui méritait son châtiment divin.";
  }
}

function clearQueue() 
{
  if (soundQueue.length > 0)
  {
    soundQueue = [];
    return utils.getRandom(vars.killQueuePhrases);
  }
}

function addToQueue(commandName, args, user)
{
  xpCommands.processMessage(user, commandName, "sfx");
  var file = commandsList[commandName];
  soundQueue.push(new SoundCommand(commandName, file, args));   
}

function helloCommand() {
  const files = fs.readdirSync(helloSoundsDirectory).map(file => {
    return file;
  });
  
  var file = utils.getRandom(files);

  audio = player.play(`${helloSoundsDirectory}${file}`, function(err) {
    playing = false;
    if (err) console.log(err);
  })
  console.log(`OUT: ${file}`);
}
  
function playSoundCommand(file) { 
  audio = player.play(`${soundsDirectory}${file}`, function(err) {
    playing = false;
    if (err) throw err
  });
  console.log(`OUT: ${file}`);
}
  
function helloXCommand(number) { 
  var file = `${number}.mp3`;
  if (fs.existsSync(`${helloSoundsDirectory}${file}`)) {
    audio = player.play(`${helloSoundsDirectory}${file}`, function(err) {
      playing = false;
      if (err) throw err
    });
    console.log(`OUT: ${file}`);
  }
  else 
  {
    console.log(`ERROR: ${file} does not exist`)
  }
}

class SoundCommand {  
  constructor(name, file, args) {
    this.name = name;
    this.file = file;
    this.args = args;
  }
}

module.exports = {
  process,
  addToQueue,
  kill,
  clearQueue,
  isValidCommand,
  initCommands,
  playSoundCommand
};