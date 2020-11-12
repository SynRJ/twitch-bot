const utils = require('./utils');
const vars = require('./vars');
const es = require('./elastic');

var timerIndex = 0;

async function process(commandName, user, args) 
{
  var phrase = null;

  if (commandName === '!commands' || commandName === '!commandes' || commandName === '!cmd' || commandName === '!sfx' || commandName === '!sounds' || commandName === '!sons') 
  {    
    phrase = `Liste des commandes et SFX : https://synrj.streaming.lv/?commands`;
  } 
  else if (commandName === '!ctb' || commandName === '!cmb' || commandName === '!ctc') 
  {
    phrase = ctb(commandName);
  } 
  else if (commandName === '!sakaille') 
  {
    phrase = `On entend distinctement le doux son d'un caillou...`;
  } 
  else if (commandName === '!discord') 
  {
    phrase = `Le discord de SynRJ est disponible par ici : https://discord.gg/PaZbKcX Discussions, clips et les dernières infos sur la chaîne !`;
  } 
  else if (commandName === '!oeuf' || commandName === '!œuf') 
  {
    phrase = `L’œuf originel, là où tout a commencé : https://www.twitch.tv/synrj/clip/ImpartialTemperedMeerkatHassanChop !`;
  } 
  else if (commandName === '!yt' || commandName === '!youtube') 
  {
    phrase = `Les VODs des streams sont disponibles sur YouTube, n'hésitez pas à vous rendre sur https://www.youtube.com/channel/UCn_cu9jENWmF2IA5Rj3DoEQ si vous voulez voir ou revoir un épisode !`;
  }
  else if (commandName === '!stats')
  {
    phrase = await es.userStats(user);
  }
  else if (commandName === '!tchat')
  {
    phrase = await es.top();
  }

  if (phrase != null)
  {
    es.indexChatMessage(user, commandName, "text");
  }

  return phrase;
}

function timerCommand()
{
  if (timerIndex >= vars.timerPhrases.length)
  {
    timerIndex = 0;
  }

  var phrase = vars.timerPhrases[timerIndex];
  timerIndex++;
  return phrase;
}

function botCommand(user)
{
  es.indexChatMessage(user, "oeufrobot", "text");

  var phrase = "";
  if (user === "synrj")
  {
    phrase = `Oui Maître 😳`;
  } 
  else 
  {
    var phrase1 = utils.getRandom(vars.botPhrases);
    phrase1 = phrase1.replace("$user", user);
    var phrase2 = utils.getRandom(vars.beepboopPhrases);
    phrase = `${phrase1}. ${phrase2} 🤖`;
  }

  return phrase;
}

function ctb (command) 
{
  var emote = `synrj${command.split("!").pop().toUpperCase()}`;
  var phrase = utils.getRandom(vars.ctbPhrases);

  var response = `${phrase} ${emote}`;

  return response;
}

function processEmote(command)
{
  if (command.indexOf('synrjCTB') >= 0)
  {
    utils.swapToColoredEmote("eggplant");
  }
  else if (command.indexOf('synrjCMB') >= 0)
  {
    utils.swapToColoredEmote("banana");
  }
  else if (command.indexOf('synrjCTC') >= 0)
  {
    utils.swapToColoredEmote("peach");
  }
}

module.exports = {
  process,
  botCommand,
  processEmote,
  timerCommand
};