exports.run = (inp) => {
  var originalLink = 'https://lmgtfy.com/?q=';
  var input = inp.result.replace(RegExp(/\s+/g), '+');
  inp.message.channel.send(originalLink + input);
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
  desc: 'Perfectly for showing people "You can google it!"',
  syntax: '',
  timeout: 2000,
  aliases: ['howtogoogle', 'search'],
  blocked: {
    guilds: {},
    users: {}
  },
  category: 'Fun'
}
