//Add extra field for ccmds with NOT NULL, with optional other commands to be executed, but they again wont execute more commands. ccmds also need a field for
//the command to not be able to executed directly.

//Create a file for every cmd
//And make a command to get the file, that has the value of the command;

//Allowed values for action in customdelete ['delete', 'recover'];
//Check if the command is deleted:
/*
inp.dbConnection.query(`SELECT * FROM customdelete WHERE cmdId=?`, 'ID OF COMMAND', (err3, rows3) => {
  if (rows3[0]) {
    let newestAction;
    rows3.forEach((item3, i3) => {
      if (!i3 > 0) {
        newestAction = item3;
        continue;
      }
      if (item3.timestamp > newestAction.timestamp) newestAction = item3;
    });
    if (newestAction.action === 'delete') return (inp.message.channel.send('The last record says this command is deleted!'))
  }
  //Hurray, it isnt deleted
});
*/
const fs = require('fs');
let types = ['message'/*, 'pm', 'addroles', 'removeroles', 'toggleroles'*/];
////
  // if (inp.allCommands.has()) {
  //   inp.message.channel.send('This command is reserverd for the bot!');
  //   return;
  // }
////

const Discord = require('discord.js');
let defaults = {
  type: 'message',
  syntax: 0,
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
    if (inp.allCommands.has(inp.args[1])) {
    inp.message.channel.send('This command is reserverd for the bot!');
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
    if (!inp.args[2]) {
      inp.message.channel.send('Please provide a reason why you want to delete this command!');
      return;
    }
    inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}"`, (err1, rows1) => {
      if (err1) {
          inp.message.channel.send('An error occured!');
          console.log('err1: ' + err1);
        return;
      }
      if (!rows1[0]) {
        inp.message.channel.send('I did not delete that command, but it is not here anymore. Guess why? It did not exist!')
        return;
      }
      inp.dbConnection.query(`SELECT * FROM customdelete WHERE cmdId=?`, rows1[0].id, (err3, rows3) => {
        if (rows3[0]) {
          let newestAction;
          rows3.forEach((item3, i3) => {
            if (!i3 > 0) {
              newestAction = item3;
              return; //Skip this index;
            }
            if (item3.timestamp > newestAction.timestamp) newestAction = item3;
          });
          if (newestAction.action === 'delete') return (inp.message.channel.send('I did not delete that command, but it is not here anymore. Guess why? It did not exist!'))
        }
        //Hurray, it isnt deleted
      inp.dbConnection.query(`INSERT INTO customdelete (cmdId, reason, deletedBy, channel, action, timeStamp) VALUES("${rows1[0].id}", ${inp.dbConnection.escape(inp.args[2])}, "${inp.message.author.id}", "${inp.message.channel.id}", "delete", "${Math.round(+new Date()/1000).toString()}")`, (err2, rows2) => {
        if (err2) {
            inp.message.channel.send('An error occured!');
            console.log('err2: ' + err2);
          return;
        }
        inp.message.channel.send('Successfully deleted the command ' + inp.dbConnection.escape(inp.args[1]) + '!\n\nIf this was a mistake, please ask my developer to recover the command, and give him the reason why! Please copy and paste this to him:\n```\nID: ' + rows1[0].id + '\n```');
      });
    });
  });
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
    if (inp.allCommands.has(inp.args[2])) {
    inp.message.channel.send('This command is reserverd for the bot!');
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
    if (inp.allCommands.has(inp.args[2])) {
    inp.message.channel.send('This command is reserverd for the bot!');
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
    inp.dbConnection.query(`SELECT * FROM customcmds WHERE guild='${inp.message.guild.id}'`, (err1, rows1) => {
      let embed = new Discord.RichEmbed();
      embed.setColor('#772244');
      embed.setTitle('All avalible custom commands for this guild');
      embed.addBlankField();
      rows1.forEach(row => {
          let cmdDescription = (row.description) ? row.description : 'No description provided';
          let cmdPermissions = (row.permissions) ? row.permissions.split(';').join(', ') : 'No permission provided';
          let cmdExec = (row.exec) ? row.exec.split(';').join(', ') : 'No executable provided';
          let cmdOnlyExec = (row.onlyExec === 1) ? 'true' : 'false';
          let authorOfCommand = (inp.message.guild.members.get(row.creator)) ? inp.message.guild.members.get(row.creator).user.username : 'I did not see the author of this command in this guild, hes id is ' + row.creator;
          embed.addField('__**' + row.name + '**__', '**Id: **' + row.id + '\n**Type: **' + row.type + '\n**Permissions: **' + cmdPermissions + '\n**Exec: **' + cmdExec + '\n**Only exec: **' + cmdOnlyExec + '\n**Syntax:** ' + row.syntax + '\n**Creator:** ' + authorOfCommand + '\n**Description:** ' + cmdDescription + '\n**Value:** ' + row.value + '\n');
      });

      inp.message.channel.send({embed});
    });
    break;
    case 'setsyntax':
    if (!inp.args[1]) {
      inp.message.channel.send('Please provide a command!');
      return;
    }
    if (!inp.args[2]) {
      inp.message.channel.send('Please provide the number of arguments you want for your command (syntax)!');
      return;
    }
    let syntax = parseInt(inp.args[2]);
    if (isNaN(syntax)) {
      inp.message.channel.send('The syntax must be a valid number!');
      return;
    }
    if (syntax < 0 || syntax > 15) {
      inp.message.channel.send('You can only have a value between 0 and 15 as the syntax!');
      return;
    }
    inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}"`, (err1, rows1) => {
      if (err1) {
        inp.message.channel.send('An error occured!');
        console.log('err1: ' + err1);
        return;
      }
      if (!rows1[0]) {
        inp.message.channel.send('The command does not exist!');
        return;
      }
    inp.dbConnection.query(`UPDATE customcmds SET syntax=${inp.dbConnection.escape(inp.args[2])} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)}`, (err2) => {
      if (err2) {
        inp.message.channel.send('An error occured!');
        console.log('err2: ' + err2);
        return;
      }
      inp.message.channel.send('Successfully updated/set the syntax for the command ' + inp.dbConnection.escape(inp.args[1]));
    });
  });
  break;
  case 'setvalue':
  if (!inp.args[1]) {
    inp.message.channel.send('Please provide a command!');
    return;
  }
  if (!inp.args[2]) {
    inp.message.channel.send('Please provide a value!');
    return;
  }
  let value = inp.result.substring((inp.args[0].length + inp.args[1].length) + 2, inp.result.length);

  inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
    if (err1) {
      inp.message.channel.send('An error occured!');
      console.log('err1: ' + err1);
      return;
    }
    if (!rows1[0]) {
      inp.message.channel.send('The command does not exist!');
      return;
    }
  inp.dbConnection.query(`UPDATE customcmds SET value=${inp.dbConnection.escape(value)} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)} AND deleted=0`, (err2) => {
    if (err2) {
      inp.message.channel.send('An error occured!');
      console.log('err2: ' + err2);
      return;
    }
    inp.message.channel.send('Successfully updated/set the value for the command ' + inp.dbConnection.escape(inp.args[1]));
  });
});
break;
case 'setdescription':
if (!inp.args[1]) {
  inp.message.channel.send('Please provide a command!');
  return;
}
if (!inp.args[2]) {
  inp.message.channel.send('Please provide a description!');
  return;
}
let description = inp.result.substring((inp.args[0].length + inp.args[1].length) + 2, inp.result.length);

inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
  if (err1) {
    inp.message.channel.send('An error occured!');
    console.log('err1: ' + err1);
    return;
  }
  if (!rows1[0]) {
    inp.message.channel.send('The command does not exist!');
    return;
  }
inp.dbConnection.query(`UPDATE customcmds SET description=${inp.dbConnection.escape(description)} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)} AND deleted=0`, (err2) => {
  if (err2) {
    inp.message.channel.send('An error occured!');
    console.log('err2: ' + err2);
    return;
  }
  inp.message.channel.send('Successfully updated/set the description for the command ' + inp.dbConnection.escape(inp.args[1]));
});
});
break;
case 'setpermissions':
if (!inp.args[1]) {
  inp.message.channel.send('Please provide a command!');
  return;
}
if (!inp.args[2]) {
  inp.message.channel.send('Please provide one or more permissions! Do "' + inp.config.prefix + 'discord_permissions" to see all the discord permission that are avalible! Remember to split the permissions with `;` and no spaces');
  return;
}
inp.args[2] = inp.args[2].toUpperCase();

let allDiscordPermissions = require('./discord_permissions');
allDiscordPermissions = allDiscordPermissions.permissions.channel.concat(allDiscordPermissions.permissions.guild);
let wrongPerms = false;
inp.args[2].split(';').forEach((userPerm) => {
  if (allDiscordPermissions.indexOf(userPerm) === -1) {
    inp.message.channel.send('Invalid permissions!');
    wrongPerms = true;
    return;
  }
})
if (wrongPerms) return;

inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
  if (err1) {
    inp.message.channel.send('An error occured!');
    console.log('err1: ' + err1);
    return;
  }
  if (!rows1[0]) {
    inp.message.channel.send('The command does not exist!');
    return;
  }
inp.dbConnection.query(`UPDATE customcmds SET permissions=${inp.dbConnection.escape(inp.args[2])} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)} AND deleted=0`, (err2) => {
  if (err2) {
    inp.message.channel.send('An error occured!');
    console.log('err2: ' + err2);
    return;
  }
  inp.message.channel.send('Successfully updated/set the permissions for the command ' + inp.dbConnection.escape(inp.args[1]));
});
});
break;
case 'settype':
if (!inp.args[1]) {
  inp.message.channel.send('Please provide a command!');
  return;
}
if (!inp.args[2]) {
  inp.message.channel.send('Please provide a type!');
  return;
}
if (!types.includes(inp.args[2])) {
  inp.message.channel.send('Invalid type!\nI accept: ' + types.join(', '));
  return;
}

inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}" AND deleted=0`, (err1, rows1) => {
  if (err1) {
    inp.message.channel.send('An error occured!');
    console.log('err1: ' + err1);
    return;
  }
  if (!rows1[0]) {
    inp.message.channel.send('The command does not exist!');
    return;
  }
inp.dbConnection.query(`UPDATE customcmds SET type=${inp.dbConnection.escape(inp.args[2])} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)} AND deleted=0`, (err2) => {
  if (err2) {
    inp.message.channel.send('An error occured!');
    console.log('err2: ' + err2);
    return;
  }
  inp.message.channel.send('Successfully updated the type for the command ' + inp.dbConnection.escape(inp.args[1]));
});
});
break;
case 'recover':
if (!inp.args[1]) {
  inp.message.channel.send('Please provide a command ID for the command you\'re about to recover!');
  return;
}
if (!inp.args[2]) {
  inp.message.channel.send('Please provide a reason why you want to recover this command!');
  return;
}
inp.dbConnection.query(`SELECT * FROM customcmds WHERE id=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}"`, (err1, rows1) => {
  if (err1) {
      inp.message.channel.send('An error occured!');
      console.log('err1: ' + err1);
    return;
  }

  if (!rows1[0]) {
    inp.message.channel.send('I did not recover that command successfully! It did not exist!');
    return;
  }

  if (!inp.message.member.permissions.has('ADMINISTRATOR') && !inp.message.author.id(rows1[0].creator)) {
    inp.message.channel.send('Missing permission to delete this command permanently! You need to either have administrator privileges or be the one who created the command!');
    return;
  }

  inp.dbConnection.query(`SELECT * FROM customdelete WHERE cmdId=?`, rows1[0].id, (err3, rows3) => {
    if (rows3[0]) {
      let newestAction;
      rows3.forEach((item3, i3) => {
        if (!i3 > 0) {
          newestAction = item3;
          return; //Skip this index;
        }
        if (item3.timestamp > newestAction.timestamp) newestAction = item3;
      });
      if (newestAction.action === 'delete') return (inp.message.channel.send('This command is not deleted!'))
    }
    //Oh, it isnt deleted
    let oldName = inp.args[1];
    let newName;
    let count = 0;
    rows2.forEach((item2, i2) => {
      if (item2.value = newName) {
        if (count > 0) {
          newName = oldName + '(' + count + ')';
          return;
        }
        newName = oldName;
        count++
      }
    })
  inp.dbConnection.query(`INSERT INTO customdelete (cmdId, reason, deletedBy, channel, action, timeStamp) VALUES("${rows1[0].id}", ${inp.dbConnection.escape(inp.args[2])}, "${inp.message.author.id}", "${inp.message.channel.id}", "recover", "${Math.round(+new Date()/1000).toString()}")`, (err2, rows2) => {
    if (err2) {
        inp.message.channel.send('An error occured!');
        console.log('err2: ' + err2);
      return;
    }
    inp.dbConnection.query(`UPDATE customcmds SET name=${inp.dbConnection.escape(newName)} WHERE name=${inp.dbConnection.escape(oldName)} AND guild=${inp.dbConnection.escape(inp.message.guild.id)}`, (err3) => {
      if (err3) {
          inp.message.channel.send('An error occured!');
          console.log('err3: ' + err3);
        return;
      }


    inp.message.channel.send('Successfully recovered the command ' + inp.dbConnection.escape(oldName) + ' as ' + newName + '!');
  });
});
});
});
break;
case 'setexec':
if (!inp.args[1]) {
  inp.message.channel.send('Please provide a command!');
  return;
}

inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}"`, (err1, rows1) => {
  if (err1) {
    inp.message.channel.send('An error occured!');
    console.log('err1: ' + err1);
    return;
  }
  if (!rows1[0]) {
    inp.message.channel.send('The command does not exist!');
    return;
  }
inp.dbConnection.query(`UPDATE customcmds SET exec=${inp.dbConnection.escape(inp.args[2])} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)}`, (err2) => {
  if (err2) {
    inp.message.channel.send('An error occured!');
    console.log('err2: ' + err2);
    return;
  }
  inp.message.channel.send('Successfully updated/set the exec for the command ' + inp.dbConnection.escape(inp.args[1]));
});
});
break;
case 'setonlyexec':
if (!inp.args[1]) {
  inp.message.channel.send('Please provide a command!');
  return;
}

inp.dbConnection.query(`SELECT * FROM customcmds WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild="${inp.message.guild.id}"`, (err1, rows1) => {
  if (err1) {
    inp.message.channel.send('An error occured!');
    console.log('err1: ' + err1);
    return;
  }
  if (!rows1[0]) {
    inp.message.channel.send('The command does not exist!');
    return;
  }
  let cmdValue;
  if (inp.args[2] && inp.args[2] != 'false' && inp.args[2] != 0) cmdValue = 1;
  else cmdValue = 0;
  inp.dbConnection.query(`UPDATE customcmds SET onlyExec=${inp.dbConnection.escape(cmdValue)} WHERE name=${inp.dbConnection.escape(inp.args[1])} AND guild=${inp.dbConnection.escape(inp.message.guild.id)}`, (err2) => {
  if (err2) {
    inp.message.channel.send('An error occured!');
    console.log('err2: ' + err2);
    return;
  }
  inp.message.channel.send('Successfully updated/set the only exec for the command ' + inp.dbConnection.escape(inp.args[1]) + ' to ' + cmdValue + '!');
});
});
break;
  }
}
exports.data = {
  permFlags: {
    channel: [],
    guild: ['MANAGE_GUILD']
  },
  denyBots: false,
  onlyDev: false,
  disabled: {
    isDisabled: false,
    reason: ''
  },
  desc: 'Custom commads is commands you can make, that is only for your guild! Sounds fun, right?',
  syntax: '<create <name> | delete <name> | settype <name> <type> | setsyntax <name> <syntax> | setperms <name> <permission;permission;permission...> | setvalue <name> <value> | list>',
  ignoreSyntax: true,
  timeout: 2000,
  aliases: ['custom_commands', 'ccmds'],
  blocked: {
    guilds: {},
    users: {}
  },
  category: 'Customisation'
}
