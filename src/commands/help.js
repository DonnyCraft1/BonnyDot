const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config.json');
exports.run = (inp) => {
  let command = inp.args[0];

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
		if (!allCommands.has(command)) return(inp.message.channel.send('Sorry, that command does not exist!'));

    let cmdFileName = allCommands.get(command);
		let cmdFile = require(`../commands/${cmdFileName}`);

  let embed = new Discord.RichEmbed();

  let AllPermsRequired = cmdFile.data.permFlags.guild.concat(cmdFile.data.permFlags.channel).join(', ');

  embed.setColor('#e5228a');
  embed.addField('Description', cmdFile.data.desc, false);
  embed.addField('Permissions required', (AllPermsRequired) ? AllPermsRequired : '*none*', false);
  embed.addField('Bots denied', cmdFile.data.denyBots, false);
  embed.addField('Only developer', cmdFile.data.onlyDev, false);
  embed.addField('Command disabled', (cmdFile.data.disabled.isDisabled) ? 'true: ' + cmdFile.data.disabled.reason : 'false');
  embed.addField('Syntax', config.prefix + command + ' ' + cmdFile.data.syntax, false);
  embed.addField('Cooldown', (cmdFile.data.timeout / 1000) + ' seconds', false);
  embed.addField('Aliases', (cmdFile.data.aliases.join(', ')) ? cmdFile.data.aliases.join(', ') : '*none*', false);
  embed.setThumbnail(inp.message.author.avatarURL);

  inp.message.channel.send({embed});
}
exports.data = {
  permFlags: {
    channel: ['MANAGE_MESSAGES'],
    guild: ['ADMINISTRATOR']
  },
  denyBots: true,
  onlyDev: false,
  disabled: {
    isDisabled: false,
    reason: ''
  },
  desc: 'Get information and help for a command',
  syntax: '<command name>',
  timeout: 0,
  aliases: ['info'],
  blocked: {
    guilds: {},
    users: {}
  }
}
