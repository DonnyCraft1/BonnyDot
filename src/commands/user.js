const Discord = require('discord.js');
const Moment = require('moment');
exports.run = (inp) => {
  let embed = new Discord.RichEmbed();
  function createEmbed (member) {
    embed.setImage(member.user.avatarURL);
    embed.addField('Date now', Moment(Date.now()).format('DD.MM.YYYY hh:mm:ss'), 'true');
    embed.addField('Account created', Moment(member.user.createdTimestamp).format('DD.MM.YYYY hh:mm:ss'), 'true');
    embed.addField('Joined this server', Moment(member.joinedTimestamp).format('DD.MM.YYYY hh:mm:ss'), 'true');
    embed.addField('ID', member.user.id, 'true');
    embed.addField('Username', member.user.username, 'true');
    embed.addField('Nickname', (member.nickname) ? member.nickname : '*This user has no nickname set*', 'true');
    embed.addField('Discriminator', member.user.discriminator, 'true');
    embed.addField('Status', member.user.presence.status, 'true');
    embed.addField('Game playing', (member.user.presence.game) ? member.user.presence.game : '*This user does not play any games at the moment*', 'true');
    embed.addField('Bot or user',  (member.user.bot) ? 'This user is a bot' : 'This user is __not__ a bot', 'true');
    embed.addField('Highest role', member.highestRole.name, true);
    embed.addField('Last message sent ID', (member.lastMessageID) ? member.lastMessageID : '*It doesn\'t seem like the user has sent any messages in here*', true);
    embed.addField('Voice channel', (member.voiceChannelID) ? member.guild.channels.get(member.voiceChannelID).name : '*This user is not in a voice channel*');
  }
  let member;
  member = inp.result.match(/<@!?\d+>/i);
  if (member) {
    member = inp.message.guild.members.get(member[0].replace(/<@!?/, '').replace(/>/, ''));
    if (!member) return(inp.message.channel.send('Invalid mention!'));
    createEmbed(member);
    inp.message.channel.send({embed});
    return;
  }

  member = inp.message.guild.members.find((memb) => memb.user.username === inp.result);
  if (member) {
    createEmbed(member);
    inp.message.channel.send({embed});
    return;
  }

  member = inp.message.guild.members.find((memb) => memb.nickname === inp.result);
  if (member) {
    createEmbed(member);
    inp.message.channel.send({embed});
    return;
  }

  member = undefined;
    inp.message.guild.fetchMember(inp.result).then((memb) => {
      createEmbed(memb);
      inp.message.channel.send({embed});
      return;
    }).catch(() => {
      inp.message.channel.send('I did not find that user!');
      return;
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
  desc: 'Get information about a user. if no user provided, information about yourself is given! If it doesnt find the user, try with the user ID.',
  syntax: '[user mention | username | nickname | user id]',
  timeout: 5000,
  aliases: ['userinfo', 'userinformation'],
  blocked: {
    guilds: {},
    users: {}
  },
  category: 'Util'
}
