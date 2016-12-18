'use strict';

const {app, BrowserWindow, crashReporter} = require('electron');
var path = require('path');

// ####################################################
// ####################################################

// Report crashes to our server.
crashReporter.start({
  productName: 'ElectronAngular',
  companyName: 'Kondeo',
  submitURL: 'https://www.Kondeo.com',
  autoSubmit: false
});

var mainWindow = null;
var options = {
	"debug": false,
	"version": "1.0.0",
	"app_dir": require('./package.json').root,
	"app_view": "index.html"
};

// ############################################################################################
// ############################################################################################

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') { app.quit(); }
});

app.on('ready', function() {
	console.log(path.join('file://', __dirname, options.app_dir, options.app_view));

  mainWindow = new BrowserWindow({width: 1600, height: 1200, titleBarStyle: 'hidden'});
  mainWindow.loadURL(path.join('file://', __dirname, options.app_dir, options.app_view));
  if(options.debug) { mainWindow.openDevTools(); }
  mainWindow.on('closed', function() { mainWindow = null; });
});

// ############################################################################################
// ############################################################################################
