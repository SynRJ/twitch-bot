const tmi = require('tmi.js');
const vars = require('./vars');
const moment = require('moment');
const fs = require('fs');
const { modCommands } = require('./vars');
const player = require('play-sound')(({player: "cmdmp3win"}));
const helloSoundsDirectory = `C:\\Users\\Gael\\Desktop\\streaming\\sounds\\sounds\\hello\\`;
const soundsDirectory = `C:\\Users\\Gael\\Desktop\\streaming\\sounds\\sounds\\`;
const soundDelay = 3000;
const defaultTarget = '#synrj';
var timerIndex = 0;
var playing = false;
var soundLastExec = 0;
var soundQueue = [];
var audio = null;
var gameQueue = [];
var queueOn = false;


require('log-timestamp')(function() { return '[' + moment().format("YYYY-MM-DD HH:mm:ss")  + '] %s' });;

// Define configuration options
const opts = {
  identity: {
    username: 'oeufrobot',
    password: 'oauth:ug1qotqdpnwpke2vuy8oal7g72kba6'
  },
  channels: [
    'synrj'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

setInterval(() => soundCommand(), 200);
setInterval(() => timerCommand(), 1200000);

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; }

  const command = msg.trim();

  if (!isValidCommand(command))
  {
    return;
  }

  console.log(`IN: ${command}`);
  var user = context.username;
  var mod = context.mod || user === 'synrj';
  console.log(`USER: ${user}`);

  var args = command.split(" ");
  var commandName = args[0];

  if (vars.modCommands.indexOf(commandName) >= 0 && mod)
  {
    modCommand(commandName, args, user);
    return;
  }
  
  if (commandName === '!commands' || commandName === '!commandes' || commandName === '!cmd' || commandName === '!sfx' || commandName === '!sounds' || commandName === '!sons') 
  {    
    simpleCommand(target, `Liste des commandes et SFX : https://synrj.streaming.lv/?commands`);
  } 
  else if (commandName === '!ctb' || commandName === '!cmb' || commandName === '!ctc') 
  {
    ctbCommand(target, commandName);
  } 
  else if (commandName === '!sakaille') 
  {
    simpleCommand(target, `On entend distinctement le doux son d'un caillou...`);
  } 
  else if (commandName === '!discord') 
  {
    simpleCommand(target, `Le discord de SynRJ est disponible par ici : https://discord.gg/PaZbKcX Discussions, clips et les dernières infos sur la chaîne !`);
  } 
  else if (commandName === '!oeuf' || commandName === '!œuf') 
  {
    simpleCommand(target, `L’œuf originel, là où tout a commencé : https://www.twitch.tv/synrj/clip/ImpartialTemperedMeerkatHassanChop !`);
  } 
  else if (commandName === '!yt' || commandName === '!youtube') 
  {
    simpleCommand(target, `Les VODs des streams sont disponibles sur YouTube, n'hésitez pas à vous rendre sur https://www.youtube.com/channel/UCn_cu9jENWmF2IA5Rj3DoEQ si vous voulez voir ou revoir un épisode !`);
  }
  else if (vars.sfxCommands.includes(commandName))
  {
    soundQueue.push(new SoundCommand(commandName, args));    
  }
  else if (commandName === '!queue')
  {
    queueCommand(args, user, mod);   
  }

  if (command.indexOf('oeufrobot') >= 0 || command.indexOf('œufrobot') >= 0)
  {
    botCommand(user);
  }
}

function modCommand(command, args, user)
{
  if (command === '!killsfx') 
  {
    if (playing)
    {
      audio.kill();
      simpleCommand(target, getRandom(vars.killSFXPhrases));
    }
  }
  else if (command === '!killqueue') 
  {
    if (soundQueue.length > 0)
    {
      soundQueue = [];
      simpleCommand(target, getRandom(vars.killQueuePhrases));
    }
  }
}

function queueCommand(args, user, mod)
{
  if (args.length === 0 && queueOn) 
  {
    displayQueue();
    return;
  }

  var action = args[1];

  if (mod)
  {
    switch (action)
    {  
      case 'help':
        simpleCommand(defaultTarget, "!queue <start, stop, reset, join, leave>");
        return;

      case 'start':
        queueOn = true;
        simpleCommand(defaultTarget, `a démarré dans la file d'attente.`);
        return;
        
      case 'pause':
        queueOn = false;
        simpleCommand(defaultTarget, `a mis en pause la file d'attente.`);
        return;
      
      case 'reset':
        gameQueue = [];
        simpleCommand(defaultTarget, `a vidé la file d'attente.`);
        return;

    }
  } 
  else
  {
    switch (action)
    {  
      case 'help':
        simpleCommand(defaultTarget, "!queue <join, leave>");
        return;
    }

  }
  
  if (action === 'join')
  {
    var index = gameQueue.indexOf(user)
    if (index === -1) {      
      gameQueue.push(user);
      simpleCommand(defaultTarget, `a ajouté ${user} dans la file (position ${gameQueue.length}).`);
    }
    else 
    {
      simpleCommand(defaultTarget, `indique ${user} dans la file (position ${index+1}).`);
    }
    return;
  }
  else if (action === 'leave')
  {
    const index = gameQueue.indexOf(user);
    if (index > -1) 
    {
      gameQueue.splice(index, 1);
    }
  }
  else
  {
    simpleCommand(defaultTarget, "semble dire que la file d'attente n'est pas lancée ou est en pause. \"!queue start\" pour la démarrer.");
  }

  queueCommand(args, user);
}

function displayQueue()
{
  var temp = gameQueue;
  simpleCommand(defaultTarget, "Prochaines personnes dans la file :" + temp.splice(5).split(", "));
}

function isValidCommand(command)
{
  return command.startsWith('!') || command.indexOf('oeufrobot') >= 0 || command.indexOf('robotoeuf') >= 0;
}

function getRandom(list)
{
  return list[list.length * Math.random() | 0];
}

function botCommand(user)
{
  var phrase = "";

  if (user === "synrj")
  {
    phrase = `Oui Maître 😳`;
  } 
  else 
  {
    var phrase1 = getRandom(vars.botPhrases);
    phrase1 = phrase1.replace("$user", user);
    var phrase2 = getRandom(vars.beepboopPhrases);
    phrase = `${phrase1}. ${phrase2} 🤖`;
  }

  simpleCommand(defaultTarget, phrase);
}

function timerCommand()
{
  if (timerIndex >= vars.timerPhrases.length)
  {
    timerIndex = 0;
  }

  simpleCommand(defaultTarget, vars.timerPhrases[timerIndex]);
  timerIndex++;
}

function ctbCommand (target, command) {
  var emote = `synrj${command.split("!").pop().toUpperCase()}`;
  var phrase = getRandom(vars.ctbPhrases);

  var response = `/me ${phrase} ${emote}`;

  client.say(target, response);
  console.log(`OUT: ${response}`);
}

function simpleCommand (target, response) {
  response = `/me ${response}`;
  client.say(target, response);
  console.log(`OUT: ${response}`);
}

function helloCommand() {
  const files = fs.readdirSync(helloSoundsDirectory).map(file => {
    return file;
  });
  
  var file = getRandom(files);

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
    })
    console.log(`OUT: ${file}`);
}

function helloXCommand(number) { 
    var file = `${number}.mp3`;
    if (fs.existsSync(`${helloSoundsDirectory}${file}`)) {
      audio = player.play(`${helloSoundsDirectory}${file}`, function(err) {
        playing = false;
        if (err) throw err
      })
      console.log(`OUT: ${file}`);
    }
    else 
    {
      console.log(`ERROR: ${file} does not exist`)
    }
}

function soundCommand()
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
    if (command.args.length > 1)
    {
      var num = parseInt(command.args[1], 10);
      if (isNaN(num) || num < 1 || num > 8)
      {
        helloCommand();
      }
      helloXCommand(command.args[1]);
    }
    else
    {
      helloCommand();
    }
  }
  else if (command.name === '!situation')
  {
    playSoundCommand('situation.mp3')
  }
  else if (command.name === '!tatalatin' || command.name === '!tata')
  {
    playSoundCommand('tatalatin.mp3')
  }
  else if (command.name === '!merde')
  {
    playSoundCommand('merde.mp3')
  }
  else if (command.name === '!grapin')
  {
    playSoundCommand('grapin.mp3')
  }
  else if (command.name === '!humour')
  {
    playSoundCommand('humour.mp3')
  }
  else if (command.name === '!libre' || command.name === '!liberee' || command.name === '!delivree')
  {
    playSoundCommand('libre.mp3')
  }
  else if (command.name === '!surprise')
  {
    playSoundCommand('surprise.mp3')
  }
  else if (command.name === '!wuba')
  {
    playSoundCommand('wuba.mp3')
  }
  else if (command.name === '!shit')
  {
    playSoundCommand('shit.mp3')
  }
  else if (command.name === '!souffrir')
  {
    playSoundCommand('souffrir.mp3')
  }
  else if (command.name === '!doigt')
  {
    playSoundCommand('doigt.mp3')
  }
  else if (command.name === '!faim')
  {
    playSoundCommand('faim.mp3')
  }
  else if (command.name === '!sors' || command.name === '!tusors')
  {
    playSoundCommand('tusors.mp3')
  }
  else if (command.name === '!bim' || command.name === '!bam' || command.name === '!bimbam')
  {
    playSoundCommand('bimbam.mp3')
  }
  else if (command.name === '!thanks' || command.name === '!thankyou')
  {
    playSoundCommand('thankyou.mp3')
  }
  else if (command.name === '!good')
  {
    playSoundCommand('verygood.mp3')
  }
  else if (command.name === '!travail')
  {
    playSoundCommand('travail.mp3')
  }
  else if (command.name === '!sorry')
  {
    playSoundCommand('sorry.mp3')
  }
  else if (command.name === '!joke' || command.name === '!badum')
  {
    playSoundCommand('joke.mp3')
  }
  else if (command.name === '!poupi')
  {
    playSoundCommand('poupi.mp3')
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  simpleCommand(defaultTarget, getRandom(vars.connectPhrases));
}

class SoundCommand {  
  constructor(name, args) {
    this.name = name;
    this.args = args;
  }
}