let types = ['message', 'pm', 'addroles', 'removeroles', 'toggleroles']
let defaults = {
  type: 'message',
  syntax: '',
  value: 'Please change this message! Or it will stay as is',
  permissions: 'MANAGE_GUILD'
};
exports.run = (inp) => {
  if (!inp.args[0]) inp.message.channel.send('Wrong syntax!\n\nSyntax: `' + exports.data.syntax + '`');
  switch(inp.args[0]) {
    case 'create':
    if (!inp.args[1]) {
      inp.message.channel.send('Please provide a name for the command you\'re about to create!');
      return;
    }
    inp.dbConnection.query(`SELECT name FROM customcmds WHERE name="?" AND guild="${inp.message.guild.id}"`, inp.args[1], (err1, rows1) => {
      if (err1) {
        inp.message.channel.send('An error occured!');
        console.log('err1: ' + err1);
        return;
      }
      if (rows1[0]) {
        inp.message.channel.send('This command does already exist! But you\'re fine though, i did not overwrite it!');
        return;
      }
        inp.dbConnection.query(`INSERT INTO customcmds (type, guild, creator, syntax, value, timestamp, permissions, name, channel) VALUES ("${defaults.type}", "${inp.message.guild.id}", "${inp.message.author.id}","${defaults.syntax}" , "${defaults.value}", "${Math.round(+new Date()/1000).toString()}","${defaults.permissions}" , "${inp.dbConnection.escape(inp.args[1])}", "${inp.message.channel.id}")`, err2 => {
        if (err2) {
          inp.message.channel.send('An error occured!');
          console.log('err2: ' + err2);
          return;
        }
        inp.message.channel.send('Command created!');
        return;
      })
    })
  }
}
exports.data = {
  permFlags: {
    channel: [],
    guild: ['MANAGE_GUILD']
  },
  denyBots: true,
  onlyDev: false,
  disabled: {
    isDisabled: false,
    reason: ''
  },
  desc: '',
  syntax: '<create <name> | delete <name> | settype <name> <type> | setsyntax <name> <syntax> | setperms <name> <permission;permission;permission...> | setvalue <name> <value> | list>',
  ignoreSyntax: true,
  timeout: 0,
  aliases: ['custom_commands', 'ccmds'],
  blocked: {
    guilds: {},
    users: {}
  },
  category: 'Customisation'
}
