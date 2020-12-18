# blinker Arduino支持库  

针对嵌入式设备的blinker库，需配合arduino sdk使用。  
Github：https://github.com/blinker-iot/blinker-library  

[开发注意事项](?file=020-Q%26A及开发常见问题/02-开发注意事项 "Arduino支持")  

## 硬件支持&依赖  

Arduino boards(Uno, Leonardo, Nano, Mini, Pro Mini, Pro Micro, zero, Due, Mega...) 

* 1.8.x及以上版本 Arduino IDE  

ESP8266

* 需配合使用 **2.7.4** 或以上release版本的 ESP8266 package

ESP32

* 需配合使用 **1.0.5-rc4** 及以上版本的 ESP32 package  

  

## 支持的接入方式

* 蓝牙(BLE)  
* WiFi  

  

## Blinker Arduino支持函数参考    

### 设备配置  

#### Blinker.begin()  

使用 **Blinker.begin()** 来配置 Blinker:  

``` cpp
Blinker.begin(...);
```

根据您使用的连接方式选择不同的参数用于配置Blinker  
  
BLE:

``` cpp
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
```cpp
#define BLINKER_WIFI  
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth, ssid, pswd);  
}
```  

> WiFi 支持的硬件: WiFiduino, WiFiduino32, ESP8266, ESP32  

WiFi without ssl:
```cpp
#define BLINKER_WIFI  
#define BLINKER_WITHOUT_SSL
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth, ssid, pswd);  
}
```  

> WiFi without ssl 主要用于堆栈不足的设备使用非加密方式接入，目前支持的硬件: WiFiduino, ESP8266  

GPRS:
```cpp
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
```cpp
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
```cpp
bool result = Blinker.connect();  
  

uint32_t timeout = 30000;//ms  
bool result = Blinker.connect(timeout);
```

#### Blinker.disconnect()

断开 **Blinker** 设备间连接

``` cpp
Blinker.disconnect();
```

#### Blinker.connected()

返回 **Blinker** 设备间连接状态

``` cpp
bool result = Blinker.connected();
```

#### Blinker.init()

返回设备初始化状态(仅限 BLINK_WIFI/BLINKER_PRO 设备)  
初始化指设备连上WiFi并能访问外网，设备开始连接MQTT broker  

``` cpp
bool state = Blinker.init();
```

#### Blinker.run()

此函数需要频繁调用以保持设备间连接及处理收到的数据, 建议放在 **loop()** 函数中

``` cpp
void loop() {
    Blinker.run();
}
```

### 数据管理

#### Blinker.attachData()

注册回调函数，当有设备收到APP发来的数据时会调用对应的回调函数  

回调函数:

``` cpp
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

``` cpp
Blinker.print(data);
```

发送一个Json数据, 如 {text1:data}

``` cpp
Blinker.print(text1, data);
```  
发送一个带单位的Json数据, eg: {"temp":"30.2 °C"}
```cpp
Blinker.print("temp", 30.2, "°C");
```

**连续发送时, 间隔100ms内发送的数据都会自动格式化后发送(同beginFormat), 若100ms后没有数据发送将把该数据发送出去。**

``` cpp
Blinker.print("halo","blinker");  
Blinker.print("hello","world");  
Blinker.delay(1000);  
Blinker.print("hello","print"); 
```

> 发送的 Json 数据: {"halo":"blinker", "hello":"world"} 与 {"hello":"print"}  
> WiFi 需间隔1s才能继续下一次发送  

### ESP多任务

**ESP8266/ESP32** 中启用多任务, 将 **blinker** 相关的设备连接、数据处理等放入单独任务中, 用户代码在 **loop()** 任务中进行, 互不干涉  

**目前ESP8266多任务支持还有点问题, 暂不支持使用**  

#### 设备配置  

BLE:

``` cpp
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

``` cpp
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

#### BlinkerButton  

按键组件在App中可以设置 按键/开关/自定义 三种模式:  

* **按键** 模式下支持 点按/长按/释放(tap/press/pressup) 三个动作  
* **开关** 模式下支持 打开/关闭(on/off) 两个动作  
* **自定义** 模式下支持 自定义指令 发送  

**函数** :

* attach()  

    *BlinkerButton.attach()*  
    注册按键的回调函数, 当收到指令时会调用该回调函数

* icon()  

    *BlinkerButton.icon()*  
    设置按键中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/)

* color()  

    *BlinkerButton.color()*  
    设置按键中显示图标的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)  

* text()  

    *BlinkerButton.text()*  
    设置按键中显示的名字或者描述  
    *BlinkerButton.text(text1)*  
    一段描述文字  
    *BlinkerButton.text(text1, text2)*  
    两段描述文字  

* print()  

    *BlinkerButton.print()*  
    发送按键当前的状态(多用于开关模式下反馈开关状态), 并将以上设置一并发送到APP
  
初始化, 创建对象
```cpp
#define BUTTON_1 "ButtonKey"

BlinkerButton Button1(BUTTON_1);
```

用于处理 **button** 收到数据的回调函数

``` cpp
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

``` cpp
Button1.attach(button1_callback);
```

> 在回调函数中, **state** 的值为:  
> - **按键** : "tap"(点按); "press"(长按); "pressup"(释放)  
> - **开关** : "on"(打开); "off"(关闭)  
> - **自定义** : 用户设置的值  
>  
> *也可以在创建对象时注册回调函数:
>> BlinkerButton Button1(BUTTON_1, button1_callback); 

#### BlinkerRGB  

颜色组件, 用于读取/设置RGB及亮度值  

**函数** :

* attach()  

    *BlinkerRGB.attach()*  
    设置颜色组件的回调函数, 当收到指令时会调用该回调函数

* brightness()  

    *BlinkerRGB.brightness()*  
    设置颜色组件的亮度值

* print()  

    *BlinkerRGB.print()*  
    发送用户需要的RGB数值及亮度值到APP  
    *BlinkerRGB.print(R, G, B)*  
    发送RGB及前一次设置的亮度值  
    *BlinkerRGB.print(R, G, B, Brightness)*  
    发送RGB及亮度值

初始化, 创建对象

``` cpp
#define RGB_1 "RGBKey"

BlinkerRGB RGB1(RGB_1);
```

用于处理 **RGB** 收到数据的回调函数

``` cpp
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

``` cpp
RGB1.attach(rgb1_callback);
```

> *也可以在创建对象时注册回调函数:
>> BlinkerRGB RGB1(RGB_1, rgb1_callback); 

#### BlinkerSlider

滑动条组件, 用于读取/设置滑动条  

**函数** :  

* attach()  

    *BlinkerSlider.attach()*  
    设置滑动条组件的回调函数, 当收到指令时会调用该回调函数  

* color()  

    *BlinkerSlider.color()*  
    设置滑动条组件的颜色 

* print()  

    *BlinkerSlider.print()*  
    发送用户需要的滑动条数值及设置的颜色到APP

初始化, 创建对象

``` cpp
#define Slider_1 "SliderKey"

BlinkerSlider Slider1(Slider_1);
```

用于处理 **Slider** 收到数据的回调函数

``` cpp
void slider1_callback(int32_t value)
{
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    BLINKER_LOG("get slider value: ", value);
}
```

在 **setup()** 中注册回调函数

``` cpp
Slider1.attach(slider1_callback);
```

> *也可以在创建对象时注册回调函数:
>> Slider1(Slider_1, slider1_callback); 

#### BlinkerNumber

数字组件, 用于发送数据到APP, 显示数字数据  

**函数** :

* icon()  

    *BlinkerNumber.icon()*  
    设置数字组件中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/)

* color()  

    *BlinkerNumber.color()*  
    设置数字组件的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)

* unit()  

    *BlinkerNumber.unit()*  
    设置数字组件中显示的数值的单位  

* print()  

    *BlinkerNumber.print()*  
    发送数字组件当前的数值, 并将以上设置一并发送到APP  

初始化, 创建对象

``` cpp
#define NUM_1 "NUMKey"

BlinkerNumber NUM1(NUM_1);
```

#### BlinkerText

文字组件, 用于发送数据到APP, 显示文字数据  

**函数** :

* print()  
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

``` cpp
#define TEXTE_1 "TextKey"

BlinkerText Text1(TEXTE_1);
```

#### BlinkerJoystick

摇杆组件, 读取摇杆X Y 轴的数据  

**函数** :

* attach()  

    *BlinkerJoystick.attach()*  
    设置摇杆组件的回调函数, 当收到指令时会调用该回调函数  

初始化, 创建对象

``` cpp
#define JOY_1 "JOYKey"

BlinkerJoystick JOY1(JOY_1);
```  

用于处理 **BlinkerJoystick** 收到数据的回调函数
```cpp
void joystick1_callback(uint8_t xAxis, uint8_t yAxis)
{
    BLINKER_LOG("Joystick1 X axis: ", xAxis);
    BLINKER_LOG("Joystick1 Y axis: ", yAxis);
}
```

在 **setup()** 中注册回调函数

``` cpp
JOY1.attach(joystick1_callback);
```

> *也可以在创建对象时注册回调函数:
>> BlinkerJoystick JOY1(JOY_1, joystick1_callback); 

#### BUILTIN_SWITCH

开关组件, 读取/设置默认开关的状态

**函数** :

* attach()  

    *BUILTIN_SWITCH.attach()*  
    设置开关的回调函数, 当收到指令时会调用该回调函数  

* print()  

    *BUILTIN_SWITCH.print()*
    发送开关当前的状态(多用于反馈开关状态)到APP  

用于处理 **BUILTIN_SWITCH** 收到数据的回调函数

``` cpp
void switch_callback(const String & state)
{
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    BLINKER_LOG("get switch state: ", state);

    BUILTIN_SWITCH.print("on");
}
```

在 **setup()** 中注册回调函数

``` cpp
BUILTIN_SWITCH.attach(switch_callback);
```

#### Blinker.ahrs() 即将废弃  

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

#### Blinker.gps() 即将废弃

读取 **GPS** 数据

``` 

String result_LONG = Blinker.gps(LONG);  
String result_LAT = Blinker.gps(LAT);
```

> LONG 经度  
> LAT 维度  

#### Blinker.vibrate()

发送手机振动指令, 震动时间, 单位ms 毫秒, 数值范围0-1000, 默认为500

``` 

Blinker.vibrate();
Blinker.vibrate(255);  
```

#### BlinkerTimer

定时器组件:

* 定时
* 循环
* 倒计时

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

#### BlinkerTab

选项卡组件, 读取/设置选项卡的状态  

**函数** :

* attach()  

    *BlinkerTab.attach()*  
    设置选项卡的回调函数, 当收到指令时会调用该回调函数  

* tab()  

    *BlinkerTab.tab(num)*  
    设置选项卡的某一栏为触发状态, 未设置的则为未触发状态    

* print()  

    *BlinkerTab.print()*
    发送选项卡当前的状态到APP  

初始化, 创建对象

``` cpp
#define Tab_1 "TabKey"

BlinkerTab Tab1(Tab_1);
```

用于处理 **tab** 收到数据的回调函数

``` cpp
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

``` cpp
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

``` cpp
Tab1.attach(tab1_callback, tab1_feedback);
```

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

#### Blinker.startTime()

获取设备开机NTP时间, 单位为秒(s), 获取失败时值: 0  

``` 

time_t start_time = Blinker.startTime();
```

#### Blinker.runTime()

获取设备运行时间, 单位为秒(s)  

``` 

time_t run_time = Blinker.runTime();
```

### 设备延时

#### Blinker.delay()

延时函数, 在延时过程中仍保持设备间连接及数据接收处理

``` 

Blinker.delay(500);
```

> *为了连接设备成功, 需要延时时务必使用该函数; 
> 使用此函数可以在延时期间连接设备及接收数据并处理数据, 延时完成后才能执行后面的程序; 

### BlinkerBridge

**BlinkerBridge** 功能用于 **WiFi** 设备与设备间的通信(无需使用app进行控制).  

**函数** :

* attach()  

    *BlinkerBridge.attach()*  
    注册bridge的回调函数, 当收到指令时会调用该回调函数  

* print()  

    *BlinkerBridge.print()*    
    发送消息到对应的bridge设备  

初始化, 创建对象

``` cpp
#define BRIDGE_1 "Your Device Secret Key of bridge to device"

BlinkerBridge BridgeDevice1(BRIDGE_1);
```

用于处理 **BlinkerBridge** 收到数据的回调函数

``` cpp
void bridge1Read(const String & data)
{
    BLINKER_LOG("BridgeDevice1 readString: ", data);

    // must print Json data
    BridgeDevice1.print("{\"hello\":\"bridge\"}");
}
```

在 **setup()** 中注册回调函数

``` cpp
BridgeDevice1.attach(bridge1Read);
```

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

``` cpp
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

``` cpp
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

#### Blinker.dataGet()

##### Blinker.attachDataGet()

注册回调函数，当设备查询到云端信息时会调用对应的回调函数  

回调函数：

``` cpp
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

### 通知消息

#### 短信通知 Blinker.sms

设备通过 **WiFi** 接入时可以使用 **Blinker.sms()** 默认向该设备所属用户注册对应的手机发送一条短信.

```c++
Blinker.sms("Hello blinker! Button pressed!"); 

``` 

> 注: 每个用户短信使用限制为 10条/天/人, 20字/条  
> 免费用户只能向注册手机号发送短信通知  
> *限制 1次/分钟  

  
后期将增加功能，专业版用户可以在app端设置10个短信接收手机号, 对其中一个手机号发送一条信息

```c++ 
char phone[] = "18712345678";
Blinker.sms("Hello blinker! Button pressed!", phone);
```  

#### 消息推送Blinker.push

设备通过 **WiFi** 接入时可以使用 **Blinker.push()** 默认向该设备所属用户登陆App的手机发送一条通知.
```c++ 
Blinker.push("Hello blinker! Button pressed!"); 
```

> 注: 每个用户通知推送使用限制为 5条/天/人  
> *限制 1次/分钟  

#### 本地通知Blinker.notify

使用 **notify** 时, 发送数据以感叹号开始, 将会发送消息通知到app, 否则将会发送正常Json数据到app  

发送通知

``` cpp
Blinker.notify("!notify");
```

发送Json数据, 如 {"notice":"notify"}

``` cpp
Blinker.notify("notify");
```

#### 微信推送Blinker.wechat

设备通过 **WiFi** 接入时可以使用 **Blinker.wechat()** 默认向该设备所属用户绑定的微信发送一条消息.   

**绑定流程:**  

* 1. 关注 点灯物联 微信公众号  
* 2. 打开 点灯物联 微信公众号, 点击主页右下角 Blinker  
* 3. 输入账号密码完成绑定  

**建议用户使用微信模板消息**  
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

> - 禁止发送互联网金融相关的所有内容，包括验证码、系统通知和营销推广短信  
> - 系统通知类短信不支持营销内容  
> - 禁止发送涉及：色情、赌博、毒品、党政、维权、众筹、慈善募捐、宗教、迷信、股票、移民、面试招聘、博彩、贷款、催款、信用卡提额、投资理财、中奖、抽奖、一元夺宝、一元秒杀、A货、整形、烟酒、交友、暴力、恐吓、皮草、返利、代开发票、代理注册、代办证件、加群、加QQ或者加微信、贩卖个人信息、运营商策反、流量营销等信息的短信  
> - 营销推广短信除上述禁止内容外，另不支持：保险、房地产、教育、培训、游戏、美容、医疗、会所、酒吧、足浴、助考、商标注册、装修、建材、家私、会展、车展、房展等信息的短信  
> - 如出现违法违规或者损害到相关他人权益的, 平台将保留最终追究的权利！请各会员严格遵守规范要求，加强自身业务安全，健康发送短信  

### 天气空气

#### 当日天气

注册回调函数，当设备查询到天气数据时会调用对应的回调函数  

回调函数：

```c++ 
void weatherData(const String & data) {

    BLINKER_LOG("weather: ", data);

}

``` 

注册回调函数：

```c++ 
Blinker.attachWeather(weatherData);
```

设备通过 **WiFi** 接入时可以使用 **Blinker.weather()** 查询天气情况.

```c++ 
Blinker.weather(); //默认查询设备ip所属地区的当前时刻的天气情况
Blinker.weather("chengdu"); //查询成都市当前时刻的天气情况
Blinker.weather("beijing"); //查询北京市当前时刻的天气情况

``` 

> *限制 1次/分钟  

```c++ 
String location = "chengdu";//传入参数为对应城市拼音/英文
Blinker.weather(location);
```
#### 天气预报
注册回调函数，当设备查询到天气预报数据时会调用对应的回调函数  


#### 当日空气

注册回调函数，当设备查询到AQI数据时会调用对应的回调函数  

回调函数：

``` c++ 
void aqiData(const String & data) {

    BLINKER_LOG("AQI: ", data);

}

``` 

注册回调函数：

``` c++ 

Blinker.attachAQI(aqiData); 
```

设备通过 **WiFi** 接入时可以使用 **Blinker.aqi()** 查询空气质量情况.

``` c++ 

Blinker.aqi(); //默认查询设备ip所属地区的当前时刻的空气质量情况

Blinker.aqi("chengdu"); //查询成都市当前时刻的空气质量情况

Blinker.aqi("beijing"); //查询北京市当前时刻的空气质量情况

``` 

> *限制 1次/分钟  

``` c++ 

String location = "chengdu"; //传入参数为对应城市拼音/英文
Blinker.aqi(location); 
```

### 调试模式

#### 开启调试模式

将这行代码添加到您的工程文件第一行, 以启用串口调试输出功能:

```c++ 
#define BLINKER_PRINT Serial

``` 

在 `void setup()` 中初始化串口Serial :

``` c++ 
Serial.begin(115200); 
BLINKER_DEBUG.stream(BLINKER_PRINT); 
```

您可以用额外的硬件串口 (HardWareSerial) 或者软串口 (SoftWareSerial) 来调试输出 (您需要额外的适配器将该串口连接到您的电脑上).  
  
如果您想调试输出更多细节信息 :

``` c++  
void setup() {

    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);
    BLINKER_DEBUG.debugAll();

}

``` 

#### 输出调试信息

开启调试输出 (Debug) 后可以使用 **BLINKER_LOG()** 打印输出调试信息:

```c++
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
