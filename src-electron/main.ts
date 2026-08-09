

import { promises } from 'dns'
import { app, BrowserWindow, ipcMain, Menu, Notification, session, shell } from 'electron'
import path from 'path'
import { title } from 'process'

let mainWindow: BrowserWindow | any = null

function registerIpcHandlers() {

    ipcMain.on('window:maximize', () => {
        if (!mainWindow) return
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    })

    ipcMain.on('window:minimize', () => {
        mainWindow?.minimize()
    })

    ipcMain.on('window:close', () => {
        mainWindow?.close()
    })

    ipcMain.handle('notify', (_, { title, body }: { title: string; body: string }) => {
        new Notification({ title, body }).show()
    })

    ipcMain.handle('openExternal', (_, url: string) => {
        shell.openExternal(url)
    })

    ipcMain.handle('browser:open', (_, url: string) => {
        const title = getSesstionBrowser(url)
        return title
    })

    ipcMain.handle('openChamado', (_, data) => {
        if (!mainWindow) return

        const chamadoId = data.id
        const menu = Menu.buildFromTemplate([
            {
                label: 'Abrir URL Chamado',
                click: () => {
                    shell.openExternal(`https://glpi.veronet.com.br/front/ticket.form.php?id=${chamadoId}`)
                },
            },
            { type: 'separator' },
            {
                label: 'Copiar ID',
                click: () => {
                    const { clipboard } = require('electron')
                    clipboard.writeText(chamadoId.toString())
                },
            },
        ])
        menu.popup({ window: mainWindow })
    })
}

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 1200,
        minHeight: 800,
        height: 800,
        width: 1200,
        frame: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, '../src/assets/veroIcon.ico'),
        trafficLightPosition: { x: 12, y: 12 },
        webPreferences: {
            devTools: process.argv.includes('--dev'),
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    })

    const isDev = process.argv.includes('--dev')
    const devUrl = 'http://localhost:5174'
    const indexHtmlPath = path.join(__dirname, '../dist/index.html')

    if (isDev) {
        mainWindow.loadURL(devUrl)
    } else {
        mainWindow.loadFile(indexHtmlPath)
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function setupWindowOpenHandler() {
    mainWindow.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
        createViewerWindow(url)

        return { action: 'deny' }
    })
}

function createViewerWindow(url: string) {
    const viewerWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Visualizador ',
        icon: path.join(__dirname, '../src/assets/veroIcon.ico'),
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true
        }
    })

    viewerWindow.loadURL(url)
}

async function getSesstionBrowser(url: string) {
    const viewerWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Visualizador ',
        icon: path.join(__dirname, '../src/assets/veroIcon.ico'),
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true
        }
    })

    viewerWindow.loadURL(url)

    await new Promise<void>((resolve) => {

        viewerWindow.webContents.once("did-finish-load", () => {
            resolve()
        })
    })


    await waitForRealPage(viewerWindow)

    const title = await viewerWindow.webContents.executeJavaScript(`
(() => {

    return [...document.querySelectorAll("iframe")].map((frame, index) => ({
        index,
        src: frame.src,
        id: frame.id,
        name: frame.name
    }));

})()
        `)
    console.log("Title of the page:", title)

    return title

}

async function waitForRealPage(viewerWindow: BrowserWindow) {

    let title = await viewerWindow.webContents.executeJavaScript(`
            document.title
        `);

    do {

        title = await viewerWindow.webContents.executeJavaScript(`
            document.title
        `);

        console.log(title);

        await new Promise(r => setTimeout(r, 500));

    } while (!title.includes("Incidente"))

}

app.whenReady().then(() => {
    if (process.platform === 'win32') {
        app.setAppUserModelId(app.name)
    }

    registerIpcHandlers()
    createWindow()
    setupWindowOpenHandler()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
