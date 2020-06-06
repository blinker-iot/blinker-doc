var fs = require("fs");
var path = require('path');
var transliterate = require('transliteration')

// 配置脚本
const SITE_URL = "https://diandeng.tech/";
const DOC_PATH = "docs/";
const CONFIG_OUTPUT_PATH = "docs/config.json";
const CUSTOM_PATH = "custom.json";


var CustomUrl = {}
var MenuList = []
var ShortUrl = {}
var shouldMD = (process.argv.indexOf('--md') > -1) || (process.argv.indexOf('-md') > -1)

function loadMenu(filePath = '') {
    let submenu = []
    let files = fs.readdirSync(DOC_PATH + filePath)
    files.forEach(file => {
        if (file == 'img') return
        if (file == 'config.json' || file == 'custom.json') return;
        let item = loadFile(filePath, file)
        submenu.push(item)
    })
    return submenu
}

function loadFile(filePath, file) {
    let item = {};
    // console.log(filePath);
    // console.log(file);
    let title = getFilename(file)
    item['title'] = title

    let newFilePath = ((filePath == '' ? '' : filePath + '/') + file)
    if (path.extname(file) == '.md') {
        item['page'] = shouldMD ? newFilePath : addShortUrl(title, SITE_URL + DOC_PATH + newFilePath)
    } else {
        item['submenu'] = loadMenu(newFilePath)
    }
    return item
}

function getFilename(file) {
    // return file.split(/\d+-/)[1].split(/.md/)[0]
    return file.substring(file.indexOf('-') + 1, file.lastIndexOf('.md') == -1 ? file.length : file.lastIndexOf('.md'))
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

function rename(params) {
    if (fs.existsSync(DOC_PATH + 'home-首页.md'))
        fs.renameSync(DOC_PATH + 'home-首页.md', DOC_PATH + '000-首页.md')
}

function delUseless(params) {
    if (fs.existsSync(DOC_PATH + '$navigation.md'))
        fs.unlinkSync(DOC_PATH + '$navigation.md')
}

rename();
delUseless();

CustomUrl = JSON.parse(fs.readFileSync(CUSTOM_PATH, 'utf8'))

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
        JSON.stringify(CustomUrl).replace(/",/g, '",\n').replace('{', '{\n').replace('}', '\n}'),
        (err) => { }
    )
}, 1000)