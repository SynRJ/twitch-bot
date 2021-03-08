const { Client } = require('@elastic/elasticsearch')
const config = require('./config');
const utils = require('./utils');
const moment = require('moment');
const message_index = 'live_message';
const command_index = 'live_command';
const xp_index = 'live_xp';

const client = new Client({ node: config.elastic.host })

async function indexChatMessage(user, command, category)
{
  await client.index({
    index: message_index,
    body: {
      live_date: moment.now(),
      category: category,
      user: user,
      command: command
    }
  });
}

async function indexXP(users)
{
  if (users.length <= 0)
  {
    return;
  }

  var userNames = [];
  var updates = [];

  users.forEach(user => {
    userNames.push(user.name);
  });

  const { body } = await client.search({
    index: xp_index,
    body: {
      query: {
        terms: { user: userNames }
      },
      size: 5000
    }
  });

  users.forEach(user => {
    if (user.xp != 0)
    {
      var picked = body.hits.hits.find(hit => hit._id === user.name);
      if (picked != undefined)
      {
        updates.push({ update: { _index: xp_index, _id: user.name } })
        updates.push({ doc: { xp: user.xp + picked._source.xp, is_active: user.is_active }})
      }
      else
      {
        updates.push({ index: { _index: xp_index, _id: user.name } })
        updates.push({ xp: user.xp, user: user.name, is_active: user.is_active })
      }
    }
  });

  if (updates.length > 0)
  {
    const { body: bulkResponse } = await client.bulk({
      body: updates
    });
    
    if (bulkResponse.errors != false)
    {
      console.log(JSON.stringify(bulkResponse));
    }
  }
}

async function xpOverview()
{
  try {
    const { body } = await client.search({
      index: xp_index,
      body: {
        size: 5000,
        query: {
          bool: {
            must: [       
              {
                range: {
                  xp: {
                    gt: 400
                  }
                }
              },              
              {
                match: {
                  is_active: true
                }
              }
            ]
          }
        },
        sort: [
          { xp: "desc" }
        ]
      }
    });
    
    return body.hits.hits;
  }
  catch (ex)
  {
    console.log(ex);
  }
}

async function xpUser(user)
{
  try {
    const { body } = await client.search({
      index: xp_index,
      body: {
        size: 5000,
        sort: [
          { xp: "desc" }
        ]
      }
    });

    var picked = body.hits.hits.find(hit => hit._source.user == user);
    if (picked == undefined)
    {
      return `secoue la tête. Il ne parvient pas à trouver ${user} dans le classement.`;
    }

    var rank = body.hits.hits.map(function(e) { return e._source.user; }).indexOf(user) + 1;

    var xp = picked._source.xp;
    var level = utils.getLevel(xp);
    var emoji = utils.getRankEmoji(rank);
    var rankTitle = utils.getRank(level);

    return `${emoji} Rang ${rank} ${emoji} ${rankTitle} ${user} - (niveau ${level} - ${xp} xp)`;
  }
  catch (ex)
  {
    console.log(ex);
  }
}

async function xpTop()
{
  try {
    const { body } = await client.search({
      index: xp_index,
      body: {
        size: 3,
        sort: [
          { xp: "desc" }
        ]
      }
    });
    
    var hits = body.hits.hits;
    var response = '';

    if (hits.length >= 1)
    {
      var level = utils.getLevel(hits[0]._source.xp);
      response += `🥇 #1 ${hits[0]._source.user} (niveau ${level})`
    }

    if (hits.length >= 2)
    {
      var level = utils.getLevel(hits[1]._source.xp);
      response += `, 🥈 #2 ${hits[1]._source.user} (niveau ${level})`
    }

    if (hits.length >= 3)
    {
      var level = utils.getLevel(hits[2]._source.xp);
      response += `, 🥉 #3 ${hits[2]._source.user} (niveau ${level})`
    }

    return response;
  }
  catch (ex)
  {
    console.log(ex);
  }
}

async function userStats(user)
{
  const { body } = await client.search({
    index: message_index,
    body: {
      query: {
        match: { user: user }
      },
      aggs: {
        commands: {
          terms: {
            field: 'command',
            size: 1,
            order: {
              _count: 'desc'
            }
          }
        }
      }
    }
  });
  
  var count = body.hits.total.value;
  if (body.aggregations.commands.buckets.length > 0)
  {
    var command = body.aggregations.commands.buckets[0].key;
    return `${user} a envoyé ${count} messages et utilise beaucoup la commande '${command}'. Chacun son truc.`;
  }

  return `${user} a envoyé ${count} messages et n'a jamais utilisé de commande. Feignasse.`;
}

async function top()
{
  const { body } = await client.search({
    index: message_index,
    body: {
      aggs: {
        commands: {
          terms: {
            field: 'command',
            size: 3,            
            order: {
              _count: 'desc'
            }
          }
        },        
        users: {
          terms: {
            field: 'user',
            size: 3,            
            order: {
              _count: 'desc'
            }
          }
        }
      }
    }
  });

  var commands = [];
  var users = [];

  body.aggregations.commands.buckets.forEach(element => {
    commands.push(`${element.key} (${element.doc_count})`);
  });

  body.aggregations.users.buckets.forEach(element => {
    users.push(`${element.key} (${element.doc_count})`);
  });

  return `Commandes les plus utilisées : ${commands.join(", ")}. Utilisateurs les plus actifs : ${users.join(", ")}`;
}

async function fetchCommands(category)
{
  const { body } = await client.search({
    index: command_index,
    body: {
      query: {
        match: { category: category }
      },
      size: 1000
    }
  });
  
  var commands = {};

  body.hits.hits.forEach(hit => {
    commands[hit._source.command] = hit._source.file;
    hit._source.aliases.forEach(alias => {
      commands[alias] = hit._source.file;
    });
  });

  return commands;
}

module.exports = {
  indexChatMessage,
  userStats,
  top,
  fetchCommands,
  indexXP,
  xpUser,
  xpTop,
  xpOverview,
};