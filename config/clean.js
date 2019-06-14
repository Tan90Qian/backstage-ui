// 清理源文件已经被删除的样式类型声明文件
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

function cleanCssModulesTyping(filePath) {
  const declarePath = `${filePath}.d.ts`;
  const existDeclare = fs.existsSync(declarePath);
  if (existDeclare) {
    fs.unlink(declarePath, err => {
      if (err) throw err;
      console.log('文件已删除');
    });
  }
}

function watchCssFile() {
  const watcher = chokidar.watch(path.resolve(__dirname, '..', 'src/**/*.(css|less|sass|scss)'));
  watcher.on('all', (event, filePath) => {
    if (event === 'unlink') {
      cleanCssModulesTyping(filePath);
    } else if (event === 'error') {
      watcher.close();
    }
  });
  console.log('start watch css file!');
}

/**
 * 获取所有指定后缀名文件
 * @param 文件夹目录
 * @param 文件后缀名
 */
function findFileBySuffix(dirs, fileName) {
  let files = [];
  let dirArray = fs.readdirSync(dirs);
  for (let d of dirArray) {
    let filePath = path.resolve(dirs, d);
    let stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(findFileBySuffix(filePath, fileName));
    }
    if (stat.isFile() && filePath.match(fileName)) {
      files.push(filePath);
    }
  }
  return files;
}

function initialClean() {
  const files = findFileBySuffix(
    path.resolve(__dirname, '..', 'src'),
    /\.(css|less|scss|sass).d.ts$/
  );
  files.forEach(file => {
    const sourceFile = file.replace(/.d.ts$/, '');
    if (!fs.existsSync(sourceFile)) {
      fs.unlink(sourceFile, err => {
        if (err) throw err;
        console.log('文件已删除');
      });
    }
  });
  console.log('initial clean finish!')
}


const env = process.env.NODE_ENV || 'production';
initialClean();
if (env === 'development') {
  watchCssFile();
}
