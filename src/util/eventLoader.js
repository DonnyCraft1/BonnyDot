module.exports = client => {
    const reqEvent = (event) => require(`../events/${event}`).bind(null, client);

    client.on('ready', reqEvent('ready'));
    client.on('message', reqEvent('message'));
};
