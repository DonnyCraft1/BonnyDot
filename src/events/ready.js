const config = require('../config.json');
const chalk = require('chalk');
module.exports = client => {
	var games = ['with bug zapper!', config.prefix + 'help', 'Recooding myself!', 'minecraft v/1.0', 'with your mom', 'not OverWatch'];
	var statuses = ['dnd', 'idle', 'online'];
	console.log(chalk.bgGreen.black('I\'m Online'));
	client.user.setGame('BOOTING!');
	setInterval(function() {
	client.user.setStatus(statuses[Math.floor(Math.random()*statuses.length)])
  client.user.setGame(games[Math.floor(Math.random()*games.length)]);
}, 60000);
}
