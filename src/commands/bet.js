let timesMoney = [0.00, 0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00];
let minMoney = 10;
exports.run = (inp) => {
  inp.dbConnection.query('SELECT * FROM users WHERE id=?', inp.message.author.id, (err1, rows1) => {
    if (err1) {
      inp.message.channel.send('An error occured!');
      console.log('err1: ' + err1);
      return;
    }
    if (!rows1[0]) {
      inp.message.channel.send('You\'re not in my database! Fixing that now!');
      inp.dbConnection.query('INSERT INTO users (id, vault) VALUE (?, 0)', inp.message.author.id, (err2) => {
        if (err2) {
          inp.message.channel.send('An error occured!');
          console.log('err2: ' + err2);
          return;
        }
      });
    return;
    }

    if (rows1[0].vault === undefined) {
      inp.message.channel.send('No value in database!');
      inp.dbConnection.query('UPDATE users SET vault=0 WHERE id=?', inp.message.author.id, (err3) => {
        if (err3) {
          inp.message.channel.send('An error occured!');
          console.log('err3: ' + err3);
          return;
        }
      });
    return;
    }

    let moneyToBet = parseInt(inp.args[0]);
    if (isNaN(moneyToBet)) {
      inp.message.channel.send('Invalid number!');
      return;
    }
    if (rows1[0].vault < minMoney || moneyToBet < minMoney) {
      inp.message.channel.send('You need to bet at least `$' + minMoney + '`!\nYou have `$' + rows1[0].vault + '` in your vault!');
      return;
    }
    if (rows1[0].vault < moneyToBet) {
      inp.message.channel.send('You can\'t bet more than you have! Do the math!');
      return;
    }
    let randomTimesMoney = timesMoney[Math.floor(Math.random() * timesMoney.length)];
    inp.message.channel.send('You bet ' + moneyToBet + ' and now you got ' + moneyToBet * randomTimesMoney + '!');
    let moneyAfterBet = rows1[0].vault;
    moneyAfterBet -= moneyToBet;
    moneyAfterBet += moneyToBet * randomTimesMoney;
    inp.dbConnection.query('UPDATE users SET vault=' + moneyAfterBet + ' WHERE id=?', inp.message.author.id, (err4) => {
      if (err4) {
        inp.message.channel.send('An error occured!');
        console.log('err4: ' + err4);
        return;
      }
    });
  });
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
  desc: '',
  syntax: '<money>',
  timeout: 0,
  aliases: [],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  },
  category: 'Fun'
}
