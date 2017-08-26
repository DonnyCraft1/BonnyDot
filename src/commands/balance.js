exports.run = (inp) => {
  inp.dbConnection.query('SELECT vault FROM users WHERE id=?', inp.message.author.id, (err1, rows1) => {
    if (err1) {
      inp.message.channel.send('An error occured!');
      console.log('err1: ' + err1);
      return;
    }
    if (!rows1[0]) {
      inp.message.channel.send('Your money: `$0`');
      return;
    }
    inp.message.channel.send('Your money: `$' + rows1[0].vault + '`');
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
  desc: 'View your money in the bank',
  syntax: '',
  timeout: 0,
  aliases: ['money'],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  },
  category: 'Util'
}
