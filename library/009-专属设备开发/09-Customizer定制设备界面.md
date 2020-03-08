# blinker-Customizer定制设备界面  
## 原理
blinker-Customizer借鉴了微前端的思想，允许开发者使用iframe方式嵌入自定义的HTML页面/web app到blinker app中。

## 快速体验  
通过 **管理台>产品开发** 选择一个设备，点击其**UI组件**，将内容设为如下：
```
Customizer?https://diandeng.tech/customizer/hello/hello.html
```
现在设备UI界面已经切换为该html定义的界面。  


## 界面开发
您可以通过[Github blinker-Customizer](https://github.com/blinker-iot/blinker-customizer)下载我们提供示例  
### 简易开发
如果是使用html示例进行开发，你可以在vscode中安装 Live Server插件，实现一个简单的web服务器。  
然后通过 **管理台>产品开发** 选择一个设备，点击其UI组件，将其设为该页面在局域网中的地址，如：
```
Customizer?https://192.168.0.100:5500/hello.html
```

### 使用前端框架进行开发
开发者可以使用原生js或任意前端开发框架（angular、react、vue等）进行设备页面定制开发。