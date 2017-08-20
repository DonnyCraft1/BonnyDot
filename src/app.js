const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')
const mysql = require('mysql');

const connection = mysql.createConnection(config.db.connection);
connection.connect();

require('./util/eventLoader')(client, connection);

client.login(config.token);
