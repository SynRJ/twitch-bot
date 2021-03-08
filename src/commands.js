const utils = require('./utils');
const vars = require('./vars');
const db = require('./db');
const xpCommands = require('./xp');

var link = "ne semble pas connaître le lien non plus... " + utils.getRandom(vars.beepboopPhrases);
var timerIndex = 0;

async function process(commandName, user, args) 
{
  var phrase = null;

  if (commandName === '!commands' || commandName === '!commandes' || commandName === '!cmd' || commandName === '!sfx' || commandName === '!sounds' || commandName === '!sons') 
  {    
    phrase = `Liste des commandes et SFX : https://synrj.tv`;
  } 
  else if (commandName === '!ctb' || commandName === '!cmb' || commandName === '!ctc') 
  {
    phrase = ctb(commandName);
  } 
  else if (commandName === '!sakaille') 
  {
    phrase = `On entend distinctement le doux son d'un caillou...`;
  } 
  // else if (commandName === '!mods') 
  // {
  //   phrase = `Mods du Mordoeuf 3.0 : Extra Equip Slots, Global Positions, Achivements and Level System (modifié), No Thermal Stone Durability, Simple Health Bar, Wormhole Marks, Combined Status, Boss Indicators, Geometric Placement, Minimap HUD`;
  // } 
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
    phrase = await db.userStats(user);
  }
  else if (commandName === '!level' || commandName === '!lvl' || commandName === '!rank')
  {
    phrase = await db.xpUser(user);
  }
  else if (commandName === '!top')
  {
    phrase = await db.xpTop();
  }
  else if (commandName === '!tchat')
  {
    phrase = await db.top();
  }
  else if (commandName === '!lien' || commandName === '!link')
  {
    if (args.length > 1)
    {
      link = args[1];
      phrase = "met le lien de côté, juste au cas où."
    }
    else 
    {
      phrase = "balance le lien : " + link;
    }
  }

  if (phrase != null)
  {
    xpCommands.processMessage(user, commandName, "text");
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
  db.indexChatMessage(user, "oeufrobot", "text");

  var phrase = "";

  if (user === "synrj")
  {
    return `Oui Maître 😳`;
  }
  else if (vars.eliteUsers.indexOf(user) >= 0)
  {
    phrase = utils.getRandom(vars.botElitePhrases);
  }
  else 
  {
    phrase = utils.getRandom(vars.botPhrases);
  }

  phrase = phrase.replace("$user", user);
  var beepboop = utils.getRandom(vars.beepboopPhrases);

  return `${phrase}. ${beepboop} 🤖`;
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