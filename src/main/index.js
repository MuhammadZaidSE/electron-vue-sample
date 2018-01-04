'use strict'

import {app, BrowserWindow} from 'electron'
import store from '../store/Store'
import { autoUpdater } from 'electron-updater'
// const express = require('express')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  // mainWindow = new BrowserWindow({
  //   height: 563,
  //   useContentSize: true,
  //   width: 1000
  // })

  let {width, height} = store.get('windowBounds')

  // Pass those values in to the BrowserWindow options
  mainWindow = new BrowserWindow({width, height})

  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let {width, height} = mainWindow.getBounds()
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', {width, height})
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  // const app = express()
  // app.get('/', (req, res) => res.send('Hello World!'))
  // app.listen(3000, () => console.log('Example app listening on port 3000!'))
  createWindow()
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
