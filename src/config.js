const path = require('path');

module.exports = {
    clientId: '1311112524393087106',
    windowConfig: {
        width: 800,
        height: 600,
        icon: path.join(__dirname, '../lua-icon-180x180.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    },
    appUrl: 'https://swifteditor.netlify.app/',
};