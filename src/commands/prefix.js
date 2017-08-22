const config = require('../config.json');
exports.run = (inp) => {
  if (!inp.result) {
    let query0 = inp.dbConnection.query('SELECT prefix FROM guilds WHERE id = ?;', inp.message.guild.id, (err, row, fields) => {
  if (!row[0]) {
    inp.message.channel.send(`\`${config.prefix}\``);
  } else {
  inp.message.channel.send(`\`\`\`css\n${row[0].prefix}\`\`\``);
}
});
  } else {
    inp.result = inp.result.replace(/{space}/gi, ' ');
      inp.dbConnection.query('SELECT * FROM guilds WHERE id = ?;', inp.message.guild.id, (err1, row1, fields1) => {
        if (err1) console.log('err1: ' + err1);
        if (row1[0]) {
          inp.dbConnection.query(`UPDATE guilds SET prefix = ${inp.dbConnection.escape(inp.result)} WHERE id = ${inp.message.guild.id};`, (err2, row2, fields2) => {
            if (err2) console.log('err2: ' + err2);
            inp.message.channel.send('I updated my prefix to ' + inp.dbConnection.escape(inp.result) + '!');
              })
        } else {
          inp.dbConnection.query(`INSERT INTO guilds (id, prefix, language) VALUES (${inp.message.guild.id}, ${inp.dbConnection.escape(inp.result)}, 'en');`, (err3, row3, fields3) => {
            if (err3) console.log('err3: ' + err3);
            inp.message.channel.send('I set my prefix to ' + inp.dbConnection.escape(inp.result) + '!');
          })
        }

  })
}}
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
  desc: 'Set the prefix for your guild, or view the current one',
  syntax: '[new prefix]',
  ignoreSyntax: false,
  timeout: 0,
  aliases: ['setprefix'],
  blocked: {
    guilds: {},
    users: {}
  },
  category: 'Util'
}
