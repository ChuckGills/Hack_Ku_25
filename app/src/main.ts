import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { exec } from 'child_process';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '/../../src/preload.ts'),
    },
  });

   Menu.setApplicationMenu(null); // Remove menu bar

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);


ipcMain.handle('run-command', async (event, cmd: string) => {

  const scriptPath = path.join(__dirname, '../../../gh_cli.py');

  return new Promise((resolve, reject) => {
    // Call Python script with the command as an argument.
    exec(`python3 "${scriptPath}" ${cmd}`, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      try {
        const data = JSON.parse(stdout);
        resolve(data);
      } catch {
        // If output isn't valid JSON, return it as-is.
        resolve(stdout.trim());
      }
    });
  });
});

// Gemini IPC Handlers
ipcMain.handle('gemini-summarize-pr', async (event, diffText: string) => {
  return new Promise((resolve, reject) => {
    // The command "gemini summarize" will be interpreted in gh_cli.py
    const scriptPath = path.join(__dirname, 'gh_cli.py');
    exec(`python3 "${scriptPath}" gemini summarize "${diffText}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve(stdout.trim());
    });
  });
});

ipcMain.handle('gemini-review-pr', async (event, diffText: string) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'gh_cli.py');
    exec(`python3 "${scriptPath}" gemini review "${diffText}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve(stdout.trim());
    });
  });
});

ipcMain.handle('gemini-generate-commit-title', async (event, diffText: string) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'gh_cli.py');
    exec(`python3 "${scriptPath}" gemini commit-title "${diffText}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve(stdout.trim());
    });
  });
});

ipcMain.handle('gemini-generate-commit-message', async (event, diffText: string) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'gh_cli.py');
    exec(`python3 "${scriptPath}" gemini commit-message "${diffText}"`, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve(stdout.trim());
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
