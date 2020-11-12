const sfx = require('./sfx');
const es = require('./elastic');
const vars = require('./vars');
var commandsList = [];

async function initCommands()
{
  commandsList = await es.fetchCommands(vars.commandCategories.MOD);
}

function isValidCommand(command)
{
  return Object.keys(commandsList).indexOf(command) >= 0;
}

function process(user, command)
{
  es.indexChatMessage(user, command, "mod");

  if (command === '!killsfx') 
  {
    return sfx.kill(user, command);
  }
  else if (command === '!killsfxq') 
  {
    return sfx.clearQueue(user, command);
  }
}

module.exports = {
  process,
  initCommands,
  isValidCommand
};