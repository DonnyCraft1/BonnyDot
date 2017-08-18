exports.run = (inp) => {
  inp.message.channel.send('This is just a basic command!');
}
exports.data = {
  permFlags: {
    channel: [],
    guild: []
  },
  onlyDev: false,
  help: 'This command is here to blah blah blah.',
  syntax: '<required1> <required2> [optional]',
  aliases: ['testing']
}
