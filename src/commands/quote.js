const Discord = require('discord.js');
exports.run = (inp) => {
  let quoteChannel;
  let quoteMsg;
  if (args[1]) {
    let quoteChannel = inp.message.guild.channels.find('name', args[1]);
  }
  if (!quoteChannel) quoteChannel = inp.message.channel;
  quoteMsg = quoteChannel.fetchMessage(args[0]).then((msg) => {
    let embed = new Discord.RichEmbed();
    embed.setImage(msg.author.avatarURL);
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
  timeout: 10000,
  aliases: [],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  }
}
