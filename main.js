// Modules to control application life and create native browser window
const { app, BrowserWindow, webContents } = require('electron')
const path = require('path')
const pdf = require('pdf-parse')
const fs = require('fs')
const iconv = require('iconv-lite')
const jschar = require('jschardet')
const utf8 = require('utf8')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let hiddenWindow

let setting = JSON.parse(fs.readFileSync("setting.json",'utf8'))
exports.setting = setting


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // require is not define을 해결하는 아주 중요한 코드@@@@@@@@@@@@@@@@
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



// console.log(dataBuffer);

function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

exports.pdfParsing = async function (pdfFile) {
  var arr = []
  dataBuffer = pdfFile;
  dataBuffer = fs.readFileSync(dataBuffer);
  pdf(dataBuffer).then(function (data) {
    console.log('Start');
    var text = data.text;
    var test = jschar.detect(text);
    text = iconv.encode(text, "utf-8").toString();
    var lst = text;
    text = text.split("\n");
    fs.writeFileSync("test.txt", text)
    arr.push(text[2])
    for (var i = 0; i < text.length; i++) {
      var line = text[i];
      var next = line.indexOf("x");
      if (next != -1) {
        if (line.indexOf("x", next) != -1 && line.indexOf("mm", next) != -1) {
          arr.push(text[i - 1]);
          // arr.push(text[i]);
          arr.push(text[i + 1]);
        }
      }
    }
    // console.log(text.toString());
    console.log('End');
    // arr = arr.join("\n");
    // fs.writeFileSync("test.txt",arr);
    // console.log(test);
  });
  await wait();
  // arr = arr.join("\n");
  console.log(typeof (arr));
  return arr;
}
function hiddenWin() {
  hiddenWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // require is not define을 해결하는 아주 중요한 코드@@@@@@@@@@@@@@@@
      preload: path.join(__dirname, 'preload.js')
    },
    contextIsolation: true,
    show: false
  })

  // and load the index.html of the app.
  hiddenWindow.loadFile('form.html')
  hiddenWindow.webContents.openDevTools();


  // Open the DevTools.
  // hiddenWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  hiddenWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    hiddenWindow = null
  })
}

exports.submit = function (result) {
  // test11();
  console.log(result)
  exports.result = result
  hiddenWin();
  // console.log(hiddenWindow.devToolsWebContents());
  // console.log(hiddenWindow)
  hiddenWindow.webContents.on('did-finish-load', () => {
    hiddenWindow.webContents.printToPDF({
      marginsType:2,
      pageSize: {
        width: 250000,
        height: 380000
      }
      // pageSize: 'A3'
    }).then(data => {
      fs.writeFile('./savefile/test5.pdf', data, (err) => {
        if (err) throw err
        console.log("write pdf")
      })
    }).catch(err => {
      console.log(err)
    })
  })
}