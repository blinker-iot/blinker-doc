## 技术支持
[讨论/建议/bug报告](https://www.arduino.cn/forum-132-1.html)  
[提问引导](https://www.arduino.cn/thread-83658-1-1.html)  
[Blinker GitHub](https://github.com/blinker-iot/)  
[本文档Git](https://github.com/blinker-iot/blinker-doc)  

## 快速开始  
blinker支持多种主流通信方式，如：**蓝牙** 、 **WiFi** ，理论上只要是支持蓝牙或者WiFi的设备，都可以使用blinker连接  

使用WiFi接入，当设备和手机在同一个局域网中，为局域网通信，其余情况，使用MQTT远程通信  
我们提供了对主流硬件平台支持，点击你希望使用的设备和接入方式，即可查看快速接入教程  
  
- ***Arduino***  
[arduino-蓝牙接入](?file=001-快速开始/01-arduino-蓝牙接入 "arduino-蓝牙接入")
- ***esp8266开发板 / WiFiduino / ESPduino***  
[esp8266-WiFi接入](?file=001-快速开始/02-esp8266-WiFi接入 "esp8266-WiFi接入")
- ***esp32开发板***  
[esp32-蓝牙接入](?file=001-快速开始/03-esp32-蓝牙接入 "esp32-蓝牙接入")  
[esp32-WiFi接入](?file=001-快速开始/04-esp32-WiFi接入 "esp32-WiFi接入")
- ***Linux开发板 / 树莓派 / 香蕉派***   
[树莓派-蓝牙接入](?file=001-快速开始/07-树莓派-蓝牙接入 "树莓派-蓝牙接入")  
[树莓派-WiFi接入](?file=001-快速开始/09-树莓派-WiFi接入 "树莓派-WiFi接入")  
- ***esp8266模块接入（AT指令）***  
[esp8266模块-WiFi接入](?file=001-快速开始/10-esp8266模块-WiFi接入 "esp8266模块-WiFi接入")
- ***GPRS模块接入（AT指令）***  
见blinker lib例程  
- ***NB-IoT模块接入（AT指令）***  
仅企业版支持  
- ***LoRaWAN接入（AT指令）***  
仅企业版支持  


## 使用须知
==1.你使用的是blinker开发者版本，我们会不定期更新支持库、App及服务器端程序，请确认您使用的是最新版本，才能正常使用blinker各功能==  
==2.我们不对开发者版本做稳定性承诺==  
==3.有商业使用、或独立部署需求，请购买企业版blinker，联系方式（QQ：183999988）==  
<br />
==本文档适用于blinker 2.0，请确保app和设备端sdk都为2.x版本==  
<br />
Blinker官方网站：https://blinker.app  
github：https://github.com/blinker-iot  

## blinker是什么？  
blinker是一套跨硬件、跨平台的物联网解决方案，提供APP端、设备端、服务器端支持，使用公有云服务进行数据传输存储。可用于智能家居、数据监测等领域，可以帮助用户更好更快地搭建物联网项目。
![](assets/000/blinker-all.jpg)

### 关于blinker DIY
blinker DIY是基于blinker，面向个人开发者的物联网设备开发方案，开发者可以使用它轻松快捷的开发物联网设备。

### blinker具有以下特性：  
- 其由服务器端、app端、设备端组成，可以部署到几乎所有物联网平台  
- app端支持ios、android  
- 设备端可以使用蓝牙、WiFi、MQTT等方式接入，支持Arduino、freeRTOS、mbed OS、Linux等开发平台  
- 服务器端可以部署到阿里云、腾讯云、OneNET、百度云、AWS、google cloud等平台  
- 通过界面布局器，DIY用户可自己拖拽布局设备控制界面，自由打造你的物联网设备  
- 通过专属SDK，认证用户可以使用Blinker开发自己的产品，并用于商业用途  
  
### blinker能做啥？  
- 快速开发物联网 / 智能家居 / 无线遥控项目  
- 手机 / 语音助手 控制设备  
- 蓝牙ble / 局域网WiFi / 远程MQTT 接入设备  
  
## blinker APP和支持库  
blinker库封装了不同硬件平台的底层代码，提供了一套物联网设备开发api。  
开发者不用再考虑网络适配、不用再烦恼硬件差异，只用更好的聚焦业务逻辑，即可进行畅快的物联网开发。  
使用blinker库，无论开发者使用何种硬件、何种开发方式、何种云平台，开发起来都大同小异。  

### APP下载  
***Android下载：***  
[点击下载](https://github.com/blinker-iot/app-release/releases)  
或在应用商店搜索“blinker”下载安装  
已上架的android应用商店有：Google Play、腾讯应用宝、360应用商店、三星应用商店、锤子应用商店  
==需要Android 5.0以上版本才能正常使用==  
***IOS下载：***  
[点击下载](https://itunes.apple.com/cn/app/id1357907814)  
或在app store中搜索“blinker”下载  
<br />  

### 硬件开发
- [基础知识](?file=002-开发入门/000-基础知识 "基础知识")
- [支持的设备](?file=003-硬件开发/01-设备端支持 "支持的设备")
- [Arduino支持](?file=003-硬件开发/02-Arduino支持 "Arduino支持")
- [通信指令](?file=003-硬件开发/08-通信指令 "通信指令")
- [接入其他设备](?file=003-硬件开发/09-接入其他设备 "接入其他设备")
<br />  


## FAQ  
1. 什么硬件可以连接blinker？  
[硬件支持情况](?file=003-硬件开发/01-支持的设备 "支持的设备")  

2. 是否可以远程控制设备？  
可以，以MQTT方式接入设备，即可进行远程控制  

3. 是否支持IOS？  
支持，在app store中搜索“blinker”下载  

4. blinker商业版和DIY版本有什么区别？  
blinker是一个面向商业用户的解决方案，同时blinker DIY为开发者提供便捷的原型开发能力  
blinker商业版功能更多，如语音控制、云存储、数据分析与统计、批量设备配网 等  