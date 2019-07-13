# JavaScript支持模块  
==以下为1.0文档，2.0 js模块重构中，待更新到2.0版本==  
面向linux设备提供JavaScript模块支持  
目前模块处于调试阶段，没有正式发布，暂时无法通过npm安装  
你可以通过以下地址下载：  
https://github.com/blinker-iot/blinker-js  

>1. [支持情况](#支持情况 "支持情况")
1. [连接类型](#连接类型 "连接类型")
1. [准备工作](#准备工作 "准备工作")
1. [Blinker接口函数](#Blinker接口函数 "Blinker接口函数")
	1. [设备配置](#设备配置 "设备配置")
	1. [连接管理](#连接管理 "连接管理")
	1. [数据管理](#数据管理 "数据管理")
	1. [组件控制](#组件控制 "组件控制")
	1. [设备延时](#设备延时 "设备延时")
    1. [Debug](#Debug "Debug")
	1. [LOG](#LOG "LOG")
1. [感谢](#感谢 "感谢")


## 支持情况  
Linux开发板、树莓派(Raspberry Pi)、香蕉派
  
## 连接类型
* Bluetooth Smart (BLE 4.0)  
* WiFi  
* MQTT  
  
## 准备工作
开始使用前你需要做好如下准备:
* [Node.js](https://github.com/nodesource/distributions) v8.x or newer  
[Install Node.js on Raspberry Pi](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp)  

* Install the [ws](https://github.com/websockets/ws)  
`npm install ws -g`  

* Install the [node-mdns-js](https://github.com/mdns-js/node-mdns-js)  
`npm install mdns-js -g`   

* Install the [MQTT.js](https://github.com/mqttjs/MQTT.js)  
`npm install mqtt -g`   

* Install the [blinker-js](https://github.com/blinker-iot/blinker-js)  
Download then `npm link`  

## Blinker接口函数
### 设备配置
#### Blinker.begin()
使用 **Blinker.begin()** 来配置 Blinker:
```
Blinker.begin(...)
```
根据你使用的连接方式选择不同的参数用于配置Blinker  
  

BLE:
```
const blinker = require('/usr/lib/node_modules/blinker');
const Blinker = new blinker('BLINKER_BLE');

Blinker.begin();
```  
> Node.js暂不支持BLE  
  
<!-- >串口蓝牙模块:  
>**Blinker.begin()** 将使用默认设置配置 SoftWareSerial   
>  
>Blinker.begin();// 默认设置: 数字IO 2(RX) 3(TX), 波特率 9600 bps  
>Blinker.begin(4, 5);// 设置数字IO 4(RX) 5(TX), 默认波特率 9600 bps  
>Blinker.begin(4, 5, 115200);// 设置数字IO 4(RX) 5(TX) 及波特率 115200 bps   -->
  
WiFi:
```
const blinker = require('/usr/lib/node_modules/blinker');
const Blinker = new blinker('BLINKER_WIFI');

Blinker.begin();
```  
  
MQTT:
```
const blinker = require('/usr/lib/node_modules/blinker');
const Blinker = new blinker('BLINKER_MQTT');

Blinker.begin();
```
<!-- > MQTT 支持的硬件: WiFiduino, WiFiduino32, ESP8266, ESP32   -->

**begin()** 主要完成以下配置:  
1.初始化硬件设置;  
2.连接网络并广播设备信息等待app连接;
### 连接管理
<!-- ### Blinker.connect()
建立 **Blinker** 设备间连接并返回连接状态, 默认超时时间为10秒
```
result = Blinker.connect()  
  

timeout = 30000 # ms  
result = Blinker.connect(timeout)
```
### Blinker.disconnect()
断开 **Blinker** 设备间连接
```
Blinker.disconnect()
``` -->
#### Blinker.connected()
返回 **Blinker** 设备间连接状态
```
Blinker.on('connected', function() {
    console.log('device connected!');
});
```  
<!-- ### Blinker.run()
此函数需要频繁调用以保持设备间连接及处理收到的数据, 建议放在 **main** 函数中
```
if __name__ == '__main__':  
    while True:  
        Blinker.run()
``` -->
### 数据管理
<!-- ### Blinker.available()
检测是否有接收到数据
```
if Blinker.available():  
    print('data available')  
else:  
    print('none data')
``` -->
#### Blinker.read()
读取接收到的数据
```
Blinker.read(function(data){
    console.log('read data: ', data);
});
```
`*读取数据最大为 256 字节`
#### Blinker.print()
发送数据
```
Blinker.print(data)
```
<!-- 发送一个Json数据, 如 {text1:data}
```
Blinker.print(text1, data)
```  
发送一个带单位的Json数据, eg: {"temp":"30.2 °C"}
```
Blinker.print("temp", 30.2, "°C")
``` -->
>发送的Json数据可以在 Blinker APP 的 TEXT 组件中显示  

```
*发送数据最大为 128 字节  
*MQTT方式接入时, print需间隔1s以上  
例:  
Blinker.print("hello");  
Blinker.delay(1000);  
Blinker.print("world);  
```  

#### Blinker.beginFormat() && Blinker.endFormat()
当使用 **beginFormat** 时, **print** 发送出的数据都将以 Json 格式存入发送数据中。 这个发送数据将在使用 **endFormat** 时发送出去。
```
Blinker.beginFormat();  
Blinker.print({"Hello":"Blinker"});
Blinker.print({"start":"end"});
Blinker.print({"number":123});
Blinker.endFormat();
```
>使用 endFormat 后, 发送的 Json 数据: {"Hello":"Blinker","start":"end","number":123}  

#### Blinker.notify()
使用 **notify** 时, 发送数据以感叹号开始, 将会发送消息通知到app, 否则将会发送Json数据到app  

发送通知
```
Blinker.notify("!notify");
```
发送Json数据, 如 {"notice":"notify"}
```
Blinker.notify("notify");
```

### App Widgets
<!-- ### Blinker.wInit()
组件初始化, 建议在使用前初始化 **Button** 、**Slider** 、 **Toggle** 及 **RGB**
```
Blinker.wInit("ButtonName", W_BUTTON)  
Blinker.wInit("SliderName", W_SLIDER)  
Blinker.wInit("ToggleName", W_TOGGLE)
Blinker.wInit("RGBName", W_RGB)//键词, 类型  
```
>类型:  
>W_BUTTON 按键  
>W_SLIDER 滑动条  
>W_TOGGLE 开关  
>W_RGB    RGB调色板   -->


#### Blinker.button() 
读取开关/按键数据, 按下(Pressed)时返回true, 松开(Released)时返回false
```
Blinker.button('ButtonKey', function(msg) {
    if (msg == 'tap') {
        console.log('Button tap!');
    }
    else if (msg == 'press') {
        console.log('Button pressed!');
    }
    else if (msg == 'pressup') {
        console.log('Button release!');
    }
});
```
#### Blinker.slider()
读取滑动条数据
```
Blinker.slider('SliderKey', function(msg) {
    console.log('Slider read! ', msg);
});
```
#### Blinker.toggle() 
读取拨动开关数据, 打开(ON)时返回true, 关闭(OFF)时返回false
```
Blinker.toggle('ToggleKey', function(msg) {
    console.log('Toggle read! ', msg);
});
```
#### Blinker.joystick()
读取摇杆数据
```
Blinker.joystick(function(msg) {
    console.log('Joystick read! ', msg);
    console.log('X read! ', msg[0].toString());
    console.log('Y read! ', msg[1].toString());
});
```
#### Blinker.ahrs()
开启手机 **AHRS** 功能
```
Blinker.attachAhrs();
```
读取 **AHRS** 数据
```
Blinker.ahrs(function(msg) {
    console.log('AHRS read! ', msg);
    console.log('YAW read! ', msg[0].toString());
    console.log('PITCH read! ', msg[1].toString());
    console.log('ROLL read! ', msg[2].toString());
});
```
关闭手机 **AHRS** 功能
```
Blinker.dettachAhrs();
```
#### Blinker.gps()
<!-- 刷新手机 **GPS** 功能
```
Blinker.freshAhrs();
``` -->
读取 **GPS** 数据
```
Blinker.gps(function(msg) {
    console.log('GPS read! ', msg);
    console.log('LANG read! ', msg[0].toString());
    console.log('LAT read! ', msg[1].toString());
});
```
> LONG 经度  
> LAT 维度  

#### Blinker.rgb()
读取 **RGB** 数据
```
Blinker.rgb("RGBKEY",function rgb1(msg) {
    console.log('RGB read! ', msg);
    console.log('R read! ', msg[0].toString());
    console.log('G read! ', msg[1].toString());
    console.log('B read! ', msg[2].toString());
});
```
#### Blinker.vibrate()
发送手机振动指令, 震动时间, 单位ms 毫秒, 数值范围0-1000, 默认为500
```
Blinker.vibrate();
Blinker.vibrate(255);  
```
<!-- ## 设备延时
### Blinker.delay()
延时函数, 在延时过程中仍保持设备间连接及数据接收处理
```
Blinker.delay(500)
```
>*为了连接设备成功, 需要延时时务必使用该函数;  
>使用此函数可以在延时期间连接设备及接收数据并处理数据, 延时完成后才能执行后面的程序;   -->
### Debug
如果你想调试输出更多细节信息 :
```
const blinker = require('/usr/lib/node_modules/blinker');
const Blinker = new blinker('BLINKER_WIFI');

Blinker.setDebug('BLINKER_DEBUG_ALL');
Blinker.begin();
```
### LOG
开启调试输出 (Debug) 后可以使用 **BLINKER_LOG()** 打印输出调试信息:
```
Blinker.log("detail message 1")  
Blinker.log("detail message 1", " 2")   
```

## 感谢
[ws](https://github.com/websockets/ws) - Blinker 用这个库建立了一个 websocket 服务器  
[node-mdns-js](https://github.com/mdns-js/node-mdns-js) - Blinker 用这个库建立了一个 mDNS 服务  
[MQTT.js](https://github.com/mqttjs/MQTT.js) - Blinker 用这个库建立了一个 MQTT Client  
[requests](https://github.com/requests/requests) - Blinker 用这个库发送网络请求  
[bluez](http://www.bluez.org/) - Blinker 用这些库建立BLE服务  
