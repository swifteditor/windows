const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    Menu.setApplicationMenu(null);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'lua-icon-180x180.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadURL('https://swifteditor.netlify.app/');
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});