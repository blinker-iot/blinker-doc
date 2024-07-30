# NB-IoT支持
**目前只支持SIM7020C AT模块在NBIoT中使用MQTT方式接入**  

## 准备工作

### 硬件准备  
arduino开发板([查看支持的设备](https://diandeng.tech/doc/device-support))  
SIM7020C模块(支持NBIoT的物理网卡等)  

### 软件准备  

#### 下载并安装blinker APP  

**Android下载：**  
[点击下载](https://github.com/blinker-iot/app-release/releases) 或 在android应用商店搜索“blinker”下载安装  
**IOS下载：**  
[点击下载](https://itunes.apple.com/cn/app/id1357907814) 或 在app store中搜索“blinker”下载  


#### 下载并安装blinker Arduino库  

[点击下载](https://github.com/blinker-iot/blinker-library/archive/master.zip)  
**Windows：**将下载好的blinker库解压到 **我的电脑>文档>Arduino>libraries** 文件夹中  
**Mac OS：**将下载好的blinker库解压到 **文稿>Arduino>libraries** 文件夹中  
  

## 在app中添加设备，获取Secret Key  

1. 进入App，点击右上角的“+”号，然后选择 **添加设备**    
2. 点击选择**Arduino** > **WiFi接入**  
3. 复制申请到的**Secret Key**  

## DIY界面  

1. 在设备列表页，点击设备图标，进入设备控制面板  
2. 首次进入设备控制面板，会弹出向导页
3. 在向导页点击 **载入示例**，即可载入示例组件 

   
## 编译并上传示例程序 

打开Arduino IDE，通过 **文件>示例>Blinker>Blinker_NBIoT/NBIoT_SIM7020** 打开例程  
在程序中找到如下变量，填入您申请到的Secret Key(auth) 如： 

``` cpp
char auth[] = "abcdefghijkl"; //上一步中在app中获取到的Secret Key
```
设置SIM7020C模块接入串口：
```cpp
Blinker.begin(auth, 4, 5, 9600); // 设置数字IO 4(RX) 5(TX) 及波特率 9600 bps
```

**例程中宏LED_BUILTIN为开发板厂家定义的连接板载LED的引脚，如果您选择的开发板没有定义LED_BUILTIN，可以自行修改为您要使用的引脚**  
编译并上传程序到esp8266开发板，打开串口调试器  
当看到提示“MQTT Connected!”，说明设备已经成功连接到MQTT服务器  

## 恭喜！一切就绪  

在APP中点击刚才您添加的设备，即可进入控制界面，点点按钮就可以控制Arduino上的LED灯开关  
另一个按钮也点下试试，放心，您的手机不会爆炸~  

## 进一步使用blinker

#### 想了解各接入方式的区别？  
看看[添加设备](?file=002-开发入门/001-添加设备 "添加设备")  

#### 想深入理解以上例程？  

看看[Arduino开发入门](?file=002-开发入门/002-Arduino开发入门 "Arduino开发入门")  

#### 更多实例？

看看[Arduino实例教程](https://arduino.me/s/blinker-arduino)  

#### 想制作与众不同的物联网设备？  

看看[自定义界面](?file=005-App使用/02-自定义布局 "自定义布局") 和 [Arduino 支持库函数参考](https://diandeng.tech/doc/arduino-support "Arduino支持")  

## 完整示例程序

``` cpp
#define BLINKER_NBIOT_SIM7020

#include <Blinker.h>

char auth[] = "Your Device Secret Key";

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
    BLINKER_DEBUG.stream(Serial);
    
    // 初始化有LED的IO
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    // 初始化blinker
    Blinker.begin(auth, D6, D7, 9600);
    Blinker.attachData(dataRead);
    Button1.attach(button1_callback);
}

void loop() {
    Blinker.run();
}
```

## 为什么设备显示不在线？  

0. blinker App如何判断设备是否在线？  

blinker App在 **App打开时、进入设备页面时、在设备页面中每隔一定时间** 会向设备发送心跳请求，内容为**{"get":"state"}**。  
设备收到请求后，会返回**{"state":"online"}**，app接收到这个返回，即会显示设备在线。  

1. 程序没有成功上传到开发板  

解决办法：重新上传，上传后打开串口监视器，确认程序正确运行  

2. 程序中没有设置正确的ssid和密码，导致没有连接上网络  

解决办法：设置后再重新上传程序，上传后打开串口监视器，确认程序正确运行  

3. 程序错误，导致程序运行不正确  

解决办法：先使用并理解blinker例程，再自由发挥  

4. 开发板供电不足   

解决办法：换电源 或 换USB口  
