# blinker PRO Arduino支持库
针对嵌入式设备的blinker库，需配合arduino sdk使用。 

>1. [支持的硬件](#支持的硬件 "支持的硬件")
>1. [支持的接入方式](#支持的接入方式 "支持的接入方式")
>1. [准备工作](#准备工作 "准备工作")
>1. [Blinker PRO 接口函数](#Blinker PRO 接口函数 "Blinker PRO 接口函数")  
>    1. [设备配置](#设备配置 "设备配置")
>    1. [BLINKER_BUTTON](#BLINKER_BUTTON "BLINKER_BUTTON")
>    1. [BLINKER_NO_BUTTON](#BLINKER_NO_BUTTON "BLINKER_NO_BUTTON")
>    1. [数据解析](#数据管理 "数据解析")
>1. [感谢](#感谢 "感谢")  
  
## 支持的硬件
* 使用 [esp8266/arduino](https://github.com/esp8266/arduino) 的ESP8266  
* 使用 [espressif/arduino-esp32](https://github.com/espressif/arduino-esp32) 的ESP32  
  
## 支持的接入方式
<!-- * Bluetooth4.x (BLE)  
* WiFi   -->
* WiFi  
  
## 准备工作
使用前你需要做好如下准备:
* [Arduino IDE](https://www.arduino.cc/en/Main/Software) 1.6.12或更新版本  
* 使用 Arduino IDE 的开发板管理器安装 [esp8266/arduino](https://github.com/esp8266/arduino)  
* 按照 [安装说明](https://github.com/espressif/arduino-esp32#installation-instructions) 安装 [espressif/arduino-esp32](https://github.com/espressif/arduino-esp32)  
  
## Blinker PRO 接口函数  
[Blinker PRO 专属设备常用接口函数](?file=003-硬件开发/02-Arduino支持 "Arduino支持")在此不做累述, 此文档针对 **Blinker PRO** 专属设备特有函数进行讲解。  
### 设备配置  
#### Blinker.begin()  
使用 **Blinker.begin()** 来配置 Blinker:  
```arduino
#define BLINKER_PRO
#define BLINKER_BUTTON
#define BLINKER_BUTTON_PIN 7

#include <Blinker.h>

char type[] = "Your Device Type";
char auth[] = "Your Device Secret Key";

void setup() {  
    Blinker.begin(auth, type);  
}
```
> 务必保证有一个实体按键, 下文将讲解其作用  
> 目前支持的硬件: WiFiduino, WiFiduino32, ESP8266, ESP32  

**begin()** 主要完成以下配置:  
1.初始化硬件设置;    
2.等待设备配网;  
3.获取设备登陆信息;  
4.设备配置成功后存储配置信息到EEPROM;

### BLINKER_BUTTON  
专属设备内置按键, 按键具有以下功能:
- 单击
- 双击
- 长按开始
- 长按中
- 长按结束
- 长按关机/重置(10s以上)  

> 设备配置成功后数据存入EEPROM中, 默认开启 **BLINKER_BUTTON** 后长按即可清除EEPROM中存储的配置信息。  

使能 **BLINKER_BUTTON** 并制定其端口(IO)
```
#define BLINKER_BUTTON
#define BLINKER_BUTTON_PIN 7
```
> *默认检测IO内部上拉, 低电平触发  
> 需检测IO外部下拉, 高电平触发时:
> ```
> #define BLINKER_BUTTON
> #define BLINKER_BUTTON_PULLDOWN
> #define BLINKER_BUTTON_PIN 7
> ```  

#### Blinker.attachClick()
按键单次点击时的回调函数
```arduino
/* 
 * Add your code in this function
 * 
 * When button clicked, device will call this function
 */
void singalClick()
{
    BLINKER_LOG("Button clicked!");
}
```
注册按键单次按下时的回调函数, 当设备检测到按键单击时将调用该函数
```arduino
Blinker.attachClick(singalClick);
```  

#### Blinker.attachDoubleClick()
按键双击时的回调函数
```arduino
/* 
 * Add your code in this function
 * 
 * When button double clicked, device will call this function
 */
void doubleClick()
{
    BLINKER_LOG("Button double clicked!");
}
```
注册按键双击时的回调函数, 当设备检测到按键双击时将调用该函数
```arduino
Blinker.attachDoubleClick(singalClick);
```

#### Blinker.attachLongPressStart()
按键长按开始时的回调函数
```arduino
/* 
 * Add your code in this function
 * 
 * When long press start, device will call this function
 */
void longPressStart()
{
    BLINKER_LOG("Button long press start!");
}
```
注册按键长按开始时的回调函数, 当设备检测到按键长按开始时将调用该函数
```arduino
Blinker.attachLongPressStart(longPressStart);
```

#### Blinker.attachDuringLongPress()
按键长按过程中的回调函数
```arduino
/* 
 * Add your code in this function
 * 
 * When during long press, device will call this function
 */
void duringLongPress()
{
    BLINKER_LOG("During button long press!");
}
```
注册按键长按过程中的回调函数, 当设备检测到按键长按执行中时将调用该函数
```arduino
Blinker.attachDuringLongPress(duringLongPress);
```

#### Blinker.attachLongPressStop()
按键长按释放时的回调函数
```arduino
/* 
 * Add your code in this function
 * 
 * When long press stop, device will call this function
 */
void longPressStop()
{
    BLINKER_LOG("Button long press stop!");
}
```
注册按键长按释放时的回调函数, 当设备检测到按键长按结束时将调用该函数
```arduino
Blinker.attachLongPressStop(longPressStop);
```
> 注: 默认长按释放后将清除设备配置信息, 重置设备  
> 设备端还提供:  
> - 设备长按2s后(10s内)释放, 执行关机不重置设备  
>   Blinker.attachLongPressPowerdown  
> - 长按10s后释放重置设备的功能  
>   Blinker.attachLongPressReset  

#### BLINKER_BUTTON_LONGPRESS_POWERDOWN
启用长按关机/重置功能
```arduino
#define BLINKER_BUTTON
#define BLINKER_BUTTON_PULLDOWN
#define BLINKER_BUTTON_LONGPRESS_POWERDOWN
#define BLINKER_BUTTON_PIN 7
```
> 注:此时可以不用注册 **Blinker.attachLongPressStop**  

***Blinker.attachLongPressPowerdown()***  
按键长按释放时关机的回调函数
```arduino
/* 
 * Add your code in this function
 * 
 * When long press stop and trigged POWERDOWN, device will call this function
 */
void longPressPowerdown()
{
    BLINKER_LOG("Button long press powerdown!");

    digitalWrite(BLINKER_POWER_3V3_PIN, LOW);
}
```
注册按键长按释放时关机的回调函数, 当设备检测到按键长按结束并触发关机动作时将调用该函数
```arduino
Blinker.attachLongPressReset(longPressPowerdown);
```
***Blinker.attachLongPressReset()***  
按键长按释放时重置的回调函数
```arduino
/* 
 * Add your code in this function
 * 
 * When long press stop and trigged RESET, device will call this function
 */
void longPressReset()
{
    BLINKER_LOG("Button long press reset!");
}
```
注册按键长按释放时重置的回调函数, 当设备检测到按键长按结束并触发重置动作时将调用该函数
```arduino
Blinker.attachLongPressReset(longPressReset);
```
***Blinker.pressedTime()***
在长按执行过程中可以返回长按已持续时间, 单位ms, 最大值为10000 ms
```arduino
uint16_t pressed_time = Blinker.pressedTime();
```

#### Blinker.tick()
检测按键状态, 用户一般情况下可以不调用。
如果用户对按键实时性要求较高, 可以使用外部中断:
```arduino
/* 
 * Blinker provide a button parse function for user if you defined BLINKER_BUTTON
 * 
 * Blinker button can detect singal click/ double click/ long press
 * 
 * Blinker.tick() will run by default, use interrupt will be better
 */
void buttonTick()
{
    Blinker.tick();
}
```
使用跳变沿中断:
```arduino
attachInterrupt(BLINKER_BUTTON_PIN, buttonTick, CHANGE);
```

### BLINKER_NO_BUTTON
专属设备无按键(通断电源计次)功能  
> 注: 启用该功能后上电5s内断电(连续三次以上)将调用对应的回调  
> ```
> #define BLINKER_NO_BUTTON
> ```  

#### Blinker.attachNoButtonReset()
无按键重置回调函数
```arduino
void noButtonReset()
{
    BLINKER_LOG("no button reset trigged!");
}
```
注册按键无按键回调函数, 当设备检测到无按键重置时将调用该函数
```arduino
Blinker.attachNoButtonReset(noButtonReset);
```

### 数据解析
设备在收到数据时将调用数据解析的回调函数。  
数据解析的回调函数:
```arduino
/* 
 * Add your command parse code in this function
 * 
 * When get a command and device not parsed this command, 
 * device will call this function with a JsonObject data.
 */
bool dataParse(const JsonObject & data)
{
    String getData;
    data.printTo(getData);
    BLINKER_LOG("Get user command: ", getData);

    bool isParsed = false;

    if (isParsed) {
        return true;
    }
    else {
        return false;
    }
}
```
注册数据解析的回调函数:
```arduino
Blinker.attachParse(dataParse);
```

## 感谢
[WebSockets](https://github.com/Links2004/arduinoWebSockets) - Blinker 用这个库建立了一个 websocket 服务器  
[Adafruit_MQTT_Library](https://github.com/adafruit/Adafruit_MQTT_Library) - Blinker 用这个库建立了一个 MQTT 客户端
[ArduinoJson](https://github.com/bblanchon/ArduinoJson) - Blinker 用这个库解析Json数据  

==文档待更新==  