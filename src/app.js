const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
require('./util/eventLoader')(client);

client.login(config.token);

//This is new!
