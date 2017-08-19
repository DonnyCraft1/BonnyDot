const Discord = require('discord.js');
exports.run = (inp) => {
  let quoteChannel;
  let quoteMsg;
  if (inp.args[1]) {
    quoteChannel = inp.message.guild.channels.find('name', inp.args[1]);
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
  syntax: '<message id> [channel name]',
  timeout: 50000,
  aliases: ['copy'],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  }
}
