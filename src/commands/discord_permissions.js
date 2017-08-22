const Discord = require('discord.js');
exports.permissions = {
  channel: [
    'CREATE_INSTANT_INVITE',
    'MANAGE_CHANNELS',
    'ADD_REACTIONS',
    'READ_MESSAGES',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'USE_EXTERNAL_EMOJIS'
  ],
  guild: [
    'ADMINISTRATOR',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'VIEW_AUDIT_LOG',
    'MANAGE_GUILD',
    'MENTION_EVERYONE',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS'
  ]
}
exports.run = (inp) => {
  let embed = new Discord.RichEmbed();
  embed.setColor('#3388ee')
  embed.setTitle('Here are all the valid Discord permissions!');
  embed.setDescription(exports.permissions.channel.concat(exports.permissions.guild).join('\n'));
  inp.message.channel.send({embed});
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
  desc: 'Get a list of all the discord permissions',
  syntax: '',
  timeout: 0,
  aliases: [],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  },
  category: 'Util'
}
