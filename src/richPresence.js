const { Client } = require('discord-rpc');
const config = require('./config');

const rpc = new Client({ transport: 'ipc' });

function setRichPresence() {
    rpc.setActivity({
        details: 'Editing with Swift Editor',
        state: 'Focused on Productivity',
        startTimestamp: Date.now(),
        largeImageKey: 'lua-icon',
        largeImageText: 'Swift Editor',
        instance: false,
    });
}

rpc.on('ready', () => {
    console.log('Rich Presence is ready');
    setRichPresence();
    setInterval(setRichPresence, 15 * 1000);
});

function initRichPresence() {
    rpc.login({ clientId: config.clientId }).catch(console.error);
}

function destroyRichPresence() {
    rpc.destroy();
}

module.exports = { initRichPresence, destroyRichPresence };