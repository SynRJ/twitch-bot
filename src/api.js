const { ApiClient } = require('twitch');
const { RefreshableAuthProvider, StaticAuthProvider } = require('twitch-auth');
const { PubSubClient } = require('twitch-pubsub-client');
const { promises } = require('fs');
const config = require('./config');
const sfx = require('./sfx');
const xpCommands = require('./xp');
const mod = require('./mod');
const vars = require('./vars');
const utils = require('./utils');
const tokenFile = './tokens.json';

async function main() {
  const clientSecret = config.api.clientSecret;
  const tokenData = JSON.parse(await promises.readFile(tokenFile));
  
  const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(config.api.clientId, tokenData.accessToken),
    {
      clientSecret,
      refreshToken: tokenData.refreshToken,
      onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
        const newTokenData = {
            accessToken,
            refreshToken,
            expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
        };
        await promises.writeFile(tokenFile, JSON.stringify(newTokenData, null, 4), 'UTF-8')
      } 
    }
  );

  const apiClient = new ApiClient({ authProvider });  

  pubSubClient(apiClient);
}

async function pubSubClient(apiClient)
{
  const pubSubClient = new PubSubClient();
  const userId = await pubSubClient.registerUserListener(apiClient);

  const redemptionListener = await pubSubClient.onRedemption(userId, (message) => {
    switch (message.rewardId)
    {
      case '4c00f001-90a7-43bf-91d7-bc32e63c6bca': // un oeuf
        events.emit('print', utils.getRandom(vars.eggPhrases).replace("$user", message.userName));
        setTimeout(function() {
          sfx.kill();
          sfx.playSoundCommand("oeuf.mp3");
        }, 1000);
        break;

      case '58284703-fedb-47bb-a442-b861efe6a934': // mot interdit
        var duration = 5;
        events.emit('print', `écoute attentivement SynRJ, il n'a pas le droit de dire '${message.message}' pendant ${duration} minutes.`);
        mod.setupTimer(duration);
        break;

      case '37e950dc-d586-4e3a-9d6c-90500de13ed5' : // raconte un blague
        events.emit('print', utils.getRandom(vars.jokes) + ' Poooound');
        setTimeout(function() {
          sfx.kill();
          sfx.playSoundCommand("joke.mp3");
        }, 2000);
        break;

      case '02905569-3dd9-4294-b37e-614bfaa98962' : // insulte
        events.emit('print', utils.getRandom(vars.insults).replace("$user", message.userName) + ' SwiftRage');
        break;

      case 'f6e090e2-71eb-43e0-9349-01f357f11a93' : // compliment
        events.emit('print', utils.getRandom(vars.compliments).replace("$user", message.userName) + ' SeemsGood');
        break;

      case '9b0ce0bd-f235-453f-b80d-a56e01a1885d' : // xp bonus
        xpCommands.processBonus(message.userName, xpCommands.xpBonus);
        events.emit('print', `ajoute un peu d'XP à ${message.userName} 💰. Merci pour les œufs.`);
        break;

      case 'dcc6c33a-a7a9-4051-a0f9-268f1cc2dbed' : // xp jackpot
        xpCommands.processBonus(message.userName, xpCommands.xpJackpot);
        events.emit('print', `ajoute un paquet d'XP à ${message.userName}. Premier arrivé, premier servi ! 🏆`);
        break;
    }                              
  });

  const bitsListener = await pubSubClient.onBits(userId, (message) => {
    var message = '';

    if (message.bits <= 1) 
    {
      message = `remercie robotiquement ${message.userName} pour son coup de bit.`;
    } 
    else 
    {
      message = `remercie robotiquement ${message.userName} pour ses ${message.bits} coups de bit.`;
    }
    
    events.emit('print', message + ` Déjà ${message.totalBits} au total, merci <3`);
  });

  const subListener = await pubSubClient.onSubscription(userId, (message) => {
    events.emit('print', `s'incline gauchement devant ${message.userName}. Déjà ${message.months} mois de support, merci <3`);
  });
}

module.exports = {
  main
};