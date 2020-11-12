const { Client } = require('@elastic/elasticsearch')
const config = require('./config');
const moment = require('moment');
const message_index = 'live_message';
const command_index = 'live_command';

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
  var command = body.aggregations.commands.buckets[0].key;

  return `${user} a envoyé ${count} messages et utilise beaucoup la commande '${command}'. Chacun son truc.`;
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
  fetchCommands
};