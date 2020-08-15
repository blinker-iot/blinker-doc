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

如果是使用html示例进行开发，您可以在vscode中安装 Live Server插件，实现一个简单的web服务器。  
然后通过 **管理台>产品开发** 选择一个设备，点击其UI组件，将其设为该页面在局域网中的地址，如：
``` 
Customizer?https://192.168.0.100:5500/hello.html
```

### 使用前端框架进行开发
开发者可以使用原生js或任意前端开发框架（angular、react、vue等）进行设备页面定制开发。这里不做详述，建议查看我们的例程。

## 示例详解  

``` html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>blinker Customizer</title>
    <!-- 只是为了让这个示例更好看，可以删 -->
    <script src="assets/formJson.js"></script>
    <link rel="stylesheet" href="assets/app.css">
</head>

<body>
    <div class="main-box">
        <div class="header" id="header">
        </div>
        <div class="text" id="showBox">

        </div>
        <div class="bottom-btn-box">
            <button onclick="getState()">心跳</button>
            <button onclick="tapButton()">开关</button>
        </div>
    </div>
    <script>
        // appData用于存放app上缓存的设备信息，设备发来的信息都在其中
        let appData = {};
        let showBox = document.getElementById("showBox");
        // 如果要向设备发送信息，就调用send2Device
        function send2Device(data) {
            window.parent.postMessage(data, '*')
        }
        // 获取设备状态，向设备发送{"get": "state"}
        function getState() {
            send2Device({
                'get': 'state'
            })
        }
        // 开关按键，向设备发送{"switch": "on"}或者{"switch": "off"}
        function tapButton() {
            if (appData.deviceData.switch == 'on')
                send2Device({
                    'switch': 'off'
                })
            else
                send2Device({
                    'switch': 'on'
                })
        }
        // 接收设备发来的信息，并缓存到appData中
        window.addEventListener("message", receiveMessage, false);
        function receiveMessage(e) {
            // 设备加载后会发来的header高度信息，帮助这个页面避开顶部的设备名及其他按键。
            if (typeof e.data.headerHeight != 'undefined') {
                let header = document.getElementById('header');
                header.style.height = e.data.headerHeight + 'px'
            }
            Object.assign(appData, e.data)
            // 讲收到的数据，显示到界面中
            showBox.innerHTML = generateRes(JSON.stringify(appData))
        }
        // 页面加载完成后，至少要发一个空数据，告知app页面已经加载完成
        send2Device({})
    </script>
</body>

</html>
```

