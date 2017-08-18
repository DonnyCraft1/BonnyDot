exports.run = (inp) => {
  inp.message.channel.send('This is just a basic command!');
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
  help: 'This command is here to blah blah blah.',
  syntax: '<required1> <required2> [optional]',
  timeout: 0,
  aliases: ['testing'],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {'162948860782575617': 'Some special reason!'}
  }
}
