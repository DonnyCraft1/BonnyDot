module.exports = (client, dbConnection) => {
    const reqEvent = (event) => require(`../events/${event}`).bind(null, client, dbConnection);

    client.on('ready', reqEvent('ready'));
    client.on('message', reqEvent('message'));
};
