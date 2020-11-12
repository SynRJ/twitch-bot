const fs = require('fs');
const emoteFolder = "C:\\Users\\Gael\\Desktop\\streaming\\img\\assets\\veggies\\";

function getRandom(list)
{
  return list[list.length * Math.random() | 0];
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

module.exports = {
  getRandom,
  isValidCommand,
  commandExists,
  isEmoteCommand,
  isBotCommand,
  swapToColoredEmote,
  cleanUp
};