const chalk = require('chalk');
const config = require('../config.json');
const fs = require('fs');

let timeouts = {};
module.exports = (client, dbConnection, message) => {
	let lang;
	let prefix;
	dbConnection.query('SELECT * FROM guilds WHERE id = ?', message.guild.id, (err, rows) => {
		if (err) console.log(err);
		if (rows[0]) {
			lang = rows[0].language;
			prefix = rows[0].prefix;
		} else {
			lang = 'en';
			prefix = config.prefix;
		}

		if (message.content.startsWith(config.prefix + 'prefix')) {
			prefix = config.prefix;
		} else {
		if (!message.content.startsWith(prefix)) {
		return;
	}
}
	console.log('Prefix: \'' + prefix + '\'');


		const args = message.content.slice(prefix.length).split(/\s+/g).slice(1);
		const result = args.join(' ');
		const command = message.content.substring(prefix.length, message.content.length - result.length).replace(/\s+/g, '');
		console.log('cmd: \'' + command + '\'');
		console.log('result: ' + result);
		if (!command) return;
		if(!message.member) return(message.channel.send('Ew, please use my commmands in a guild!'));

		console.log(chalk.bgCyan.black('By ' + message.author.username) + '\n' + message.content + '\n\nGuild: ' + message.guild.name + '\nChannel: ' + message.channel.name);

		let commandsList = fs.readdirSync('./commands/');
		commandsList.forEach((file, index) => {
			if (!file.match(/\.js$/)) commandsList.splice(index, 1);
		});
		let allCommands = new Map();

		function removeJS (value) {
			return value.replace(/\.js$/, '');
		};

		commandsList.forEach((cmdName, index) => {
			allCommands.set(removeJS(cmdName), removeJS(cmdName));
			let aliases = require(`../commands/${cmdName}`).data.aliases;
			aliases.forEach((alias, index2) => allCommands.set(removeJS(alias), removeJS(cmdName)));
		});
			if (!allCommands.has(command)) return(message.channel.send('Sorry, that command does not exist!'));
			//THE COMMAND EXIST!
			let cmdFileName = allCommands.get(command);
			let cmdFile = require(`../commands/${cmdFileName}`);

			//Deny bots for the whole bot
			if (config.denyBots) {
				if (message.author.bot) return(message.channel.send('This bot doesn\'t allow bots!'));
			}

		//Deny bots for this command
		if (cmdFile.data.denyBots) {
			if (message.author.bot) return(message.channel.send('This command doesn\'t allow bots!'));
		}

		//Check if the command is disabled
		if (cmdFile.data.disabled.isDisabled) return(message.channel.send('Sorry, this command is disabled!\n__*' + cmdFile.data.disabled.reason + '*__'));

		//Check if the command is only dev
		if (cmdFile.data.onlyDev) {
			if (message.author.id !== config.devId) return(message.channel.send('This command is limited to the owner of this bot!'));
		}

		//Check if the guild is blocked for this command
		if (cmdFile.data.blocked.guilds[message.guild.id]) {
			message.channel.send('Sorry, this guild is blocked from this command!\n\nReason: __*' + cmdFile.data.blocked.guilds[message.guild.id] + '*__')
			return;
		}

		//Check if the user is blocked for this command
		if (cmdFile.data.blocked.users[message.author.id]) {
			message.channel.send('Sorry, your are blocked from this command!\n\nReason: __*' + cmdFile.data.blocked.users[message.author.id] + '*__')
			return;
		}

		//Check if the guild is blocked for the whole bot
		if (config.blocked.guilds[message.guild.id]) {
			message.channel.send('Sorry, this guild is blocked from the whole bot!\n\nReason: __*' + config.blocked.guilds[message.guild.id] + '*__')
			return;
		}

		//Check if the user is blocked for the whole bot
		if (config.blocked.users[message.author.id]) {
			message.channel.send('Sorry, your are blocked from the whole bot!\n\nReason: __*' + config.blocked.users[message.author.id] + '*__')
			return;
		}

		//Check if author has all required perms
		let missingPerms = [];

		let channelPermsFor = message.channel.permissionsFor(message.author);
		cmdFile.data.permFlags.channel.forEach((perm, index) => {
			if (!channelPermsFor.has(perm)) missingPerms.push(cmdFile.data.permFlags.channel[index]);
		});
		cmdFile.data.permFlags.guild.forEach((perm, index) => {
			if (!message.member.hasPermission(perm)) missingPerms.push(cmdFile.data.permFlags.guild[index]);
		});

		//If author does not have all required perms, return MISSING PERMS!
		if (missingPerms.length > 0) {
			message.channel.send('__**Missing permissions!**__\n\n:poop: ' + missingPerms.join('\n:poop: '));
			return;
		}
		//HAVE THE RIGHT PERMS

		//Check timeout!
		if (!timeouts[cmdFileName]) timeouts[cmdFileName] = [];
		if (timeouts[cmdFileName].includes(message.author.id)) {
			message.channel.send('Please wait! This command has a cooldown of `' + cmdFile.data.timeout / 1000 + 's`');
			return;
		}

		//If the command has a timeout
		if (cmdFile.data.timeout > 0) {
			timeouts[cmdFileName].push(message.author.id);
			setTimeout(() => {
				timeouts[cmdFileName].splice(timeouts[cmdFileName].indexOf(message.author.id), 1);
			}, cmdFile.data.timeout)
		}



		//Check syntax
		let syntax = {};
		syntax.required = cmdFile.data.syntax.match(/<[^>]*>/g);
		syntax.optional = cmdFile.data.syntax.match(/\[[^\]]*]/g);

		//Return if not enough args is specifyed!
		if (syntax.required) {
			if (args.length < syntax.required.length) {
				message.channel.send('Not enough args spesifyed!\n\n__Syntax:__ `' + prefix + command + ' ' + cmdFile.data.syntax + '`');
				return;
			}
		}

		//Call the command
		cmdFile.run({
			prefix: prefix,
			lang: lang,
			dbConnection: dbConnection,
			client: client,
			message: message,
			args: args,
			result: result,
			config: config
		});
	})
};
