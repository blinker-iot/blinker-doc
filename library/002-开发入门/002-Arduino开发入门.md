# Arduino端程序开发入门  
本文档，适用于Arduino、esp8266、esp32等使用Arduino SDK开发的硬件  

>1. [接入示例](#接入示例 "接入示例")
1. [开启调试信息](#开启调试信息 "开启调试信息")
1. [blinker初始化/选择连接方式](#blinker初始化/选择连接方式 "blinker初始化/选择连接方式")
	1. [蓝牙接入](#蓝牙接入 "蓝牙接入")
	1. [WiFi接入](#WiFi接入 "WiFi接入")
1. [组件初始化/绑定组件](#组件初始化/绑定组件 "组件初始化/绑定组件")
1. [Blinker运行时](#Blinker运行时 "Blinker运行时")
1. [组件操作](#组件操作 "组件操作")
1. [数据管理](#数据管理 "数据管理")
	1. [检测未解析的数据](#检测未解析的数据 "检测未解析的数据")
	1. [读取数据](#读取数据 "读取数据")
	1. [发送数据](#发送数据 "发送数据")


## 接入示例  
这里以ESP8266/ESP32 WiFi接入为例  
```c++
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

    BLINKER_DEBUG.stream(Serial);
    
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

## blinker初始化/选择连接方式  
```arduino
#define BLINKER_WIFI
```
用于指定设备接入方式，你还可以使用 **BLINKER_BLE**，不同的接入方式对应的Blinker初始化函数也不同：
### 蓝牙接入
```arduino
#define BLINKER_BLE  
#include <Blinker.h>  

void setup() {  
    Blinker.begin();  
}
```
### WiFi接入  
```arduino
#define BLINKER_WIFI  
#include <Blinker.h>  

void setup() {  
    Blinker.begin(auth, ssid, pswd);  
}
```

## 新建组件对象/绑定组件  
```arduino
BlinkerButton Button1("btn-abc");
BlinkerNumber Number1("num-abc");
```
使用组件的键名创建对应的对象可以将设备与blinker app界面上的UI组件进行绑定。  
key为组件的键名，在app中切换到编辑模式可以看到；  
blinker库定义了多种组件类型，如 **BlinkerSlider BlinkerRGB BlinkerNumber BlinkerText**  

## 注册组件回调
回调函数
```arduino
void button1_callback(const String & state) {
    BLINKER_LOG("get button state: ", state);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}
```
注册回调函数
```arduino
Button1.attach(button1_callback);
```
当app中组件触发并发送到设备端时将触发该组件注册的回调函数  

**使用方法：**
```arduino
BlinkerSlider Slider1("Slider_1");  //绑定滑动条  
BlinkerRGB RGB1("RGB_1");           //绑定取色器  
BlinkerNumber NUM1("NUM_1");        //绑定数字组件  
BlinkerText Text1("TEXTE_1");       //绑定文字组件  
```

## 开启调试信息
```arduino
BLINKER_DEBUG.stream(Serial);
```
用于指定调试信息输出的串口，设备开发时调试使用，项目或产品成型后，可以删除不用  

## Blinker运行时  
```arduino
void loop() {
    Blinker.run();
}
```
Blinker.run()语句负责处理Blinker收到的数据，每次运行都会将设备收到的数据进行一次解析。  
在使用WiFi接入时，该语句也负责保持网络连接  


## 组件操作
```
void button1_callback(const String & state) {
    BLINKER_LOG("get button state: ", state);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}
```
触发该组件注册的回调函数时将返回该组件对应的状态值  
其他组件操作可见 [Arduino支持](?file=003-硬件开发/02-Arduino支持)  


## 数据管理  
<!-- ### 检测未解析的数据  
```
Blinker.available()
```
available()可以检测是否收到未解析的数据  
如果app发送的数据，不是绑定过的组件数据，blinker将不会解析这些数据  
此时你可以使用available()检测是否有未解析的数据，返回为true，则有未解析数据  

### 读取数据
```
Blinker.readString()
```
使用Blinker.readString()即读取到数据，返回值即为数据内容   -->
### 读取数据的回调函数
```
void dataRead(const String & data)
{
    BLINKER_LOG("Blinker readString: ", data);
    counter++;
    Number1.print(counter);
}
```
可以检测是否收到未解析的数据  
如果app发送的数据，不是绑定过的组件数据，blinker将不会解析这些数据  
此时你可以回调函数获取这些未解析的数据。
### 注册该回调函数
```
Blinker.attachData(dataRead);
```

### 发送数据
```
Blinker.print(BlinkerTime);
Blinker.print("millis", BlinkerTime);
```
使用print可以向app发送数据，其形式有二：
```
Blinker.print(value);
```
当只有一个参数时,发送的是一个内容为value的纯字符串  
```
Blinker.print(key, value);
```
但有两个参数时，发送的是一个json数据，如{"millis":1000}  
如果数据键名对应app上的文本组件、开关组件、滑块组件，app收到数据后，会找到对应的键名的组件，并将值传递给组件，组件会以自己的方式呈现出这个数据  

#### 特定指令
```
Blinker.vibrate()
```
blinker app能接收一些特定指令，但设备端调用api发送特定指令后，app会执行相应操作。  
如使用Blinker.vibrate()即会让手机震动。  

***  
你可以通过 [Arduino支持](?file=003-硬件开发/02-Arduino支持)了解更多blinker api用法