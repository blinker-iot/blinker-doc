# blinker Arduino支持库
针对嵌入式设备的blinker库，需配合arduino sdk使用。  
github：https://github.com/blinker-iot/blinker-library  

==[开发注意事项](?file=020-Q%26A及开发常见问题/02-开发注意事项 "Arduino支持")==  

## 0.3.0 版本增删内容说明
- 重写了代码结构
- 将 WiFi/MQTT 接入合并为 WiFi 接入
- 增加 ESP 多任务支持
- 废弃 BlinkerJoystick 在 WiFi 接入的支持(BLE仍然支持)

==blinker库更新到v0.3.0 版本，由于版本变动较大，需删除以前版本的库后安装(不可以直接覆盖)==

## 注意
==务必更新为最新的ESP8266/ESP32 Arduino package==  
==使用IDE板卡管理器安装 2.5.0 及以上版本的 ESP8266 package==   
==使用IDE板卡管理器安装 1.0.2 及以上版本的 ESP32 package==   
如果不能使用IDE安装，请到以下路径查询是否有老版本Arduino package，若有老版本将其删除后再安装  

> %USERPROFILE%\\AppData\\Local\\Arduino15  
> %USERPROFILE%\\Documents\\Arduino\\hardware  

[点此下载，默认路径安装即可](https://pan.baidu.com/s/1Cg3rn0SMh32CDbdAJlDqVg)  


>1. [支持的硬件](#支持的硬件 "支持的硬件")
1. [支持的接入方式](#支持的接入方式 "支持的接入方式")
1. [准备工作](#准备工作 "准备工作")
1. [Blinker接口函数](#Blinker接口函数 "Blinker接口函数")
	1. [设备配置](#设备配置 "设备配置")
	1. [连接管理](#连接管理 "连接管理")
	1. [数据管理](#数据管理 "数据管理")
    1. [ESP多任务](#ESP多任务 "ESP多任务")
    1. [心跳包](#心跳包 "心跳包")
    1. [设备简要信息](#设备简要信息 "设备简要信息")
	1. [App组件](#App组件 "App组件")
    1. [选项卡](#选项卡 "选项卡")
    1. [NTP时间](#NTP时间 "NTP时间")
	1. [设备延时](#设备延时 "设备延时")
	1. [BlinkerBridge](#BlinkerBridge "BlinkerBridge")
    1. [图表-历史数据](#图表-历史数据 "图表-历史数据")
    1. [SMS短信](#SMS短信 "SMS短信")
    1. [通知推送](#通知推送 "通知推送")
    1. [微信推送](#微信推送 "微信推送")
    1. [天气查询](#天气查询 "天气查询")
    1. [AQI查询](#AQI查询 "AQI查询")
	1. [Debug](#Debug "Debug")
    1. [LOG](#LOG "LOG")
1. [感谢](#感谢 "感谢")


## 支持的硬件
* Arduino boards
    - Arduino Uno, Duemilanove, Leonardo, Nano, Mini, Pro Mini, Pro Micro, zero, Due, Mega  
* 使用 [esp8266/arduino](https://github.com/esp8266/arduino) 的ESP8266  
* 使用 [espressif/arduino-esp32](https://github.com/espressif/arduino-esp32) 的ESP32  
  
## 支持的接入方式
* Bluetooth4.x (BLE)  
* WiFi  
<!-- * MQTT   -->
  
## 准备工作
使用前你需要做好如下准备:
* [Arduino IDE](https://www.arduino.cc/en/Main/Software) 1.8.7或更新版本  
* 使用 Arduino IDE 的开发板管理器安装 [esp8266/arduino](https://github.com/esp8266/arduino)  
* 按照 [安装说明](https://github.com/espressif/arduino-esp32#installation-instructions) 安装 [espressif/arduino-esp32](https://github.com/espressif/arduino-esp32)  
  
## Blinker接口函数  
### 设备配置  
#### Blinker.begin()  
使用 **Blinker.begin()** 来配置 Blinker:  
```c++
Blinker.begin(...);
```
根据你使用的连接方式选择不同的参数用于配置Blinker  
  

BLE:
```c++
#define BLINKER_BLE  
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin();  
}
```  
  
>串口蓝牙模块:  
>**Blinker.begin()** 将使用默认设置配置 Serial(默认使用软串口)   
>  
>Blinker.begin();// 默认设置: 数字IO 2(RX) 3(TX), 波特率 9600 bps  
>Blinker.begin(4, 5);// 设置数字IO 4(RX) 5(TX), 默认波特率 9600 bps  
>Blinker.begin(4, 5, 115200);// 设置数字IO 4(RX) 5(TX) 及波特率 115200 bps  
>  
>若配置时Blinker.begin(0, 1);  
>0 1对应硬串口的RX TX, 库会默认使用硬串口与BLE模块进行通信  
>Blinker.begin(15, 14);//Arduino MEGA中如15, 14对应硬串口Serial3  
>  
>注意使用软串口时:  
>使用Arduino MEGA时以下IO可以设置为RX: 10, 11, 12, 13, 50, 51, 52, 53, 62, 63, 64, 65, 66, 67, 68, 69  
>使用Arduino Leonardo时以下IO可以设置为RX: 8, 9, 10, 11, 14, 15, 16  
  
WiFi:
```c++
#define BLINKER_WIFI  
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth, ssid, pswd);  
}
```  
  
<!-- MQTT:

#define BLINKER_MQTT  
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth, ssid, pswd);  
} -->

> WiFi 支持的硬件: WiFiduino, WiFiduino32, ESP8266, ESP32  

GPRS:
```c++
#define BLINKER_GPRS_AIR202  
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth);  
}
```  

>GPRS AT模块 AIR202:  
>**Blinker.begin()** 将使用默认设置配置 Serial(默认使用软串口)   
>  
>Blinker.begin(auth);// 默认设置: 数字IO 2(RX) 3(TX), 波特率 9600 bps  
>Blinker.begin(auth, 4, 5);// 设置数字IO 4(RX) 5(TX), 默认波特率 9600 bps  
>Blinker.begin(auth, 4, 5, 115200);// 设置数字IO 4(RX) 5(TX) 及波特率 115200 bps  
>  
>若配置时Blinker.begin(auth, 0, 1);  
>0 1对应硬串口的RX TX, 库会默认使用硬串口与BLE模块进行通信  
>Blinker.begin(auth, 15, 14);//Arduino MEGA中如15, 14对应硬串口Serial3  
>  
>注意使用软串口时:  
>使用Arduino MEGA时以下IO可以设置为RX: 10, 11, 12, 13, 50, 51, 52, 53, 62, 63, 64, 65, 66, 67, 68, 69  
>使用Arduino Leonardo时以下IO可以设置为RX: 8, 9, 10, 11, 14, 15, 16  
  
NBIoT:
```c++
#define BLINKER_NBIOT_SIM7020  
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth);  
}
```  

>NBIoT AT模块 SIM7020C:  
>**Blinker.begin()** 将使用默认设置配置 Serial(默认使用软串口)   
>  
>Blinker.begin(auth);// 默认设置: 数字IO 2(RX) 3(TX), 波特率 9600 bps  
>Blinker.begin(auth, 4, 5);// 设置数字IO 4(RX) 5(TX), 默认波特率 9600 bps  
>Blinker.begin(auth, 4, 5, 115200);// 设置数字IO 4(RX) 5(TX) 及波特率 115200 bps  
>  
>若配置时Blinker.begin(auth, 0, 1);  
>0 1对应硬串口的RX TX, 库会默认使用硬串口与BLE模块进行通信  
>Blinker.begin(auth, 15, 14);//Arduino MEGA中如15, 14对应硬串口Serial3  
>  
>注意使用软串口时:  
>使用Arduino MEGA时以下IO可以设置为RX: 10, 11, 12, 13, 50, 51, 52, 53, 62, 63, 64, 65, 66, 67, 68, 69  
>使用Arduino Leonardo时以下IO可以设置为RX: 8, 9, 10, 11, 14, 15, 16  
  

**begin()** 主要完成以下配置:  
1.初始化硬件设置;  
2.连接网络并广播设备信息等待app连接;
### 连接管理
#### Blinker.connect()
建立 **Blinker** 设备间连接并返回连接状态, 默认超时时间为10秒
```c++
bool result = Blinker.connect();  
  

uint32_t timeout = 30000;//ms  
bool result = Blinker.connect(timeout);
```
#### Blinker.disconnect()
断开 **Blinker** 设备间连接
```c++
Blinker.disconnect();
```
#### Blinker.connected()
返回 **Blinker** 设备间连接状态
```c++
bool result = Blinker.connected();
```
#### Blinker.run()
此函数需要频繁调用以保持设备间连接及处理收到的数据, 建议放在 **loop()** 函数中
```c++
void loop() {
    Blinker.run();
}
```
### 数据管理
~~#### Blinker.available()~~  
~~检测是否有接收到数据~~  
<!-- ```c++ -->
~~bool result = Blinker.available();~~  
<!-- ``` -->
~~#### Blinker.readString()~~  
~~读取接收到的数据~~
<!-- ```c++ -->
~~String data = Blinker.readString();~~  
<!-- ``` -->
<!-- `*读取数据最大为 256 字节`   -->
<!-- `调用该函数后, 缓存将清空, 再次读取则为空` -->

#### Blinker.attachData()
注册回调函数，当有设备收到APP发来的数据时会调用对应的回调函数  

回调函数:
```c++
void dataRead(const String & data)
{
    BLINKER_LOG("Blinker readString: ", data);

    Blinker.vibrate();
    
    uint32_t BlinkerTime = millis();
    Blinker.print(BlinkerTime);
    Blinker.print("millis", BlinkerTime);
}
```
注册回调函数:
```
Blinker.attachData(dataRead);
```

#### Blinker.print()
发送数据
```c++
Blinker.print(data);
```
发送一个Json数据, 如 {text1:data}
```c++
Blinker.print(text1, data);
```  
发送一个带单位的Json数据, eg: {"temp":"30.2 °C"}
```c++
Blinker.print("temp", 30.2, "°C");
```
<!-- >发送的Json数据可以在 Blinker APP 的 TEXT 组件中显示   -->
==连续发送时, 间隔100ms内发送的数据都会自动格式化后发送(同beginFormat), 若100ms后没有数据发送将把该数据发送出去。==
```c++
Blinker.print("halo","blinker");  
Blinker.print("hello","world");  
Blinker.delay(1000);  
Blinker.print("hello","print"); 
```
> 发送的 Json 数据: {"halo":"blinker","hello":"world"} 与 {"hello":"print"}  
> WiFi 需间隔1s才能继续下一次发送  

<!-- ```c++
*发送数据最大为 128 字节  
*MQTT方式接入时, print需间隔1s以上  
例:  
Blinker.print("hello");  
Blinker.delay(1000);  
Blinker.print("world);  
```   -->

~~#### Blinker.beginFormat()&&Blinker.endFormat()~~  

~~当使用 **beginFormat** 时, **print** 发送出的数据都将以 Json 格式存入发送数据中。 这个发送数据将在使用 **endFormat** 时发送出去。~~  

~~Blinker.beginFormat();~~  
~~Blinker.print("Hello","Blinker");~~  
~~Blinker.print("start","end");~~  
~~Blinker.print("number",123);~~  
~~Blinker.endFormat();~~  

~~>使用 endFormat 后, 发送的 Json 数据: {"Hello":"Blinker","start":"end","number":123}~~  
~~>*MQTT方式接入时, 除间隔1s外建议使用 beginFormat/endFormat 进行数据发送~~  


#### Blinker.notify()
使用 **notify** 时, 发送数据以感叹号开始, 将会发送消息通知到app, 否则将会发送正常Json数据到app  

发送通知
```c++
Blinker.notify("!notify");
```
发送Json数据, 如 {"notice":"notify"}
```c++
Blinker.notify("notify");
```

### ESP多任务
**ESP8266/ESP32** 中启用多任务, 将 **blinker** 相关的设备连接、数据处理等放入单独任务中, 用户代码在 **loop()** 任务中进行, 互不干涉  

==目前ESP8266多任务支持还有点问题, 暂不支持使用==

#### 设备配置  
BLE:
```c++
#define BLINKER_BLE  
#define BLINKER_ESP_TASK

#include <Blinker.h>  
  
void setup() {  
    Blinker.begin();  
    BLINKER_TAST_INIT();
}

void loop() {}
```

WiFi:
```c++
#define BLINKER_WIFI  
#define BLINKER_ESP_TASK

#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth, ssid, pswd); 
    BLINKER_TAST_INIT(); 
}

void loop() {}
```  

### 心跳包
app定时向设备发送心跳包, 设备收到心跳包后会返回设备当前状态  
如果用户有自定义状态需要在收到心跳包时返回, 可调用以下函数:  

**Blinker.attachHeartbeat()**  
用户自定义状态返回的回调函数:
```
void heartbeat()
{
    if (switch_state) BUILTIN_SWITCH.print("on");
    else BUILTIN_SWITCH.print("off");
}
```
注册回调函数:
```
Blinker.attachHeartbeat(heartbeat);
```
> 设备建立连接后app会立刻发送心跳包, 此后每30s-60会发送一次心跳包  

### 设备简要信息
**MQTT设备** 在心跳包中可以返回设备的简要信息, 如当前传感器值等。  
在设备管理页面中会显示设备当前简要信息, 不用进入设备页面查看。  

**Blinker.attachSummary()**
用户自定义状态返回的回调函数:
```
String summary()
{
    String data = "online, switch: " + STRING_format(switch_state ? "on" : "off");

    return data;
}
```
注册回调函数:
```
Blinker.attachSummary(summary);
```

### App组件
<!-- #### Blinker.wInit()
组件初始化, 建议在使用前初始化 **Button** 、**Slider** 、 **Toggle** 及 **RGB**
```
Blinker.wInit("ButtonName", W_BUTTON);  
Blinker.wInit("SliderName", W_SLIDER);  
Blinker.wInit("ToggleName", W_TOGGLE);  
Blinker.wInit("RGBName", W_RGB);//键词, 类型  
```
>类型:  
>W_BUTTON 按键  
>W_SLIDER 滑动条  
>W_TOGGLE 开关  
>W_RGB RGB调色板  
>以上四种组件数量限制为 16个/种

#### Blinker.button() 
读取开关/按键数据, 按下(Pressed)时返回true, 松开(Released)时返回false
```
bool result = Blinker.button("Button1");
```
#### Blinker.slider()
读取滑动条数据
```
uint8_t result = Blinker.slider("Slider1");
```
#### Blinker.toggle() 
读取拨动开关数据, 打开(ON)时返回true, 关闭(OFF)时返回false
```
bool result = Blinker.toggle("Toggle1");
```
#### Blinker.joystick()
读取摇杆数据
```
uint8_t result_X = Blinker.joystick(J_Xaxis);
uint8_t result_Y = Blinker.joystick(J_Yaxis);
``` -->
#### BlinkerButton  
按键组件在App中可以设置 按键/开关/自定义 三种模式:  
- **按键** 模式下支持 点按/长按/释放(tap/pre/pup) 三个动作  
- **开关** 模式下支持 打开/关闭(on/off) 两个动作  
- **自定义** 模式下支持 自定义指令 发送  

**函数** :
- attach()  
    *BlinkerButton.attach()*  
    注册按键的回调函数, 当收到指令时会调用该回调函数
- icon()  
    *BlinkerButton.icon()*  
    设置按键中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/)
- color()  
    *BlinkerButton.color()*  
    设置按键中显示图标的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)  
- text()  
    *BlinkerButton.text()*  
    设置按键中显示的名字或者描述  
    *BlinkerButton.text(text1)*  
    一段描述文字  
    *BlinkerButton.text(text1, text2)*  
    两段描述文字  
- print()  
    *BlinkerButton.print()*  
    发送按键当前的状态(多用于开关模式下反馈开关状态), 并将以上设置一并发送到APP
  
初始化, 创建对象
```c++
#define BUTTON_1 "ButtonKey"

BlinkerButton Button1(BUTTON_1);
```
用于处理 **button** 收到数据的回调函数
```c++
void button1_callback(const String & state)
{
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    BLINKER_LOG("get button state: ", state);

    Button1.icon("icon_1");
    Button1.color("#FFFFFF");
    Button1.text("Your button name or describe");
    Button1.print("on");
}
```

在 **setup()** 中注册回调函数
```c++
Button1.attach(button1_callback);
```

> 在回调函数中, **state** 的值为:  
> - **按键** : "tap"(点按); "pre"(长按); "pup"(释放)  
> - **开关** : "on"(打开); "off"(关闭)  
> - **自定义** : 用户设置的值  
>   
> *也可以在创建对象时注册回调函数:
>> BlinkerButton Button1(BUTTON_1, button1_callback);  

<!-- ##### BlinkerButton.attach()
> 注册按键的回调函数, 当收到指令时会调用该回调函数  

##### BlinkerButton.icon()
> 设置按键中显示的图标(icon), 图标列表及对应图标名称见:  

##### BlinkerButton.color()
> 设置按键中显示图标的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)  

##### BlinkerButton.text()
> 设置按键中显示的名字或者描述  

##### BlinkerButton.print()
> 发送按键当前的状态(多用于开关模式下反馈开关状态), 并将以上设置一并发送到APP   -->

#### BlinkerRGB  
颜色组件, 用于读取/设置RGB及亮度值  

**函数** :
- attach()  
    *BlinkerRGB.attach()*  
    设置颜色组件的回调函数, 当收到指令时会调用该回调函数
- brightness()  
    *BlinkerRGB.brightness()*  
    设置颜色组件的亮度值
- print()  
    *BlinkerRGB.print()*  
    发送用户需要的RGB数值及亮度值到APP  
    *BlinkerRGB.print(R, G, B)*  
    发送RGB及前一次设置的亮度值  
    *BlinkerRGB.print(R, G, B, Brightness)*  
    发送RGB及亮度值

初始化, 创建对象
```c++
#define RGB_1 "RGBKey"

BlinkerRGB RGB1(RGB_1);
```
用于处理 **RGB** 收到数据的回调函数
```c++
void rgb1_callback(uint8_t r_value, uint8_t g_value, 
                    uint8_t b_value, uint8_t bright_value)
{
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    BLINKER_LOG("R value: ", r_value);
    BLINKER_LOG("G value: ", g_value);
    BLINKER_LOG("B value: ", b_value);
    BLINKER_LOG("Rrightness value: ", bright_value);
}
```

在 **setup()** 中注册回调函数
```c++
RGB1.attach(rgb1_callback);
```
> *也可以在创建对象时注册回调函数:
>> BlinkerRGB RGB1(RGB_1, rgb1_callback);  

<!-- BlinkerRGB.attach()
> 设置颜色组件的回调函数, 当收到指令时会调用该回调函数   

BlinkerRGB.brightness()
> 设置颜色组件的亮度值     

BlinkerRGB.print()
> 发送用户需要的RGB数值及亮度值到APP  
>> BlinkerRGB.print(R, G, B)  //发送RGB及前一次设置的亮度值  
>> BlinkerRGB.print(R, G, B, Brightness)  //发送RGB及亮度值   -->

#### BlinkerSlider
滑动条组件, 用于读取/设置滑动条  

**函数** :  
- attach()  
    *BlinkerSlider.attach()*  
    设置滑动条组件的回调函数, 当收到指令时会调用该回调函数  
- color()  
    *BlinkerSlider.color()*  
    设置滑动条组件的颜色 
- print()  
    *BlinkerSlider.print()*  
    发送用户需要的滑动条数值及设置的颜色到APP

初始化, 创建对象
```c++
#define Slider_1 "SliderKey"

BlinkerSlider Slider1(Slider_1);
```
用于处理 **Slider** 收到数据的回调函数
```c++
void slider1_callback(int32_t value)
{
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    BLINKER_LOG("get slider value: ", value);
}
```

在 **setup()** 中注册回调函数
```c++
Slider1.attach(slider1_callback);
```
> *也可以在创建对象时注册回调函数:
>> Slider1(Slider_1, slider1_callback); 

<!-- BlinkerSlider.attach()
> 设置滑动条组件的回调函数, 当收到指令时会调用该回调函数  

BlinkerSlider.color()
> 设置滑动条组件的颜色     

BlinkerSlider.print()
> 发送用户需要的滑动条数值及设置的颜色到APP   -->
 

#### BlinkerNumber
数字组件, 用于发送数据到APP, 显示数字数据  

**函数** :
- icon()  
    *BlinkerNumber.icon()*  
    设置数字组件中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/)
- color()  
    *BlinkerNumber.color()*  
    设置数字组件的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)
- unit()  
    *BlinkerNumber.unit()*  
    设置数字组件中显示的数值的单位  
- print()  
    *BlinkerNumber.print()*  
    发送数字组件当前的数值, 并将以上设置一并发送到APP  

初始化, 创建对象
```c++
#define NUM_1 "NUMKey"

BlinkerNumber NUM1(NUM_1);
```

<!-- BlinkerNumber.icon()
> 设置数字组件中显示的图标(icon), 图标列表及对应图标名称见:  

BlinkerNumber.color()
> 设置数字组件的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)  

BlinkerNumber.unit()
> 设置数字组件中显示的数值的单位  

BlinkerNumber.print()
> 发送数字组件当前的数值, 并将以上设置一并发送到APP   -->

#### BlinkerText
文字组件, 用于发送数据到APP, 显示文字数据  

**函数** :
- print()  
    - icon()  
    *BlinkerText.icon()*  
    设置数字组件中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/)  
    *BlinkerText.print()*  
    发送文字到APP  
    *BlinkerText.print(text1)*  
    发送一段文字  
    *BlinkerText.print(text1, text2)*  
    发送两段文字  

初始化, 创建对象
```c++
#define TEXTE_1 "TextKey"

BlinkerText Text1(TEXTE_1);
```

<!-- BlinkerText.print()
> 发送文字到APP
>> BlinkerText.print(text1)  //发送一段文字  
>> BlinkerText.print(text1, text2)  //发送两段文字  -->

#### BlinkerJoystick
摇杆组件, 读取摇杆X Y 轴的数据  

**函数** :
- attach()  
    *BlinkerJoystick.attach()*  
    设置摇杆组件的回调函数, 当收到指令时会调用该回调函数  

初始化, 创建对象
```c++
#define JOY_1 "JOYKey"

BlinkerJoystick JOY1(JOY_1);
```  

用于处理 **BlinkerJoystick** 收到数据的回调函数
```c++
void joystick1_callback(uint8_t xAxis, uint8_t yAxis)
{
    BLINKER_LOG("Joystick1 X axis: ", xAxis);
    BLINKER_LOG("Joystick1 Y axis: ", yAxis);
}
```

在 **setup()** 中注册回调函数
```c++
JOY1.attach(joystick1_callback);
```
> *也可以在创建对象时注册回调函数:
>> BlinkerJoystick JOY1(JOY_1, joystick1_callback);  

<!-- Joystick.attach()
> 设置摇杆组件的回调函数, 当收到指令时会调用该回调函数   -->

#### BUILTIN_SWITCH
开关组件, 读取/设置默认开关的状态

**函数** :
- attach()  
    *BUILTIN_SWITCH.attach()*  
    设置开关的回调函数, 当收到指令时会调用该回调函数  
- print()  
    *BUILTIN_SWITCH.print()*
    发送开关当前的状态(多用于反馈开关状态)到APP  

用于处理 **BUILTIN_SWITCH** 收到数据的回调函数
```c++
void switch_callback(const String & state)
{
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    BLINKER_LOG("get switch state: ", state);

    BUILTIN_SWITCH.print("on");
}
```

在 **setup()** 中注册回调函数
```c++
BUILTIN_SWITCH.attach(switch_callback);
```

<!-- > **BUILTIN_SWITCH.attach()**  
> 设置开关的回调函数, 当收到指令时会调用该回调函数  
> **BUILTIN_SWITCH.print()**
> 发送开关当前的状态(多用于反馈开关状态)到APP   -->

#### Blinker.ahrs()
开启手机 **AHRS** 功能
```
Blinker.attachAhrs();
```
读取 **AHRS** 数据
```
int16_t result_Yaw = Blinker.ahrs(Yaw);
int16_t result_Roll = Blinker.ahrs(Roll);
int16_t result_Pitch = Blinker.ahrs(Pitch);
```
关闭手机 **AHRS** 功能
```
Blinker.detachAhrs();
```
#### Blinker.gps()
<!-- 刷新手机 **GPS** 功能
```
Blinker.freshAhrs();
``` -->
读取 **GPS** 数据
```
String result_LONG = Blinker.gps(LONG);  
String result_LAT = Blinker.gps(LAT);
```
> LONG 经度  
> LAT 维度  

<!-- #### Blinker.rgb()
读取 **RGB** 数据
```
uint8_t result_R = Blinker.rgb("RGBKEY", R);
uint8_t result_G = Blinker.rgb("RGBKEY", G);
uint8_t result_B = Blinker.rgb("RGBKEY", B);
``` -->
#### Blinker.vibrate()
发送手机振动指令, 震动时间, 单位ms 毫秒, 数值范围0-1000, 默认为500
```
Blinker.vibrate();
Blinker.vibrate(255);  
```

#### BlinkerTimer
定时器组件:
- 定时
- 循环
- 倒计时

##### Blinker.timingState()
查询设备上是否有定时设置;  
```
bool state = Blinker.timingState();
```
##### Blinker.loopState()
查询设备上是否有循环设置;  
```
bool state = Blinker.loopState();
```
##### Blinker.countdownState()
查询设备上是否有倒计时设置;  
```
bool state = Blinker.countdownState();
```
##### Blinker.deleteTiming()  
删除设备上的定时设置;  
##### Blinker.deleteLoop()  
删除设备上的循坏设置;  
##### Blinker.deleteCountdown()  
删除设备上的倒计时设置;  
##### Blinker.deleteTimer()  
删除设备上所有的定时器组件设置;  


### 选项卡
#### BlinkerTab
选项卡组件, 读取/设置选项卡的状态  

**函数** :
- attach()  
    *BlinkerTab.attach()*  
    设置选项卡的回调函数, 当收到指令时会调用该回调函数  
- tab()  
    *BlinkerTab.tab(num)*  
    设置选项卡的某一栏为触发状态, 未设置的则为未触发状态    
- print()  
    *BlinkerTab.print()*
    发送选项卡当前的状态到APP  

初始化, 创建对象
```c++
#define Tab_1 "TabKey"

BlinkerTab Tab1(Tab_1);
```
用于处理 **tab** 收到数据的回调函数
```c++
void tab1_callback(uint8_t tab_set)
{
    BLINKER_LOG("get tab set: ", tab_set);

    switch (tab_set)
    {
        case BLINKER_CMD_TAB_0 :
            tab[0] = true;
            BLINKER_LOG("tab 0 set");
            break;
        case BLINKER_CMD_TAB_1 :
            tab[1] = true;
            BLINKER_LOG("tab 1 set");
            break;
        case BLINKER_CMD_TAB_2 :
            tab[2] = true;
            BLINKER_LOG("tab 2 set");
            break;
        case BLINKER_CMD_TAB_3 :
            tab[3] = true;
            BLINKER_LOG("tab 3 set");
            break;
        case BLINKER_CMD_TAB_4 :
            tab[4] = true;
            BLINKER_LOG("tab 4 set");
            break;
        default:
            break;
    }
}
```
**tab** 反馈时的回调函数
```c++
void tab1_feedback()
{
    for(uint8_t num = 0; num < 5; num++)
    {
        if (tab[num])
        {
            Tab1.tab(num);
            tab[num] = false;
        }
    }
    Tab1.print();
}
```

在 **setup()** 中注册回调函数
```c++
Tab1.attach(tab1_callback, tab1_feedback);
```

<!-- ### SWITCH
APP中默认 **SWITCH** 组件
#### Blinker.switchAvailable()
是否收到APP发来 **SWITCH** 控制指令
```
bool result = Blinker.switchAvailable();
```
#### Blinker.switchGet()
读取 **SWITCH** 状态, 打开(ON)时返回true, 关闭(OFF)时返回false
```
bool state = Blinker.switchGet();
```
#### Blinker.switchUpdate()
发送 **SWITCH** 最新状态, 用户务必在执行完控制动作后返回
```
Blinker.switchUpdate();
```
#### Blinker.switchOn()
设置 **SWITCH** 状态为打开, 会触发 **Blinker.switchAvailable()**
```
Blinker.switchOn();
```
#### Blinker.switchOff()
设置 **SWITCH** 状态为关闭, 会触发 **Blinker.switchAvailable()**
```
Blinker.switchOff();
``` -->
### NTP时间  
> NTP 目前仅试用于WiFi接入  

#### Blinker.setTimezone()  
设置时区, 如: 北京时间为+8:00  
```
Blinker.setTimezone(8.0);
```
#### Blinker.time()
获取当前ntp时间, 单位为秒(s)
```
uint32 times = Blinker.time();
```
#### Blinker.second()
获取当前时间秒数, 单位为秒(s), 获取成功时值: 0-59, 获取失败时值: -1
```
int8_t sec = Blinker.second();
```
#### Blinker.minute()
获取当前时间分钟数, 单位为分(m), 获取成功时值: 0-59, 获取失败时值: -1
```
int8_t min = Blinker.minute();
```
#### Blinker.hour()
获取当前时间小时数, 单位为小时(h), 获取成功时值: 0-23, 获取失败时值: -1
```
int8_t hour = Blinker.hour();
```
#### Blinker.wday()
获取当前时间为当周的日期, 单位为天(d), 获取成功时值: 0-6(依次为周日/一/二/三/四/五/六), 获取失败时值: -1
```
int8_t wday = Blinker.wday();
```
#### Blinker.mday()
获取当前时间为当月第几天, 单位为天(d), 获取成功时值: 1-31, 获取失败时值: -1
```
int8_t mday = Blinker.mday();
```
#### Blinker.yday()
获取当前时间为当年第几天, 单位为天(d), 获取成功时值: 1-366, 获取失败时值: -1
```
int16_t yday = Blinker.yday();
```
#### Blinker.month()
获取当前时间为当年第几月, 单位为月(mon), 获取成功时值: 1-12, 获取失败时值: -1
```
int8_t month = Blinker.month();
```
#### Blinker.year()
获取当前时间对应年, 单位为年(y), 获取成功时值: 20xx, 获取失败时值: -1
```
int16_t year = Blinker.year();
```
### 设备延时
#### Blinker.delay()
延时函数, 在延时过程中仍保持设备间连接及数据接收处理
```
Blinker.delay(500);
```
>*为了连接设备成功, 需要延时时务必使用该函数;  
>使用此函数可以在延时期间连接设备及接收数据并处理数据, 延时完成后才能执行后面的程序;  


### BlinkerBridge
**BlinkerBridge** 功能用于 **WiFi** 设备与设备间的通信(无需使用app进行控制).  

**函数** :
- attach()  
    *BlinkerBridge.attach()*  
    注册bridge的回调函数, 当收到指令时会调用该回调函数  
- print()  
    *BlinkerBridge.print()*    
    发送消息到对应的bridge设备  

初始化, 创建对象
```c++
#define BRIDGE_1 "Your Device Secret Key of bridge to device"

BlinkerBridge BridgeDevice1(BRIDGE_1);
```
用于处理 **BlinkerBridge** 收到数据的回调函数
```c++
void bridge1Read(const String & data)
{
    BLINKER_LOG("BridgeDevice1 readString: ", data);

    // must print Json data
    BridgeDevice1.print("{\"hello\":\"bridge\"}");
}
```

在 **setup()** 中注册回调函数
```c++
BridgeDevice1.attach(bridge1Read);
```

~~#### Blinker.bridge()~~  
~~填入需要 **Bridge** 桥接通信设备的 **authKey** 建立桥接功能, 桥接成功将返回 true, 桥接失败返回 false.~~

~~char bridgeKey[] = "Your Device Secret Key of bridge to device";~~  

~~bool state = Blinker.bridge(bridgeKey);~~  

~~> 建立桥接通信的设备务必属于同一个用户的设备, 一个Diy设备最多可以与4个Diy设备建立桥接通信~~  

~~#### Blinker.bridgeAvailable()~~  
~~检测是否有接收到桥接设备发来的数据~~  
~~char bridgeKey[] = "Your Device Secret Key of bridge to device";~~  

~~bool result = Blinker.bridgeAvailable(bridgeKey);~~  

~~#### Blinker.bridgeRead()~~  
~~读取接收到的数据~~  

~~char bridgeKey[] = "Your Device Secret Key of bridge to device";~~  

~~String data = Blinker.bridgeRead(bridgeKey);~~  
~~`*读取数据最大为 256 字节`~~  
~~`调用该函数后, 缓存将清空, 再次读取则为空`~~  
~~#### Blinker.bridgePrint()~~  

~~发送一个Json数据, 如 {text1:data}~~  

~~char bridgeKey[] = "Your Device Secret Key of bridge to device";~~  

~~Blinker.bridgePrint(bridgeKey, text1, data);~~  

~~发送一个带单位的Json数据, eg: {"temp":"30.2 °C"}~~  

~~char bridgeKey[] = "Your Device Secret Key of bridge to device";~~  

~~Blinker.bridgePrint(bridgeKey, "temp", 30.2, "°C");~~  


~~*发送数据最大为 128 字节~~    
~~*MQTT方式接入时, bridgePrint需间隔1min以上~~    
~~例:~~  
~~Blinker.bridgePrint(bridgeKey, "hello");~~  
~~Blinker.delay(60000);~~    


~~#### Blinker.bridgeBeginFormat()&&Blinker.bridgeEndFormat()~~
~~当使用 **beginFormat** 时, **bridgePrint** 发送出的数据都将以 Json 格式存入发送数据中。 这个发送数据将在使用 **endFormat** 时发送出去。~~  

~~Blinker.bridgeBeginFormat();~~   
~~Blinker.bridgePrint(bridgeKey, "Hello","Blinker");~~  
~~Blinker.bridgePrint(bridgeKey,"start","end");~~  
~~Blinker.bridgePrint(bridgeKey, "number",123);~~  
~~Blinker.bridgeEndFormat();~~  

~~>使用 endFormat 后, 发送的 Json 数据: {"Hello":"Blinker","start":"end","number":123}~~  
~~>*MQTT方式接入时, 除间隔1min外建议使用 beginFormat/endFormat 进行数据发送~~    


### 图表-历史数据
#### Blinker.configUpdate()
上传配置信息到云端
```
Blinker.configUpdate("Hello blinker!");
```
> 上传信息数据最大为 256 字节  
> *限制 1次/分钟  

#### Blinker.configGet()
##### Blinker.attachConfigGet()
注册回调函数，当设备查询到配置信息时会调用对应的回调函数  

回调函数：
```c++
void configData(const String & data)
{
    BLINKER_LOG("configData: ", data);
}
```
注册回调函数：
```
Blinker.attachConfigGet(configData);
```

拉取云端的配置信息
```
Blinker.configGet();
```
> *限制 1次/分钟  

#### Blinker.configDelete()
删除云端的配置信息
```
bool delete = Blinker.configDelete();
```
> *限制 1次/分钟  

#### Blinker.attachDataStorage()
注册回调函数，当设备需要上传数据到云端时会调用对应的回调函数  

回调函数：
```c++
void dataStorage()
{
    Blinker.dataStorage("data1", random(0,120));
    Blinker.dataStorage("data2", random(0,120)/2.0);
}
```
注册回调函数：
```
Blinker.attachDataStorage(dataStorage);
```
> Blinker.attachDataStorage(func, time, times);  
> func, 对应的回调函数  
> time, 对应数据采集时间-默认60 s, 最少60 s  
> times, 对应采集次数后上传到云端-默认2次, 最多不超过4次  

#### Blinker.dataStorage()
储存信息到缓存
```
Blinker.dataStorage("key","value");
```
> 缓存数据最大为 256 字节  
> 最多可以同时缓存 6 个不同的key  

~~#### Blinker.dataUpdate()~~
~~将缓存数据推送到云端~~
<!-- ``` -->
~~Blinker.dataUpdate();~~
<!-- ``` -->
~~将缓存数据推送到云端~~    
~~*限制 1次/小时~~  

#### Blinker.dataGet()
##### Blinker.attachDataGet()
注册回调函数，当设备查询到云端信息时会调用对应的回调函数  

回调函数：
```c++
void getData(const String & data)
{
    BLINKER_LOG("getData: ", data);
}
```
注册回调函数：
```
Blinker.attachDataGet(getData);
```

拉取云端储存的数据信息
```
Blinker.dataGet();
```
> *限制 1次/分钟  

#### Blinker.dataDelete()
删除云端储存的数据信息
```
bool delete = Blinker.dataDelete();
```
> Blinker.dataDelete(); // 删除云端数据所有key及数据  
> Blinker.dataDelete("key"); // 删除云端数据对应的key及数据  
> *限制 1次/分钟  

### SMS短信
设备通过 **WiFi** 接入时可以使用 **Blinker.sms()** 默认向该设备所属用户注册对应的手机发送一条短信.
```
Blinker.sms("Hello blinker! Button pressed!");
```
>注: 每个用户短信使用限制为 10条/天/人, 20字/条  
>目前diy用户只能向设备所属用户注册对应的手机发送短信  
> *限制 1次/分钟  
  
后期将增加功能，付费用户可以在app端设置10个短信接收手机号, 对其中一个手机号发送一条信息
```
char phone[] = "18712345678";
Blinker.sms("Hello blinker! Button pressed!", phone);
```  

### 通知推送
设备通过 **WiFi** 接入时可以使用 **Blinker.push()** 默认向该设备所属用户登陆App的手机发送一条通知.
```
Blinker.push("Hello blinker! Button pressed!");
```
>注: 每个用户通知推送使用限制为 5条/天/人  
> *限制 1次/分钟  

### 微信推送
设备通过 **WiFi** 接入时可以使用 **Blinker.wechat()** 默认向该设备所属用户绑定的微信发送一条消息.   

**绑定流程:**  
- 1.关注 Arduino中文社区 微信公众号
- 2.打开 Arduino中文社区 微信公众号, 点击主页右下角 Blinker  
- 3.输入账号密码完成绑定  

==建议用户使用微信模板消息==  
发送微信模板消息:
```
Blinker.wechat("Title: button", "State: pressed", "Message: hello blinker");
```
> 模板消息中依次为标题, 状态, 消息内容  

> 注: 每个用户微信推送使用限制为 10条/天/人  
> *限制 1次/分钟    

发送微信普通消息:
```
Blinker.wechat("hello blinker");
```
> 注: 微信要求微信公众号24小时内与用户有消息通信(用户发送消息给微信公众号)才能发送微信普通消息给用户。 
> 微信模板消息无此限制, 故建议用户使用微信模板消息    


**注意**  
>- 禁止发送互联网金融相关的所有内容，包括验证码、系统通知和营销推广短信  
>- 系统通知类短信不支持营销内容  
>- 禁止发送涉及：色情、赌博、毒品、党政、维权、众筹、慈善募捐、宗教、迷信、股票、移民、面试招聘、博彩、贷款、催款、信用卡提额、投资理财、中奖、抽奖、一元夺宝、一元秒杀、A货、整形、烟酒、交友、暴力、恐吓、皮草、返利、代开发票、代理注册、代办证件、加群、加QQ或者加微信、贩卖个人信息、运营商策反、流量营销等信息的短信  
>- 营销推广短信除上述禁止内容外，另不支持：保险、房地产、教育、培训、游戏、美容、医疗、会所、酒吧、足浴、助考、商标注册、装修、建材、家私、会展、车展、房展等信息的短信  
>- 如出现违法违规或者损害到相关他人权益的,平台将保留最终追究的权利！请各会员严格遵守规范要求，加强自身业务安全，健康发送短信  

### 天气查询
#### Blinker.attachWeather()
注册回调函数，当设备查询到天气数据时会调用对应的回调函数  

回调函数：
```c++
void weatherData(const String & data)
{
    BLINKER_LOG("weather: ", data);
}
```
注册回调函数：
```
Blinker.attachWeather(weatherData);
```

设备通过 **WiFi** 接入时可以使用 **Blinker.weather()** 查询天气情况.
```
Blinker.weather();//默认查询设备ip所属地区的当前时刻的天气情况

Blinker.weather("chengdu");//查询成都市当前时刻的天气情况

Blinker.weather("beijing");//查询北京市当前时刻的天气情况
```
> *限制 1次/分钟  

```
String location = "chengdu";//传入参数为对应城市拼音/英文
String weather = Blinker.weather(location);
```
**返回信息中字段及信息说明**  

| 参数 | 描述 | 示例 
| - | - | - 
| fl | 体感温度，默认单位：摄氏度 | 23 
| tmp | 温度，默认单位：摄氏度 | 21 
| cond_code | 实况天气状况代码 | 100 
| cond_txt | 实况天气状况描述 | 晴 
| wind_deg | 风向360角度 | 305 
| wind_dir | 风向 | 西北 
| wind_sc | 风力 | 3 
| wind_spd | 风速，公里/小时 | 15 
| hum | 相对湿度 | 40 
| pcpn | 降水量 | 0 
| vis | 实况天气状况代码 | 100 
| cloud | 云量 | 23 

**天气代码对照表**  

| 代码 | 中文 | 英文 | 
| - | - | - | 
| 100 | 晴 | Sunny/Clear | 
| 101 | 多云 | Cloudy | 
| 102 | 少云 | Few Clouds |
| 103 | 晴间多云 | Partly Cloudy |
| 104 | 阴 | Overcast |
| 200 | 有风 | Windy |
| 201 | 平静 | Calm |
| 202 | 微风 | Light Breeze 
| 203 | 和风 | Moderate/Gentle Breeze |
| 204 | 清风 | Fresh Breeze |
| 205 | 强风/劲风 | Strong Breeze |
| 206 | 疾风 | High Wind, Near Gale |
| 207 | 大风 | Gale |
| 208 | 烈风 | Strong Gale |
| 209 | 风暴 | Storm |
| 210 | 狂爆风 | Violent Storm |
| 211 | 飓风 | Hurricane |
| 212 | 龙卷风 | Tornado |
| 213 | 热带风暴 | Tropical Storm |
| 300 | 阵雨 | Shower Rain |
| 301 | 强阵雨 | Heavy Shower Rain |
| 302 | 雷阵雨 | Thundershower |
| 303 | 强雷阵雨 | Heavy Thunderstorm |
| 304 | 雷阵雨伴有冰雹 | Thundershower with hail |
| 305 | 小雨 | Light Rain |
| 306 | 中雨 | Moderate Rain |
| 307 | 大雨 | Heavy Rain |
| 308 | 极端降雨 | Extreme Rain |
| 309 | 毛毛雨/细雨 | Drizzle Rain |
| 310 | 暴雨 | Storm |
| 311 | 大暴雨 | Heavy Storm |
| 312 | 特大暴雨 | Severe Storm |
| 313 | 冻雨 | Freezing Rain |
| 314 | 小到中雨 | Light to moderate rain |
| 315 | 中到大雨 | Moderate to heavy rain |
| 316 | 大到暴雨 | Heavy rain to storm |
| 317 | 暴雨到大暴雨 | Storm to heavy storm |
| 318 | 大暴雨到特大暴雨 | Heavy to severe storm |
| 399 | 雨 | Rain |
| 400 | 小雪 | Light Snow |
| 401 | 中雪 | Moderate Snow |
| 402 | 大雪 | Heavy Snow |
| 403 | 暴雪 | Snowstorm |
| 404 | 雨夹雪 | Sleet |
| 405 | 雨雪天气 | Rain And Snow |
| 406 | 阵雨夹雪 | Shower Snow |
| 407 | 阵雪 | Snow Flurry |
| 408 | 小到中雪 | Light to moderate snow |
| 409 | 中到大雪 | Moderate to heavy snow |
| 410 | 大到暴雪 | Heavy snow to snowstorm |
| 499 | 雪 | Snow |
| 500 | 薄雾 | Mist |
| 501 | 雾 | Foggy |
| 502 | 霾 | Haze |
| 503 | 扬沙 | Sand |
| 504 | 浮尘 | Dust |
| 507 | 沙尘暴 | Duststorm |
| 508 | 强沙尘暴 | Sandstorm |
| 509 | 浓雾 | Dense fog |
| 510 | 强浓雾 | Strong fog |
| 511 | 中度霾 | Moderate haze |
| 512 | 重度霾 | Heavy haze |
| 513 | 严重霾 | Severe haze |
| 514 | 大雾 | Heavy fog |
| 515 | 特强浓雾 | Extra heavy fog |
| 900 | 热 | Hot |
| 901 | 冷 | Cold |
| 999 | 未知 | Unknown |

### AQI查询
#### Blinker.attachAQI()
注册回调函数，当设备查询到AQI数据时会调用对应的回调函数  

回调函数：
```c++
void aqiData(const String & data)
{
    BLINKER_LOG("AQI: ", data);
}
```
注册回调函数：
```
Blinker.attachAQI(aqiData);
```

设备通过 **WiFi** 接入时可以使用 **Blinker.aqi()** 查询空气质量情况.
```
Blinker.aqi();//默认查询设备ip所属地区的当前时刻的空气质量情况

Blinker.aqi("chengdu");//查询成都市当前时刻的空气质量情况

Blinker.aqi("beijing");//查询北京市当前时刻的空气质量情况
```
> *限制 1次/分钟  

```
String location = "chengdu";//传入参数为对应城市拼音/英文
aqi = Blinker.aqi(location);
```
**返回信息中字段及信息说明**  

| 参数 | 描述 | 示例 | 
| - | - | - | 
|pub_time | 数据发布时间,格式yyyy-MM-dd HH:mm | 2017-03-20 12:30 |
| aqi | 空气质量指数，[AQI和PM25的关系](https://zh.wikipedia.org/wiki/%E7%A9%BA%E6%B0%94%E8%B4%A8%E9%87%8F%E6%8C%87%E6%95%B0) | 74 | 
| main | 主要污染物 | pm25 | 
| qlty | 空气质量，取值范围:优，良，轻度污染，中度污染，重度污染，严重污染，[查看计算方式](https://zh.wikipedia.org/wiki/%E7%A9%BA%E6%B0%94%E8%B4%A8%E9%87%8F%E6%8C%87%E6%95%B0) | 良 |
| pm10 | pm10 | 78 |
| pm25 | pm25 | 66 |
| no2 | 二氧化氮 | 40 |
| so2 | 二氧化硫 | 30 |
| co | 一氧化碳 | 15 |
| o3 | 臭氧 | 20 |  


<!-- | Name | Academy | score | 
| - | :-: | -: | 
| Harry Potter | Gryffindor| 90 | 
| Hermione Granger | Gryffindor | 100 | 
| Draco Malfoy | Slytherin | 90 | -->

### Debug
将这行代码添加到你的工程文件第一行, 以启用串口调试输出功能:
```
#define BLINKER_PRINT Serial
```
在 `void setup()` 中初始化串口Serial :
```
Serial.begin(115200);

BLINKER_DEBUG.stream(BLINKER_PRINT);
```
你可以用额外的硬件串口 (HardWareSerial) 或者软串口 (SoftWareSerial) 来调试输出 (你需要额外的适配器将该串口连接到你的电脑上).  
  
如果你想调试输出更多细节信息 :
```
void setup()
{
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);
    BLINKER_DEBUG.debugAll();
}
```

### LOG
开启调试输出 (Debug) 后可以使用 **BLINKER_LOG()** 打印输出调试信息:
```
BLINKER_LOG("detail message 1");  
BLINKER_LOG("detail message 1", " 2");  
BLINKER_LOG("detail message 1", " 2", " 3");  
BLINKER_LOG("detail message 1", " 2", " 3", " 4");  
BLINKER_LOG("detail message 1", " 2", " 3", " 4", " 5");  
BLINKER_LOG("detail message 1", " 2", " 3", " 4", " 5", " 6");  
```

## 感谢
[WebSockets](https://github.com/Links2004/arduinoWebSockets) - Blinker 用这个库建立了一个 websocket 服务器   
[Adafruit_MQTT_Library](https://github.com/adafruit/Adafruit_MQTT_Library) - Blinker 用这个库建立了一个 MQTT 客户端   
[ArduinoJson](https://github.com/bblanchon/ArduinoJson) - Blinker 用这个库解析Json数据   
