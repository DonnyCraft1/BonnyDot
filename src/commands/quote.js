const Discord = require('discord.js');
exports.run = (inp) => {
  let quoteGuild;
  let quoteChannel;
  let quoteMsg;

  if (inp.args[1]) {
    quoteChannel = inp.message.guild.channels.find('name', inp.args[1]);
    if (!quoteChannel) quoteChannel = inp.message.guild.channels.get(inp.args[1]);
  }

  if (!quoteChannel) quoteChannel = inp.message.channel;
  quoteMsg = quoteChannel.fetchMessage(inp.args[0]).then((msg) => {
    let embed = new Discord.RichEmbed();
    embed.addField('Content', (msg.content) ? msg.content : '*Huh, this message has no content...*', false);
    embed.setTimestamp(msg.createdAt);
    embed.setFooter(msg.author.username, msg.author.avatarURL);
    embed.setColor('#11f1f8')
    inp.message.channel.send({embed});
  }).catch((err) => {
    inp.message.channel.send('The message was not found!');
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
  syntax: '<message id> [channel name or id]',
  timeout: 5000,
  aliases: ['copy'],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  },
  category: 'Util'
}
