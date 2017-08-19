const config = require('../config.json');
const chalk = require('chalk');
module.exports = client => {
	let games = [config.prefix + 'help', 'prefix: ' + config.prefix];
	console.log(chalk.bgGreen.black('I\'m Online'));
	client.user.setStatus('idle');
	setInterval(() => {
  	client.user.setGame(games[Math.floor(Math.random()*games.length)]);
},60000)}
