const chalk = require('chalk');
const config = require('../config.json');
const fs = require('fs');

let timeouts = {};
module.exports = (client, dbConnection, message) => {
	let lang;
	let prefix;
	dbConnection.query('SELECT * FROM guilds WHERE id = ?', message.guild.id, (err2, rows2) => {
		dbConnection.query('SELECT * FROM users WHERE id = ?', message.author.id, (err3, rows3) => {
		if (err2) {
			console.log(err2);
			message.channel.send('An error occured!');
			return;
		}
		if (err3) {
			console.log(err3);
			message.channel.send('An error occured!');
			return;
		}

		if (!rows3[0]) {
			dbConnection.query('INSERT INTO users (id, vault, points, level) VALUE (?, 0, 0, 0)', message.author.id, (err2) => {
        if (err2) {
          message.channel.send('An error occured!');
          console.log('err2: ' + err2);
          return;
        }
      });
		} else if (rows3[0].points === undefined) {
			dbConnection.query('UPDATE users SET points=0 WHERE id=?', message.author.id, (err3) => {
        if (err3) {
          message.channel.send('An error occured!');
          console.log('err3: ' + err3);
          return;
        }
      });
		} else {
			dbConnection.query('UPDATE users SET points=' + dbConnection.escape(rows3[0].points + 1) + ' WHERE id=?', message.author.id, (err4) => {
				if (err4) {
          message.channel.send('An error occured!');
          console.log('err4: ' + err4);
          return;
        }
				if (rows3[0].points + 1 > (rows3[0].level + 1) * 500) {
					dbConnection.query('UPDATE users SET points=0, level=' + (rows3[0].level + 1) + ' WHERE id=?', message.author.id, (err5) => {
						if (err5) {
		          message.channel.send('An error occured!');
		          console.log('err5: ' + err5);
		          return;
		        }
						message.channel.send(message.author + ' has risen their level to lvl ' + (rows3[0].level + 1) + ' and earned `$' + 100 * (rows3[0].level + 1) + '`');
						dbConnection.query('UPDATE users SET vault=' + (rows3[0].vault + (100 * (rows3[0].level + 1))) + ' WHERE id=?', message.author.id, (err6) => {
							if (err6) {
			          message.channel.send('An error occured!');
			          console.log('err6: ' + err6);
			          return;
			        }
						});
					});
				}
			});
		}

		if (rows2[0]) {
			lang = rows2[0].language;
			prefix = rows2[0].prefix;
		} else {
			lang = 'en';
			prefix = config.prefix;
		}

		const args = message.content.slice(prefix.length).split(/\s+/g).slice(1);
		const result = args.join(' ');
		const command = message.content.substring(prefix.length, message.content.length - result.length).replace(/\s+/g, '');



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

		if (message.content.startsWith(config.prefix + 'prefix')) {
			prefix = config.prefix;
		} else {
		if (!message.content.startsWith(prefix)) {
		return;
	}
}



		if (!allCommands.has(command)) return(message.channel.send('Sorry, that command does not exist!'));
				//THE COMMAND EXIST!


		if (!command) return;
		if(!message.member) return(message.channel.send('Ew, please use my commmands in a guild!'));

		console.log(chalk.bgCyan.black('By ' + message.author.username) + '\n' + message.content + '\n\nGuild: ' + message.guild.name + '\nChannel: ' + message.channel.name);



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


		//If check syntax, check syntax

		if (!cmdFile.data.ignoreSyntax) {

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
	}

		//Call the command
		cmdFile.run({
			allCommands: allCommands,
			prefix: prefix,
			lang: lang,
			dbConnection: dbConnection,
			client: client,
			message: message,
			args: args,
			result: result,
			config: config
		});
	});
});
};
