const Discord = require('discord.js');
exports.run = (inp) => {
  let quoteGuild;
  let quoteChannel;
  let quoteMsg;
  if (inp.args[2]) {
    quoteGuild = inp.client.guilds.find('name', inp.args[2]);
    if (!quoteGuild) quoteGuild = inp.client.guilds.get(inp.args[2]);
  }

  if (!quoteGuild) quoteGuild = inp.message.guild;

  if (inp.args[1]) {
    quoteChannel = quoteGuild.channels.find('name', inp.args[1]);
    if (!quoteChannel) quoteChannel = quoteGuild.channels.get(inp.args[1]);
  }

  if (!quoteChannel) quoteChannel = inp.message.channel;
  quoteMsg = quoteChannel.fetchMessage(inp.args[0]).then((msg) => {
    let embed = new Discord.RichEmbed();
    embed.addField('Content', msg.content, false);
    embed.setTimestamp(msg.createdAt);
    embed.setFooter(msg.author.username, msg.author.avatarURL)
    inp.message.channel.send({embed});
  }).catch((err) => {
    inp.message.channel.send('Invalid id!');
  })

}
exports.data = {
  permFlags: {
    channel: [],
    guild: []
  },
  denyBots: true,
  onlyDev: false,
  disabled: {
    isDisabled: false,
    reason: ''
  },
  desc: 'Quote a message',
  syntax: '<message id> [channel name or id] [guild name or id]',
  timeout: 50000,
  aliases: ['copy'],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  }
}
