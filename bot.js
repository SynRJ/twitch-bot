const tmi = require('tmi.js');
const vars = require('./vars');
const config = require('./config');
const miscCommands = require('./commands');
const modCommands = require('./mod');
const utils = require('./utils');
const sfxCommands = require('./sfx');
const queueCommands = require('./queue');
const es = require('./elastic');
const moment = require('moment');
const defaultTarget = '#synrj';

require('log-timestamp')(function() { return '[' + moment().format("YYYY-MM-DD HH:mm:ss")  + '] %s' });;

// Bot client
const client = new tmi.client(config.twitch);

// Connect to Twitch:
client.connect()

// Intervals
setInterval(() => sfxCommands.process(), 200);
setInterval(() => print(miscCommands.timerCommand()), 30 * 60 * 1000); // 30 minutes

// Event handlers
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('emoteonly', onEmoteOnlyHandler);

function onEmoteOnlyHandler (channel, enabled) {
  if (enabled)
  {
    print('surveille attentivement le tchat. Sortez vos plus belles emotes !');
  }
  else 
  {
    print('a beaucoup apprécié vos emotes. beep boop');
  }
}

function onMessageHandler (target, context, msg, self) {
  if (self) { return; }

  const command = msg.trim();
  var user = context.username;

  if (utils.isEmoteCommand(command))
  {
    miscCommands.processEmote(command);
  }
  
  if (!utils.isValidCommand(command))
  {    
    es.indexChatMessage(user, null, 'message');
    return;
  }

  console.log(`IN: ${command}`);
  var mod = context.mod || user === 'synrj';
  console.log(`USER: ${user}`);

  var args = command.split(' ');
  var commandName = args[0];

  if (mod && modCommands.isValidCommand(commandName))
  {
    print(modCommands.process(user, commandName));
    return;
  }

  if (commandName === '!queue' || commandName === '!q')
  {
    print(queueCommands.process(args, user, mod));
    return;
  }

  if (sfxCommands.isValidCommand(commandName))
  {
    sfxCommands.addToQueue(commandName, args); 
    return;
  }
  
  if (utils.isBotCommand(command))
  {
    print(miscCommands.botCommand(user));
    return;
  }

  miscCommands.process(commandName, user, args).then((phrase) => {
    if (phrase !== null && phrase !== undefined)
    {
      print(phrase);
    }
  })
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  sfxCommands.initCommands();
  modCommands.initCommands();
  print(utils.getRandom(vars.connectPhrases));
}

function print(response) {
  response = `/me ${response}`;
  client.say(defaultTarget, response);
  console.log(`OUT: ${response}`);
}

process.on('exit', function () {
  utils.cleanUp();
});

process.on('SIGINT', function() {
  process.exit();
});

process.on('SIGTERM', function() {
  process.exit();
});