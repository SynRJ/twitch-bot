const tmi = require('tmi.js');
const vars = require('./vars');
const config = require('./config');
const miscCommands = require('./commands');
const modCommands = require('./mod');
const utils = require('./utils');
const sfxCommands = require('./sfx');
const queueCommands = require('./queue');
const xpCommands = require('./xp');
const api = require('./api');
const moment = require('moment');
const defaultTarget = '#synrj';
require('./events');

require('log-timestamp')(function() { return '[' + moment().format("YYYY-MM-DD HH:mm:ss")  + '] %s' });;

// Bot client
const client = new tmi.client(config.twitch);

// Connect to Twitch:
client.connect()

// Twitch API
api.main();

xpCommands.initOverview();

// Intervals
setInterval(() => sfxCommands.process(), 200);
setInterval(() => xpCommands.processTick(), 1 * 60 * 1000); // 1 minute
// setInterval(() => xpCommands.process(),  1000); // 1 second
setInterval(() => print(miscCommands.timerCommand()), 30 * 60 * 1000); // 30 minutes
setInterval(() => xpCommands.getXpOverview(), 5 * 60 * 1000); // 5 minutes

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
    xpCommands.processMessage(user, null, "message");
    return;
  }

  console.log(`IN: ${command}`);
  var mod = context.mod || user === 'synrj';
  console.log(`USER: ${user}`);

  var args = command.split(' ');
  var commandName = args[0];

  if (mod && modCommands.isValidCommand(commandName))
  {
    print(modCommands.process(user, commandName, args));
    return;
  }

  if (commandName === '!queue' || commandName === '!q')
  {
    print(queueCommands.process(args, user, mod));
    return;
  }

  if (sfxCommands.isValidCommand(commandName))
  {
    sfxCommands.addToQueue(commandName, args, user); 
    return;
  }

  if (commandName === '!first')
  {
    if (user === vars.eliteUsers[0])
    {
      sfxCommands.addToQueue(commandName, args, user); 
    } 
    else 
    {
      print(`Seul ${user} peut utiliser cette commande, c'est lui le patron !`);
    }
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
  if (response == null || response == '')
  {
    return;
  }

  response = `/me ${response}`;
  client.say(defaultTarget, response);
  console.log(`OUT: ${response}`);
}

events.on('print', function(message) {
  print(message);
});

process.on('exit', function () {
  console.log('exit');
  utils.cleanUp();
});