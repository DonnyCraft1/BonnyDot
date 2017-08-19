exports.run = (inp) => {
  var ballAnswers = ['no', 'yes', 'i guess', 'i\'m not sure', 'you will know soon', 'that\'s a tricky question!', 'Better not tell you now', 'my sources say no', 'returns True', 'returns False'];
  var ballEmoji = [':wink:', ':thinking:', ':thumbsup:', ':joy:', ':face_palm:', ':crystal_ball:', ':heart_eyes:'];
  inp.message.channel.send('[**8ball**] :crystal_ball: ' + inp.message.author.username + ' asked `' + inp.result + '`, and my answer is `' + ballAnswers[Math.floor(Math.random()*ballAnswers.length)] + '` ' + ballEmoji[Math.floor(Math.random()*ballEmoji.length)])
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
  desc: 'Ask a question, and I\'ll tell if it\'s true!',
  syntax: '<question>',
  timeout: 1000,
  aliases: [],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {},
    category: 'Fun'
  }
}
