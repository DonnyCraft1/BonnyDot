exports.run = (inp) => {

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
  syntax: '',
  timeout: 5000,
  aliases: ['userinfo'],
  blocked: {
    //Key Value
    //Id  Reason
    guilds: {},
    users: {}
  },
  category: 'Util'
}
