// 引入electron并创建一个Browserwindow
const { app, ipcMain, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')
const url = require('url')


const debug = /--debug/.test(process.argv[2]);

// 当前目录下的app.ico图标
const iconPath = path.join(__dirname, '../assets/timg.jpg');
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow

// 设置隐藏窗口菜单
!debug && Menu.setApplicationMenu(null)

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
            mainWindow.show()
        }
    })
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', createMainWindow)

// 所有窗口关闭时退出应用.
app.on('window-all-closed', function () {
    // macOS中除非用户按下 `Cmd + Q` 显式退出,否则应用与菜单栏始终处于活动状态.
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // macOS中点击Dock图标时没有已打开的其余应用窗口时,则通常在应用中重建一个窗口
    if (mainWindow === null) {
        createMainWindow()
    }
})

ipcMain.on('main_timeout', (event, arg) => {
    createToastWindow()
})

ipcMain.on('main_quit', (event, arg) => {
    app.quit()
})

ipcMain.on('toast_settimeout', (event, arg) => {
    mainWindow && mainWindow.webContents.send('settimeout', arg)
})


// 你可以在这个脚本中续写或者使用require引入独立的js文件.   

let appTray = null;   // 引用放外部，防止被当垃圾回收
// 隐藏主窗口，并创建托盘，绑定关闭事件
function setTray() {
    // 用一个 Tray 来表示一个图标,这个图标处于正在运行的系统的通知区
    //  ，通常被添加到一个 context menu 上.
    // 系统托盘右键菜单
    let trayMenuTemplate = [{     // 系统托盘图标目录
        label: '退出',
        click: function () {
            app.quit();
        }
    }];

    appTray = new Tray(iconPath);
    // 图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    // 设置托盘悬浮提示
    appTray.setToolTip('提醒');
    // 设置托盘菜单
    appTray.setContextMenu(contextMenu);
    // 单击托盘小图标显示应用
    appTray.on('double-click', function () {
        // 显示主程序
        mainWindow.show();
    });
};

function createMainWindow() {
    //创建浏览器窗口,宽高自定义具体大小你开心就好
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        icon: iconPath,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true, // 是否集成 Nodejs
        }
    })


    // 加载应用-----  打包的加载入口
    if (debug) {
        mainWindow.loadURL('http://localhost:3000/#/main');
    } else {
        mainWindow.loadFile('build/index.html', {
            hash: 'main'
        })
    }


    // 打开开发者工具，默认不打开
    debug && mainWindow.webContents.openDevTools();

    setTray()

    // 最小化时触发下列事件.
    mainWindow.on('minimize', function () {
        mainWindow.hide()
        // createToastWindow()
    })

    // 关闭window前触发下列事件.
    mainWindow.on('close', function (e) {
    })
}

function createToastWindow() {
    //创建浏览器窗口,宽高自定义具体大小你开心就好
    const toastWindow = new BrowserWindow({
        width: 400,
        height: 400,
        icon: iconPath,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true, // 是否集成 Nodejs
        }
    })


    // 加载应用-----  打包的加载入口
    if (debug) {
        toastWindow.loadURL('http://localhost:3000/#/toast');
    } else {
        toastWindow.loadFile('build/index.html', {
            hash: 'toast'
        })
    }

    // 打开开发者工具，默认不打开
    debug && toastWindow.webContents.openDevTools();
}