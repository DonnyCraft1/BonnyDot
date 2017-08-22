let types = ['message', 'pm', 'addroles', 'removeroles', 'toggleroles']
const Discord = require('discord.js');
let defaults = {
  type: 'message',
  syntax: '',
  value: 'Please change this message! Or it will stay as is',
  permissions: 'MANAGE_GUILD'
};
exports.run = (inp) => {
  if (inp.args[1]) {
  inp.args[1] = inp.args[1].toLowerCase();
}
if (inp.args[2]) {
inp.args[2] = inp.args[2].toLowerCase();
}
  if (!inp.args[0]) inp.message.channel.send('Wrong syntax!\n\nSyntax: `' + exports.data.syntax + '`');
  switch(inp.args[0]) {
    case 'create':
    if (!inp.args[1]) {
      inp.message.channel.send('Please provide a name for the command you\'re about to create!');
      return;
    }
    inp.dbConnection.query(`SELECT name FROM customcmds WHERE name=? AND guild="${inp.message.guild.id}" AND deleted=0`, inp.args[1], (err1, rows1) => {
      if (err1) {
        inp.message.channel.send('An error occured!');
        console.log('err1: ' + err1);
        return;
      }
      if (rows1[0]) {
        inp.message.channel.send('This command does already exist! But you\'re fine though, i did not overwrite it!');
        return;
      }
        inp.dbConnection.query(`INSERT INTO customcmds (type, guild, creator, syntax, value, timestamp, permissions, name, channel) VALUES ("${defaults.type}", "${inp.message.guild.id}", "${inp.message.author.id}","${defaults.syntax}" , "${defaults.value}", "${Math.round(+new Date()/1000).toString()}","${defaults.permissions}" , ${inp.dbConnection.escape(inp.args[1])}, "${inp.message.channel.id}")`, err2 => {
        if (err2) {
          inp.message.channel.send('An error occured!');
          console.log('err2: ' + err2);
          return;
        }
        inp.message.channel.send('Command created with the name ' + inp.dbConnection.escape(inp.args[1]) + '!');
      });
    });
    break;
    case 'delete':
    if (!inp.args[1]) {
      inp.message.channel.send('Please provide a name for the command you\'re about to delete!');
      return;
    }
    inp.dbConnection.query(`SELECT name, id FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
      if (err1) {
          inp.message.channel.send('An error occured!');
          console.log('err1: ' + err1);
        return;
      }

      if (!rows1[0]) {
        inp.message.channel.send('I did not delete that command, but it is not here anymore. Guess why? It did not exist!')
        return;
      }
      inp.dbConnection.query(`UPDATE customcmds SET deleted = 1, deletedby = "${inp.message.author.id}" WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}"`, (err2, rows2) => {
        if (err2) {
            inp.message.channel.send('An error occured!');
            console.log('err2: ' + err2);
          return;
        }
        inp.message.channel.send('Successfully deleted the command ' + inp.dbConnection.escape(inp.args[1]) + '!\n\nIf this was a mistake, please ask my developer to recover the command, and give him the reason why! Please copy and paste this to him:\n```\nID: ' + rows1[0].id + '\n```');
      });
    })
    break;
    case 'permanent_delete':
    if (!inp.args[1]) {
      inp.message.channel.send('Please provide a name for the command you\'re about to permanently delete!');
      return;
    }
    inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
      if (err1) {
          inp.message.channel.send('An error occured!');
          console.log('err1: ' + err1);
        return;
      }

      if (!rows1[0]) {
        inp.message.channel.send('I did not delete that command, but it is not here anymore. Guess why? It did not exist!')
        return;
      }

      if (!inp.message.member.permissions.has('ADMINISTRATOR') && !inp.message.author.id(rows1[0].creator)) {
        inp.message.channel.send('Missing permission to delete this command permanently! You need to either have administrator privileges or be the one who created the command!');
        return;
      }
      inp.dbConnection.query(`DELETE FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}"`, (err2, rows2) => {
        if (err2) {
            inp.message.channel.send('An error occured!');
            console.log('err2: ' + err2);
          return;
        }
        inp.message.channel.send('Successfully deleted the command ' + inp.dbConnection.escape(inp.args[1]) + ' permanently! This action can not be undone! (Privacy first :slight_smile: )');
      });
    })
    break;
    case 'copy':
    if (!inp.args[1]) {
      inp.message.channel.send('Please provide the name of the command you want to copy!');
      return;
    }
    if (!inp.args[2]) {
      inp.message.channel.send('Please provide a name for the new command!');
      return;
    }
    inp.dbConnection.query(`SELECT * FROM customcmds WHERE guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
      if (err1) {
        inp.message.channel.send('An error occured!');
        console.log('err1: ' + err1);
        return;
      }
      let fromExist = false;
      let toExist = false;
      rows1.forEach((row) => {
      if(row.name === inp.args[1]) fromExist = true;
      if(row.name === inp.args[2]) toExist = true;
    })
    if (!fromExist) {
      inp.message.channel.send('The command you want to copy from does not exist!');
      return;
    }
    if (toExist) {
      inp.message.channel.send('The command you want to create does already exist!');
      return;
    }
    inp.dbConnection.query(`INSERT INTO customcmds (type, guild, creator, syntax, value, timestamp, permissions, name, channel, deleted, deletedby, aliases) SELECT customcmds.type, customcmds.guild, customcmds.creator, customcmds.syntax, customcmds.value, customcmds.timestamp, customcmds.permissions, ${inp.dbConnection.escape(inp.args[2])}, customcmds.channel, customcmds.deleted, customcmds.deletedby, customcmds.aliases FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)} AND deleted=0`, (err2) => {
      if (err2) {
        inp.message.channel.send('An error occured!');
        console.log('err2: ' + err2);
        return;
      }
      inp.message.channel.send('I\'ve created a new command ( ' + inp.dbConnection.escape(inp.args[2]) + ' ) with the exact same settings as the command ' + inp.dbConnection.escape(inp.args[1]) + '!');
    });
  });
    break;
    case 'rename':
    if (!inp.args[1]) {
      inp.message.channel.send('Please provide the name of the command you want to rename!');
      return;
    }
    if (!inp.args[2]) {
      inp.message.channel.send('Please provide a new name for the command!');
      return;
    }
    inp.dbConnection.query(`SELECT * FROM customcmds WHERE guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
      if (err1) {
        inp.message.channel.send('An error occured!');
        console.log('err1: ' + err1);
        return;
      }
      let fromExist = false;
      let toExist = false;
      rows1.forEach((row) => {
      if(row.name === inp.args[1]) fromExist = true;
      if(row.name === inp.args[2]) toExist = true;
    })
    if (!fromExist) {
      inp.message.channel.send('The command you want to rename does not exist!');
      return;
    }
    if (toExist) {
      inp.message.channel.send('A command with the new name does already exist!');
      return;
    }
    inp.dbConnection.query(`UPDATE customcmds SET name=${inp.dbConnection.escape(inp.args[2])} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)} AND deleted=0`, (err2) => {
      if (err2) {
        inp.message.channel.send('An error occured!');
        console.log('err2: ' + err2);
        return;
      }
      inp.message.channel.send('I\'ve renamed the command ' + inp.dbConnection.escape(inp.args[2]) + ' to ' + inp.dbConnection.escape(inp.args[1]) + '!');
    });
  });
    break;
    case 'list':
    inp.dbConnection.query(`SELECT * FROM customcmds WHERE guild='${inp.message.guild.id}' AND deleted=0`, (err1, rows1) => {
      let embed = new Discord.RichEmbed();
      embed.setColor('#772244');
      embed.setTitle('All avalible custom commands for this guilds');
      rows1.forEach(row => {
          let authorOfCommand = (inp.message.guild.members.get(row.creator)) ? inp.message.guild.members.get(row.creator).user.username : 'I did not see the author of this command in this guild, hes id is ' + row.creator;
          embed.addField(row.name, '```\nType: ' + row.type + '\nPermissions required: ' + row.permissions.split(';').join(', ') + '\nSyntax, how many args: ' + row.syntax + '\nCreator of command: ' + authorOfCommand + '\nValue: ' + row.value + '\n```');
      });

      inp.message.channel.send({embed});
    });
    break;
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
  desc: 'Custom commads is commands you can make, that is only for your guild! Sounds fun, right?',
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
