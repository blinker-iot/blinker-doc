# blinker PRO Arduino支持库  
**本功能自2024年1月1日起下线** 
**专业版功能**  
针对嵌入式设备的blinker库，需配合arduino sdk使用。 
  
## 支持的硬件
* 使用 [esp8266/arduino](https://github.com/esp8266/arduino) 的ESP8266  
* 使用 [espressif/arduino-esp32](https://github.com/espressif/arduino-esp32) 的ESP32  
  
## 支持的接入方式
* WiFi  
  
## 准备工作
使用前您需要做好如下准备:
* [Arduino IDE](https://arduino.me/download) 1.6.12或更新版本  
* 使用 Arduino IDE 的开发板管理器安装 [esp8266/arduino](https://github.com/esp8266/arduino)  
* 按照 [安装说明](https://github.com/espressif/arduino-esp32#installation-instructions) 安装 [espressif/arduino-esp32](https://github.com/espressif/arduino-esp32)  
  
## Blinker PRO 接口函数  
[Blinker PRO 专属设备常用接口函数](https://diandeng.tech/doc/arduino-support "Arduino支持")在此不做累述, 此文档针对 **Blinker PRO** 专属设备特有函数进行讲解。  
### 配置服务器信息  
当使用其他服务器部署时可使用如下代码切换服务器配置信息:  
```cpp
#define BLINKER_SERVER_HTTPS    "https://iot.diandeng.tech"

#define BLINKER_SERVER_HOST     "iot.diandeng.tech"

#include <Blinker.h>

void setup() {}

void loop() {}
```
### 设备配置  
#### Blinker.begin()  
使用 **Blinker.begin()** 来配置 Blinker:  
```cpp
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

### Blinker.smartconfigInit()
设置设备为 ESPTOUCH 配网模式  

### Blinker.apConfigInit()
设置设备为 APCONFIG 配网模式  

### Blinker.configType()
获取设备配网模式  
```
enum b_config_t {
    BLINKER_SMART_CONFIG,
    BLINKER_AP_CONFIG
};
```
```
b_config_t type = Blinker.configType();
```  

### Blinker.status()
获取设备当前状态, 可获取状态如下:
```
enum BlinkerStatus_t
{
    PRO_WLAN_CONNECTING,       // 设备网络连接中
    PRO_WLAN_CONNECTED,        // 设备已连接网络
    PRO_WLAN_SMARTCONFIG_BEGIN,// 设备开启ESPTOUCH配网模式，等待配网
    PRO_WLAN_SMARTCONFIG_DONE, // 设备ESPTOUCH配网完成
    PRO_WLAN_APCONFIG_BEGIN,   // 设备开启AP配网模式，等待配网
    PRO_WLAN_APCONFIG_DONE,    // 设备AP配网完成
    PRO_DEV_AUTHCHECK_FAIL,    // 设备注册用户校验失败
    PRO_DEV_AUTHCHECK_SUCCESS, // 设备注册用户校验成功
    PRO_DEV_REGISTER_FAIL,     // 设备注册上线失败
    PRO_DEV_REGISTER_SUCCESS,  // 设备注册上线成功
    PRO_DEV_INIT_SUCCESS,      // 设备初始化完成
    PRO_DEV_CONNECTING,        // 设备MQTT BROKER连接中
    PRO_DEV_CONNECTED,         // 设备MQTT BROKER连接成功
    PRO_DEV_DISCONNECTED       // 设备MQTT BROKER连接断开
};
```
```
BlinkerStatus_t status = Blinker.status();
``` 

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
```cpp
/* 
 * Add your code in this function
 * 
 * When button clicked, device will call this function
 */
void singleClick()
{
    BLINKER_LOG("Button clicked!");
}
```
注册按键单次按下时的回调函数, 当设备检测到按键单击时将调用该函数
```cpp
Blinker.attachClick(singleClick);
```  

#### Blinker.attachDoubleClick()
按键双击时的回调函数
```cpp
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
```cpp
Blinker.attachDoubleClick(singleClick);
```

#### Blinker.attachLongPressStart()
按键长按开始时的回调函数
```cpp
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
```cpp
Blinker.attachLongPressStart(longPressStart);
```

#### Blinker.attachDuringLongPress()
按键长按过程中的回调函数
```cpp
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
```cpp
Blinker.attachDuringLongPress(duringLongPress);
```

#### Blinker.attachLongPressStop()
按键长按释放时的回调函数
```cpp
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
```cpp
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
```cpp
#define BLINKER_BUTTON
#define BLINKER_BUTTON_PULLDOWN
#define BLINKER_BUTTON_LONGPRESS_POWERDOWN
#define BLINKER_BUTTON_PIN 7
```
> 注:此时可以不用注册 **Blinker.attachLongPressStop**  

**Blinker.attachLongPressPowerdown()**  
按键长按释放时关机的回调函数
```cpp
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
```cpp
Blinker.attachLongPressReset(longPressPowerdown);
```
**Blinker.attachLongPressReset()**  
按键长按释放时重置的回调函数
```cpp
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
```cpp
Blinker.attachLongPressReset(longPressReset);
```
**Blinker.pressedTime()**
在长按执行过程中可以返回长按已持续时间, 单位ms, 最大值为10000 ms
```cpp
uint16_t pressed_time = Blinker.pressedTime();
```

#### Blinker.tick()
检测按键状态, 用户一般情况下可以不调用。
如果用户对按键实时性要求较高, 可以使用外部中断:
```cpp
/* 
 * Blinker provide a button parse function for user if you defined BLINKER_BUTTON
 * 
 * Blinker button can detect single click/ double click/ long press
 * 
 * Blinker.tick() will run by default, use interrupt will be better
 */
void buttonTick()
{
    Blinker.tick();
}
```
使用跳变沿中断:
```cpp
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
```cpp
void noButtonReset()
{
    BLINKER_LOG("no button reset trigged!");
}
```
注册按键无按键回调函数, 当设备检测到无按键重置时将调用该函数
```cpp
Blinker.attachNoButtonReset(noButtonReset);
```

#### Blinker.reset()
设备重置API, 调用该接口后设备将立即重置。  

### 数据解析
设备在收到数据时将调用数据解析的回调函数。  
数据解析的回调函数:
```cpp
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
```cpp
Blinker.attachParse(dataParse);
```

## 感谢
[WebSockets](https://github.com/Links2004/arduinoWebSockets) - Blinker 用这个库建立了一个 websocket 服务器  
[Adafruit_MQTT_Library](https://github.com/adafruit/Adafruit_MQTT_Library) - Blinker 用这个库建立了一个 MQTT 客户端
[ArduinoJson](https://github.com/bblanchon/ArduinoJson) - Blinker 用这个库解析Json数据  