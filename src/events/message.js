const chalk = require('chalk');
const config = require('../config.json');
const fs = require('fs');
module.exports = message => {


	if (!message.content.startsWith(config.prefix)) return;
	//if (message.author.bot) return;
	//if (!message.author.id === config.devId) return(message.channel.send('Sorry! the commands is only avalible for Donny_Craft!'));

	console.log(chalk.bgCyan.black('By ' + message.author.username) + '\n' + message.content + '\n\nGuild: ' + message.guild.name + '\nChannel: ' + message.channel.name);

	const args = message.content.split(' ');
	const command = args.shift().slice(config.prefix.length).toLowerCase();
	const result = args.join(' ');

	if (!command) return;
	let commandsList = fs.readdirSync('./commands/');
	commandsList.forEach((item, index) => {
		if (!item.match(/\.js$/)) commandsList.splice(index, 1);
	});
	let allCommands = new Map();

	function removeJS (value) {
		return value.replace(/\.js$/, '');
	};

	commandsList.forEach((item, index) => {
		allCommands.set(removeJS(item), removeJS(item));
		let aliases = require(`../commands/${item}`).data.aliases;
		aliases.forEach((item2, index2) => allCommands.set(removeJS(item2), removeJS(item)));
	});
		if (!allCommands.has(command)) return(message.channel.send('Sorry, that command does not exist!'));
		//THE COMMAND EXIST!
	let cmdFile = require(`../commands/${allCommands.get(command)}`);

	//Check if the command is disabled
	if (cmdFile.data.disabled) return(message.channel.send('Sorry, this command is disabled!'));

	//Check if the command is only dev
	if (cmdFile.data.onlyDev) {
		if (message.author.id !== config.devId) return(message.channel.send('This command is limited to the owner of this bot!'));
	}

	//Check if author has all required perms
	let missingPerms = [];

	let channelPermsFor = message.channel.permissionsFor(message.author);
	cmdFile.data.permFlags.channel.forEach((item, index) => {
		if (!channelPermsFor.has(item)) missingPerms.push(cmdFile.data.permFlags.channel[index]);
	});
	cmdFile.data.permFlags.guild.forEach((item, index) => {
		if (!message.member.hasPermission(item)) missingPerms.push(cmdFile.data.permFlags.guild[index]);
	});

	//If author does not have all required perms, return MISSING PERMS!
	console.log(missingPerms);
	if (missingPerms.length > 0) {
		message.channel.send('__**Missing permissions!**__\n\n* ' + missingPerms.join('\n* '));
		return;
	}
	//HAVE THE RIGHT PERMS


	//CALL THE COMMAND
	cmdFile.run({
		message: message,
		args: args,
		result: result,
		config: config
	});

};
