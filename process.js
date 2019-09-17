var fs = require("fs");
var path = require('path');
var transliterate = require('transliteration')

var DOC_PATH = "docs/";
var CONFIG_OUTPUT_PATH = "docs/config.json";
var CUSTOM_PATH = "custom.json";
var CustomUrl = {}
var MenuList = []
var ShortUrl = {}
var shouldMD = (process.argv.indexOf('--md') > -1) || (process.argv.indexOf('-md') > -1)

function loadMenu(filePath = '') {
    let submenu = []
    let files = fs.readdirSync(DOC_PATH + filePath)
    files.forEach(file => {
        if (file == 'config.json' || file == 'custom.json') return;
        let item = loadFile(filePath, file)
        submenu.push(item)
    })
    return submenu
}

function loadFile(filePath, file) {
    let item = {};
    let title = getFilename(file)
    item['title'] = title
    let newFilePath = ((filePath == '' ? '' : filePath + '/') + file)
    if (path.extname(file) == '.md') {
        item['page'] = shouldMD ? newFilePath : addShortUrl(title, newFilePath)
    } else {
        item['submenu'] = loadMenu(newFilePath)
    }
    return item
}

function getFilename(file) {
    return file.split(/\d+-/)[1].split(/.md/)[0]
}

function addShortUrl(filename, file, index = 0) {
    let url = getShortName(filename) + (index == 0 ? '' : `-${index}`)
    if (typeof ShortUrl[url] != 'undefined')
        return addShortUrl(filename, file, index + 1)
    ShortUrl[url] = file;
    return url
}

function getShortName(filename) {
    if (typeof CustomUrl[filename] == 'undefined' || CustomUrl[filename] == '') {
        CustomUrl[filename] = ""
        return transliterate.slugify(filename)
    } else return CustomUrl[filename]
}



CustomUrl = JSON.parse(fs.readFileSync(CUSTOM_PATH, 'utf8'))
// console.log(CustomUrl);


MenuList = loadMenu()


setTimeout(() => {
    let config = {
        menu: MenuList,
        short: ShortUrl
    }
    fs.writeFile(
        CONFIG_OUTPUT_PATH,
        JSON.stringify(config),
        (err) => { }
    )
    fs.writeFile(
        CUSTOM_PATH,
        JSON.stringify(CustomUrl),
        (err) => { }
    )
}, 1000)