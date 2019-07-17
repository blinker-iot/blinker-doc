# 使用esp8266 & WiFi接入
==自blinker App 2.1.1起，原WiFi接入和MQTT已经合并为新WiFi接入==  

使用WiFi接入，当设备和手机在同一个局域网中，为局域网通信  
其余情况，使用MQTT远程通信  

>1. [准备工作](#准备工作 "准备工作")
	1. [硬件准备](#硬件准备 "硬件准备")
	1. [软件准备](#软件准备 "软件准备")
1. [在app中添加设备，获取Secret Key](#在app中添加设备，获取Secret Key "在app中添加设备，获取Secret Key")
1. [DIY界面](#DIY界面 "DIY界面")
1. [编译并上传示例程序](#编译并上传示例程序 "编译并上传示例程序")
1. [恭喜！一切就绪](#恭喜！一切就绪 "恭喜！一切就绪")
1. [进一步使用blinker](#进一步使用blinker "进一步使用blinker")
1. [完整示例程序](#完整示例程序 "完整示例程序")
1. [为什么设备显示不在线？](#为什么设备显示不在线？ "为什么设备显示不在线？")
1. [为什么无法切换到局域网通信？](#为什么无法切换到局域网通信？ "为什么无法切换到局域网通信？")



## 准备工作
### 硬件准备  
esp8266开发板([查看支持的设备](?file=003-硬件开发/01-设备端支持 "支持的设备"))  

### 软件准备  
#### Arduino IDE需安装好esp8266扩展  
[Arduino IDE](https://www.arduino.cc/en/Main/Software) 1.8.7或更新版本  
务必使用 **2.5.0** 及以上release版本的 ESP8266 Arduino package  
[常规安装方法](https://github.com/esp8266/Arduino)  
[中国大陆安装方法(windows)](https://www.arduino.cn/thread-76029-1-1.html)  

#### 下载并安装blinker APP  
***Android下载：***  
[点击下载](https://github.com/blinker-iot/app-release/releases)  
或 在android应用商店搜索“blinker”下载安装  
***IOS下载：***  
[点击下载](https://itunes.apple.com/cn/app/id1357907814)  
或 在app store中搜索“blinker”下载  
#### 下载并安装blinker Arduino库  
[点击下载](https://github.com/blinker-iot/blinker-library/archive/master.zip)  
**Windows：**将下载好的blinker库解压到 **我的电脑>文档>Arduino>libraries** 文件夹中  
**Mac OS：**将下载好的blinker库解压到 **文稿>Arduino>libraries** 文件夹中  
  
## 在app中添加设备，获取Secret Key  
1. 进入App，点击右上角的“+”号，然后选择 **添加设备**    
2. 点击选择==Arduino== > ==WiFi接入==  
3. 选择要接入的服务商  
4. 复制申请到的==Secret Key==  

## DIY界面  
1. 在设备列表页，点击设备图标，进入设备控制面板  
2. 首次进入设备控制面板，会弹出向导页
3. 在向导页点击 **载入示例**，即可载入示例组件 
   
## 编译并上传示例程序 
打开Arduino IDE，通过 **文件>示例>Blinker>Blinker_Hello/Hello_WiFi** 打开例程  
在程序中找到如下变量，填入你申请到的Secret Key(auth)和要连接的WiFi热点名(ssid)、密码(pswd)，如： 
```c++
char auth[] = "abcdefghijkl"; //上一步中在app中获取到的Secret Key
char ssid[] = "abcdefg"; //你的WiFi热点名称
char pswd[] = "123456789"; //你的WiFi密码
```
==例程中宏LED_BUILTIN为开发板厂家定义的连接板载LED的引脚，如果你选择的开发板没有定义LED_BUILTIN，可以自行修改为你要使用的引脚==  
编译并上传程序到esp8266开发板，打开串口调试器  
当看到提示“MQTT Connected!”，说明设备已经成功连接到MQTT服务器  

## 恭喜！一切就绪  
在APP中点击刚才你添加的设备，即可进入控制界面，点点按钮就可以控制Arduino上的LED灯开关  
另一个按钮也点下试试，放心，你的手机不会爆炸~  
<br />

## 进一步使用blinker
#### 想了解各接入方式的区别？  
看看[添加设备](?file=002-开发入门/001-添加设备 "添加设备")  
#### 想深入理解以上例程？  
看看[Arduino开发入门](?file=002-开发入门/002-Arduino开发入门 "Arduino开发入门")  
#### 更多实例？
看看[Arduino实例教程](?file=002-开发入门/003-Arduino实例教程 "Arduino实例教程")  
#### 想制作与众不同的物联网设备？  
看看[自定义界面](?file=005-App使用/02-自定义布局 "自定义布局") 和 [Arduino 支持库](?file=003-硬件开发/02-Arduino支持 "Arduino支持")  


## 完整示例程序
```c++

#define BLINKER_PRINT Serial
#define BLINKER_WIFI

#include <Blinker.h>

char auth[] = "Your Device Secret Key";
char ssid[] = "Your WiFi network SSID or name";
char pswd[] = "Your WiFi network WPA password or WEP key";

// 新建组件对象
BlinkerButton Button1("btn-abc");
BlinkerNumber Number1("num-abc");

int counter = 0;

// 按下按键即会执行该函数
void button1_callback(const String & state) {
    BLINKER_LOG("get button state: ", state);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}

// 如果未绑定的组件被触发，则会执行其中内容
void dataRead(const String & data)
{
    BLINKER_LOG("Blinker readString: ", data);
    counter++;
    Number1.print(counter);
}

void setup() {
    // 初始化串口
    Serial.begin(115200);

    #if defined(BLINKER_PRINT)
        BLINKER_DEBUG.stream(BLINKER_PRINT);
    #endif
    
    // 初始化有LED的IO
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    // 初始化blinker
    Blinker.begin(auth, ssid, pswd);
    Blinker.attachData(dataRead);
    Button1.attach(button1_callback);
}

void loop() {
    Blinker.run();
}
```

## 为什么设备显示不在线？  
1. 程序没有成功上传到开发板  
解决办法：重新上传，上传后打开串口监视器，确认程序正确运行  

2. 程序中没有设置正确的ssid和密码，导致没有连接上网络  
解决办法：设置后再重新上传程序，上传后打开串口监视器，确认程序正确运行  

3. 程序错误，导致程序运行不正确  
解决办法：先使用并理解blinker例程，再自由发挥  

4. 开发板供电不足   
解决办法：换电源 或 换USB口  

## 为什么无法切换到局域网通信？  
1. 路由器开启了AP隔离功能或禁止了UDP通信，从而阻止了局域网中设备的发现和通信  
解决办法：关闭路由器AP隔离功能 或 允许UDP通信；如果找不到相关设置，通常可重置路由器解决  
2. mdns没有及时发现设备  
解决办法：在首页下拉刷新，可以重新搜索局域网中的设备  

## blinker QQ群  
blinker用户交流群   **301438087**  （初学者自行交流）  
blinker技术支持群   **775818454**  （官方技术支持，仅限github已Star的用户加群）  