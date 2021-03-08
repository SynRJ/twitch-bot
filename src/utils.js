const fs = require('fs');
const vars = require('./vars');
const config = require('./config');
const emoteFolder = config.paths.emotes;

function getRandom(list)
{
  return list[list.length * Math.random() | 0];
}

function getRandomInt(min, max)
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isValidCommand(command)
{
  return command.startsWith('!') || isBotCommand(command);
}

function commandExists(commandList, command)
{
  return Object.keys(commandsList).indexOf(command) >= 0;
}

function isEmoteCommand(command)
{
  return command.indexOf('synrjCTB') >= 0 || command.indexOf('synrjCMB') >= 0 || command.indexOf('synrjCTC') >= 0;
}

function isBotCommand(command)
{
  return command.indexOf('oeufrobot') >= 0 || command.indexOf('œufrobot') >= 0;
}

function swapToColoredEmote(image)
{
  fs.copyFile(`${emoteFolder}${image}_color.png`, `${emoteFolder}${image}.png`, (err) => {
    if (err) console.log(err);
    setTimeout(function() {
      swapToEmbossedEmote(image)
    }, 2000);
  });
}

function swapToEmbossedEmote(image)
{
  fs.copyFile(`${emoteFolder}${image}_embossed.png`, `${emoteFolder}${image}.png`, (err) => {
    if (err) console.log(err);
  });
}

function cleanUp()
{
  swapToEmbossedEmote("banana");
  swapToEmbossedEmote("peach");
  swapToEmbossedEmote("eggplant");
}

function getRank(level)
{  
  for (var i = 0; i < vars.ranks.length; i++)
  {
    if (level >= vars.ranks[i].lvl)
    {
      return vars.ranks[i].name;
    }
  }
}

function getLevel(xp)
{
  var base = 1 + 8 * xp / 50;
  var root = Math.sqrt(base);
  var level = (1 + root) / 2;
  return Math.floor(level);
}

function getRankEmoji(rank)
{  
  switch (rank)
  {
    case 1:
      return '🥇';
    case 2: 
      return '🥈';
    case 3: 
      return '🥉';
    default:
      return '🎊';
  }
}

module.exports = {
  getRandom,
  getRandomInt,
  isValidCommand,
  commandExists,
  isEmoteCommand,
  isBotCommand,
  swapToColoredEmote,
  cleanUp,
  getRank,
  getLevel,
  getRankEmoji
};