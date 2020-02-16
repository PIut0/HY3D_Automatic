// Modules to control application life and create native browser window
const { app, BrowserWindow, webContents, Menu, dialog } = require('electron')
const path = require('path')
const pdf = require('pdf-parse')
const fs = require('fs')
const iconv = require('iconv-lite')
const jschar = require('jschardet')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let hiddenWindow
let xlsettingWindow

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
  // mainWindow.webContents.openDevTools();

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

function xlsettingWin(){
  xlsettingWindow = new BrowserWindow({
    width: 500,
    height: 120,
    webPreferences: {
      nodeIntegration: true
    }
  })

  xlsettingWindow.loadFile('xlsetting.html')
  xlsettingWindow.on('closed',function(){
    xlsettingWindow = null
  })
}

// const menuTemplate = [
//   {
//     label: '설정',
//     submenu: [
//       {role: '엑셀 파일'},
//       {role: 'PDF 경로'},
//       {role: '저장 경로'}
//     ]
//   }
// ]

const menuTemplate = [
  {
    label: '편집',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      },
      {
        type: 'separator'
      },
      {
        label: '엑셀 파일',
        id: 'excel_setting',
        click() {
          xlFile = dialog.showOpenDialogSync(mainWindow, {
            properties: ['openFile']
          })
          setting.xlPath = xlFile[0].split("\\").join("/")
          fs.writeFileSync("setting.json",JSON.stringify(setting))
        }
      },
      {
        label: 'PDF 경로',
        id: 'pdf_setting',
        click() {
          pdfPath = dialog.showOpenDialogSync(mainWindow, {
            properties: ['openDirectory']
          })
          setting.pdfPath = pdfPath[0].split("\\").join("/")
          fs.writeFileSync("setting.json",JSON.stringify(setting))
          // console.log(pdfPath)
        }
      },
      {
        label: '저장 경로',
        id: 'save_setting',
        click() {
          savePath = dialog.showOpenDialogSync(mainWindow, {
            properties: ['openDirectory']
          })
          setting.savePath = savePath[0].split("\\").join("/")
          fs.writeFileSync("setting.json",JSON.stringify(setting))
          // console.log(pdfPath)
        }
      },
      {
        label: '엑셀 설정',
        id: 'xl_setting',
        click() {
          xlsettingWin();
        }
      },
    ]
  },
  {
    label: '보기',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  menuTemplate[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  menuTemplate[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

// const menuTemplate = [
//   {
//     label: '설정',
//     submenu: [
//       {
//         label: '엑셀 파일',
//         id: 'excel_setting'
//         ,click() {
//           xlFile = dialog.showOpenDialogSync(mainWindow, {
//             properties: ['openFile']
//           })
//           setting.xlFile = xlFile
//         }
//       },
//       {
//         label: 'PDF 경로',
//         id: 'pdf_setting'
//       },
//       {
//         label: '저장 경로',
//         id: 'save_setting'
//       },
//     ]
//   },
// ]


const menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



// //console.log(dataBuffer);

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
    //console.log('Start');
    var text = data.text;
    var test = jschar.detect(text);
    text = iconv.encode(text, "utf-8").toString();
    text = text.split("\n");
    // fs.writeFileSync("test.txt", text)
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
    // //console.log(text.toString());
    //console.log('End');
    // arr = arr.join("\n");
    // fs.writeFileSync("test.txt",arr);
    // //console.log(test);
  });
  await wait();
  // arr = arr.join("\n");
  // //console.log(typeof (arr));
  return arr;
}


exports.mod_pdfParsing = async function (pdfFile) {
  var arr
  dataBuffer = pdfFile;
  dataBuffer = fs.readFileSync(dataBuffer);
  // console.log(dataBuffer)
  pdf(dataBuffer).then(function (data) {
    // console.log('Start');
    var text = data.text;
    // console.log(text)
    // var test = jschar.detect(text);
    text = iconv.encode(text, "utf-8").toString();
    fs.writeFileSync("test.txt", text)
    text = text.split("\n");
    for (var i = 0; i < text.length; i++) {
      var line = text[i];
      if(line.indexOf("[id]") != -1){
        arr = line.split("[id]")[1]
      }
    }
    //console.log(text.toString());
    // console.log('End');
    // arr = arr.join("\n");
    // fs.writeFileSync("test.txt",arr);
    // console.log(test);
    // console.log(arr)
  });
  await wait();
  // arr = arr.join("\n");
  // //console.log(typeof (arr));
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
  // hiddenWindow.webContents.openDevTools();


  // Open the DevTools.
  // hiddenWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  // hiddenWindow.on('closed', function () {
  //   hiddenWindow = null
  // })
}

exports.submit = function (result) {
  // test11();
  // //console.log(result)
  exports.result = result
  hiddenWin();
  // console.log(fs.existsSync(`${setting.savePath}/${result.file_name}.pdf`))
  // //console.log(hiddenWindow.devToolsWebContents());
  // //console.log(hiddenWindow)
  hiddenWindow.webContents.on('did-finish-load', () => {
    hiddenWindow.webContents.printToPDF({
      marginsType:2,
      pageSize: {
        width: 250000,
        height: 380000
      },
      printBackground: true
      // pageSize: 'A3'
    }).then(data => {
      if(fs.existsSync(`${setting.savePath}/${result.file_name}.pdf`)){
        let n = 1;
        while(fs.existsSync(`${setting.savePath}/${result.file_name}(${n}).pdf`)) n++;
        fs.writeFile(`${setting.savePath}/${result.file_name}(${n}).pdf`, data, (err) => {
          if (err) throw err
          //console.log("write pdf")
        })
      }else{
        fs.writeFile(`${setting.savePath}/${result.file_name}.pdf`, data, (err) => {
          if (err) throw err
          //console.log("write pdf")
        })
      }
    }).catch(err => {
      //console.log(err)
    })
  })
  setTimeout(() => {
    hiddenWindow.close();
  }, 1000);
  // hiddenWinClose();
}

exports.xlsubmit = function (){

}