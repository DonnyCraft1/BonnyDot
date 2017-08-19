exports.run = (inp) => {
  function clean(text) {
  if (typeof(text) === 'string')
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  else
      return text;
  }

    try {
      let evaled = eval(inp.result);

      if (typeof evaled !== 'string')
        evaled = require('util').inspect(evaled);
      inp.message.channel.send(':inbox_tray: Input\n ```js\n' + inp.result + '\n```\n:outbox_tray: Output\n```js\n' + clean(evaled) + '\n```');
    } catch (err) {
      inp.message.channel.send(`**ERROR** \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
exports.data = {
  permFlags: {
    channel: [],
    guild: []
  },
  denyBots: true,
  onlyDev: true,
  disabled: {
    isDisabled: false,
    reason: ''
  },
  desc: 'Evaluate js code',
  syntax: '<code>',
  timeout: 0,
  aliases: [],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  }
}
