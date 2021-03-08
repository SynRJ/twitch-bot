const rp = require('request-promise');
const db = require('./db');
const utils = require('./utils');
const vars = require('./vars');
const config = require('./config');
const moment = require('moment');

var users = [];
var overview = [];

const xpPerTick = 1;
const xpPerMessage = 10;
const xpBonus = 100;
const xpJackpot = 300;
const messageTimeout = 30;

function processTick()
{
  return rp({
    uri: config.api.chatters,
    json: true
  })
  .then(data => {
    var vips = data.chatters.vips;
    var moderators = data.chatters.moderators;
    var viewers = data.chatters.viewers;

    var all = vips.concat(moderators);
    all = all.concat(viewers);

    all.forEach(userName => 
    {
      if (vars.bots.indexOf(userName) >= 0)
      {
        return;
      }

      var picked = users.find(o => o.name === userName);

      if (picked == undefined)
      {
        users.push(new XPUser(userName));
      }
      else 
      {
        picked.xp += xpPerTick;
      }
    });    

    sendToDb();
  })
  .catch(err => {
    console.log(err);
  })
}

function processBonus(userName, xp)
{
  var picked = users.find(o => o.name === userName);
  if (picked == undefined)
  {
    picked = new XPUser(userName);
    users.push(picked);
  }

  picked.xp += xp;
}

function processMessage(userName, command, type)
{
  db.indexChatMessage(userName, command, type);
  
  if (vars.bots.indexOf(userName) >= 0)
  {
    return;
  }

  var picked = users.find(o => o.name === userName);
  if (picked == undefined)
  {
    picked = new XPUser(userName);
    users.push(picked);
  }

  picked.addMessage();
}

function sendToDb()
{
  db.indexXP(users).then(function() {
    users.forEach(user => 
    {    
      user.xp = 0;
    });
  }).catch(function(err) {
    console.log(err);
  });
}

function initOverview()
{
  db.xpOverview().then(function(hits) {
    hits.forEach(hit =>
      {
        var level = utils.getLevel(hit._source.xp);
        overview.push({ user: hit._source.user, level: level });
      });
  });
}

function getXpOverview()
{
  var updates = [];

  db.xpOverview().then(function(hits) {
    hits.forEach(hit =>
    {
      var picked = overview.find(f => f.user == hit._source.user);
      var level = utils.getLevel(hit._source.xp);
      
      if (picked != undefined)
      {
        if (picked.level != level)
        {
          updates.push(`${hit._source.user} (niveau ${level})`);
          picked.level = level;
        }
      }
      else 
      {
        overview.push({ user: hit._source.user, level: level })
        updates.push(`${hit._source.user} (niveau ${level})`);
      }
    });
    
    if (updates.length > 0)
    {
      events.emit('print', '🔥 Level up ! ' + updates.join(', ') + ' 🔥');
    }
  });
}

class XPUser {
  constructor(name) {
    this.name = name;
    this.lastMessage = null;
    this.xp = xpPerTick;
    this.is_active = null;
  }
  addMessage()
  {
    this.is_active = true;
    if (this.lastMessage == null)
    {
      this.xp += xpPerMessage;
      this.is_active = true;
      this.lastMessage = moment.now(); 
    }
    else 
    {
      var now = moment.now();
      var diff = moment(now).diff(moment(this.lastMessage), 'seconds');
  
      if (diff >= messageTimeout)
      {
        this.xp += xpPerMessage;
        this.lastMessage = moment.now(); 
      }
    }
  }
}

module.exports = {
  processTick,
  processMessage,
  processBonus,
  getXpOverview,
  initOverview,
  xpJackpot,
  xpBonus,
};