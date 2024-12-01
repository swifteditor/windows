const { app, Menu } = require('electron');
const { createMainWindow } = require('./window');
const { initRichPresence, destroyRichPresence } = require('./richPresence');

let mainWindow;

app.on('ready', () => {
    Menu.setApplicationMenu(null);
    mainWindow = createMainWindow();
    initRichPresence();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    destroyRichPresence();
});