# blinker Arduino支持库 - 教育版

针对嵌入式设备的blinker库，需配合arduino sdk使用。  
Github：https://github.com/blinker-iot/blinker-library/tree/dev_edu

**教育版特色**: 本版本专为教学设计，提供简洁直观的API，让学生和初学者能够快速上手物联网开发。

## 教育版本亮点

### 🎯 简化的Widget架构
- **统一父类**: 所有Widget组件都继承自BlinkerWidget基类
- **方法链模式**: 支持链式调用，一行代码设置多个属性
- **类型安全**: 消除复杂的模板参数，提高代码可读性

### 📚 教育友好的设计
- **清晰的继承关系**: 便于理解面向对象编程概念
- **统一的API**: 所有组件使用相同的方法名（icon, color, text等）
- **智能内存管理**: 自动处理内存分配和释放

### 🔗 方法链示例
```cpp
// 旧方式（仍然支持）
Number1.icon("fa-thermometer");
Number1.color("#00AA00");
Number1.unit("°C");
Number1.print(25.6);

// 新方式 - 方法链（推荐）
Number1.icon("fa-thermometer")
       .color("#00AA00")
       .unit("°C")
       .text("室温")
       .value(25.6)
       .print();
```

[开发注意事项](?file=020-Q%26A及开发常见问题/02-开发注意事项 "Arduino支持")

## 硬件支持&依赖  

**Arduino UNO R4 WiFi**

* 需配合使用 **2.0.0** 及以上版本的 Arduino UNO R4 package
* 1.8.x及以上版本 Arduino IDE  
* 使用 **0.5.2** 及以上版本的WiFi模块固件，[更新教程](https://support.arduino.cc/hc/en-us/articles/9670986058780-Update-the-connectivity-module-firmware-on-UNO-R4-WiFi)

**ESP32系列开发板**

* 需配合使用 **2.0.0** 及以上版本的 ESP32 package
* 支持ESP32、ESP32-S2、ESP32-S3、ESP32-C3等系列芯片

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
> 目前8266的设备都默认开启了非ssl接入  

WiFi with ssl:
```cpp
#define BLINKER_WIFI  
#define BLINKER_WITH_SSL
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth, ssid, pswd);  
}
```  
> 如上代码即可开启ssl接入  

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

``` cpp
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

### App组件

#### BlinkerButton  

按键组件在App中可以设置 按键/开关/自定义 三种模式:  

* **按键** 模式下支持 点按/长按/释放(tap/press/pressup) 三个动作  
* **开关** 模式下支持 打开/关闭(on/off) 两个动作  
* **自定义** 模式下支持 自定义指令 发送  

**初始化方式**:

```cpp
// 直接使用组件名称初始化
BlinkerButton Button1("btn-123");
```

**函数** :

* attach()  
    注册按键的回调函数, 当收到指令时会调用该回调函数

* icon()  
    设置按键中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/v5/search)

* color()  
    设置按键中显示图标的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)  

* text()  
    设置按键中显示的名字或者描述  
    *Button1.text(text1)*  一段描述文字  
    *Button1.text(text1, text2)*  两段描述文字  

* print()  
    发送按键当前的状态, 并将以上设置一并发送到APP

**教育版特色 - 方法链调用**:

```cpp
// 方法链模式 - 一行代码设置多个属性
Button1.icon("far fa-lightbulb")
       .color("#FFAA00")  
       .text("LED ON")
       .print();
```

**完整示例**:

```cpp
#define BLINKER_WIFI
#define BLINKER_WIDGET
#include <Blinker.h>

char auth[] = "Your Device Secret Key";
char ssid[] = "Your WiFi network SSID or name";
char pswd[] = "Your WiFi network WPA password or WEP key";

BlinkerButton Button1("btn-abc");
BlinkerNumber Number1("num-abc");

int counter = 0;

void button1_callback(const String & state)
{
    BLINKER_LOG("get button state: ", state);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    
    // 根据LED状态动态更新按钮样式
    if (digitalRead(LED_BUILTIN)) {
        Button1.icon("far fa-lightbulb")
               .color("#FFAA00")
               .text("LED ON")
               .print();
    }
    else {
        Button1.icon("far fa-lightbulb")
               .color("#000000")
               .text("LED OFF")
               .print();
    }
}

void dataRead(const String & data) {
    BLINKER_LOG("Blinker readString: ", data);
    counter++;
    
    // 使用方法链更新数字显示
    Number1.icon("far fa-swords")
           .color("#0066FF")
           .unit("次")
           .text("计数器")
           .value(counter)
           .print();
}

void setup() {
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);
    BLINKER_DEBUG.debugAll();
    
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

#### BlinkerNumber

数字显示组件，用于在App中显示数值数据，支持图标、颜色、单位等自定义属性。

**初始化方式**:

```cpp
// 直接使用组件名称初始化
BlinkerNumber Number1("num-123");
```

**函数** :

* icon()  
    设置数字组件显示的图标, [图标列表及对应图标名称见](https://fontawesome.com/v5/search)

* color()  
    设置数字显示的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)

* unit()  
    设置数值的单位, 如 "°C", "%" 等

* text()  
    设置数字组件的描述文字

* value()  
    设置要显示的数值

* print()  
    发送数字当前的状态和数值到APP

**教育版特色 - 方法链调用**:

```cpp
// 方法链模式 - 一行代码设置多个属性
Number1.icon("far fa-thermometer")
       .color("#00AA00")
       .unit("°C")
       .text("温度")
       .value(25.6)
       .print();
```

**完整示例**:

```cpp
#define BLINKER_WIFI
#define BLINKER_WIDGET
#include <Blinker.h>

char auth[] = "Your Device Secret Key";
char ssid[] = "Your WiFi network SSID or name";
char pswd[] = "Your WiFi network WPA password or WEP key";

#define Number_1 "NUMKey"

BlinkerNumber Number1(Number_1);

void dataRead(const String & data)
{
    BLINKER_LOG("Blinker readString: ", data);
    Blinker.vibrate();
    
    uint32_t BlinkerTime = millis();
    Blinker.print("millis", BlinkerTime);

    // 使用新的方法链API显示运行时间
    Number1.icon("far fa-clock")
           .color("#00AA00")
           .unit("ms")
           .text("运行时间")
           .value(BlinkerTime)
           .print();

    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}

void setup()
{
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);
    
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, LOW);
    
    Blinker.begin(auth, ssid, pswd);
    Blinker.attachData(dataRead);
}

void loop()
{
    Blinker.run();
}
```

## 心跳包功能

app定时向设备发送心跳包, 设备收到心跳包后会返回设备当前状态  
如果用户有自定义状态需要在收到心跳包时返回, 可调用以下函数:  

**Blinker.attachHeartbeat()**  
用户自定义状态返回的回调函数:
```cpp
void heartbeat()
{
    if (switch_state) BUILTIN_SWITCH.print("on");
    else BUILTIN_SWITCH.print("off");
}
``` 

注册回调函数:
```cpp
Blinker.attachHeartbeat(heartbeat); 
``` 

> 设备建立连接后app会立刻发送心跳包, 此后每30s-60会发送一次心跳包  

## 其他功能

### 设备延时

#### Blinker.delay()

延时函数, 在延时过程中仍保持设备间连接及数据接收处理

``` cpp
Blinker.delay(500);
```

> 为了连接设备成功, 需要延时时务必使用该函数; 
> 使用此函数可以在延时期间连接设备及接收数据并处理数据, 延时完成后才能执行后面的程序; 

### 手机交互

#### Blinker.vibrate()

发送手机振动指令, 震动时间, 单位ms 毫秒, 数值范围0-1000, 默认为500

``` cpp
Blinker.vibrate();
Blinker.vibrate(255);  
```

### 通知消息

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

#### 消息推送Blinker.push

设备通过 **WiFi** 接入时可以使用 **Blinker.push()** 默认向该设备所属用户登陆App的手机发送一条通知.
```cpp 
Blinker.push("Hello blinker! Button pressed!"); 
```

> 注: 每个用户通知推送使用限制为 5条/天/人  
> *限制 1次/分钟  

#### 微信推送Blinker.wechat

设备通过 **WiFi** 接入时可以使用 **Blinker.wechat()** 默认向该设备所属用户绑定的微信发送一条消息.  

**绑定流程:**  

* 1. 关注 点灯物联 微信公众号  
* 2. 打开 点灯物联 微信公众号, 点击主页右下角 Blinker  
* 3. 输入账号密码完成绑定  

**建议用户使用微信模板消息**  
发送微信模板消息:

``` cpp
Blinker.wechat("Title: button", "State: pressed", "Message: hello blinker"); 
```

> 模板消息中依次为标题, 状态, 消息内容  

> 注: 每个用户微信推送使用限制为 10条/天/人  
> *限制 1次/分钟    

发送微信普通消息:

``` cpp
Blinker.wechat("hello blinker"); 
```

> 注: 微信要求微信公众号24小时内与用户有消息通信(用户发送消息给微信公众号)才能发送微信普通消息给用户。 
> 微信模板消息无此限制, 故建议用户使用微信模板消息    

#### 短信通知 Blinker.sms
**该功能仅限专业版用户使用 10条/天/人, 20字/条，1次/分钟，只能向注册手机号发送短信通知**  

设备通过 **WiFi** 接入时可以使用 **Blinker.sms()** 默认向该设备所属用户注册对应的手机发送一条短信.

```cpp
Blinker.sms("Hello blinker! Button pressed!"); 
``` 

### 定时器功能

#### Blinker.timingState()

查询设备上是否有定时设置; 

``` cpp
bool state = Blinker.timingState();
```

#### Blinker.loopState()

查询设备上是否有循环设置; 

``` cpp
bool state = Blinker.loopState();
```

#### Blinker.countdownState()

查询设备上是否有倒计时设置; 

``` cpp
bool state = Blinker.countdownState();
```

#### Blinker.deleteTiming()  

删除设备上的定时设置; 

#### Blinker.deleteLoop()  

删除设备上的循坏设置; 

#### Blinker.deleteCountdown()  

删除设备上的倒计时设置; 

#### Blinker.deleteTimer()  

删除设备上所有的定时器组件设置; 

### NTP时间功能

> NTP 目前仅适用于WiFi接入  

#### Blinker.setTimezone()  

设置时区, 如: 北京时间为+8:00  

``` cpp
Blinker.setTimezone(8.0);
```

#### Blinker.time()

获取当前ntp时间, 单位为秒(s)

``` cpp
uint32 times = Blinker.time();
```

#### Blinker.second()

获取当前时间秒数, 单位为秒(s), 获取成功时值: 0-59, 获取失败时值: -1

``` cpp
int8_t sec = Blinker.second();
```

#### Blinker.minute()

获取当前时间分钟数, 单位为分(m), 获取成功时值: 0-59, 获取失败时值: -1

``` cpp
int8_t min = Blinker.minute();
```

#### Blinker.hour()

获取当前时间小时数, 单位为小时(h), 获取成功时值: 0-23, 获取失败时值: -1

``` cpp
int8_t hour = Blinker.hour();
```

#### Blinker.wday()

获取当前时间为当周的日期, 单位为天(d), 获取成功时值: 0-6(依次为周日/一/二/三/四/五/六), 获取失败时值: -1

``` cpp
int8_t wday = Blinker.wday();
```

#### Blinker.mday()

获取当前时间为当月第几天, 单位为天(d), 获取成功时值: 1-31, 获取失败时值: -1

``` cpp
int8_t mday = Blinker.mday();
```

#### Blinker.yday()

获取当前时间为当年第几天, 单位为天(d), 获取成功时值: 1-366, 获取失败时值: -1

``` cpp
int16_t yday = Blinker.yday();
```

#### Blinker.month()

获取当前时间为当年第几月, 单位为月(mon), 获取成功时值: 1-12, 获取失败时值: -1

``` cpp
int8_t month = Blinker.month();
```

#### Blinker.year()

获取当前时间对应年, 单位为年(y), 获取成功时值: 20xx, 获取失败时值: -1

``` cpp
int16_t year = Blinker.year();
```

### 历史数据功能

#### Blinker.configUpdate()

上传配置信息到云端

``` cpp
Blinker.configUpdate("Hello blinker!");
```

> 上传信息数据最大为 256 字节  
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

``` cpp
Blinker.attachDataStorage(dataStorage);
```

> Blinker.attachDataStorage(func, time, times); 
> func, 对应的回调函数  
> time, 对应数据采集时间-默认60 s, 最少60 s  
> times, 对应采集次数后上传到云端-默认2次, 最多不超过4次  

#### Blinker.dataStorage()

储存信息到缓存

``` cpp
Blinker.dataStorage("key","value");
```

> 缓存数据最大为 256 字节  
> 最多可以同时缓存 6 个不同的key  

#### Blinker.log()  

上传log信息到云端  

``` cpp
Blinker.log("string data");
```

### 气象数据

气象数据接口，默认使用IP定位返回当前位置的气象数据，也可以通过参数cityCode（[国家行政区编码](http://preview.www.mca.gov.cn/article/sj/xzqh/2020/2020/202101041104.html)）来获取指定位置的数据。  
更多说明可见[气象数据接口](https://diandeng.tech/doc/weather-and-air)  

#### 天气

注册回调函数，当设备查询到天气数据时会调用对应的回调函数  

回调函数：  

```cpp
void weatherData(const String & data) {
    BLINKER_LOG("weather: ", data);
}
```

注册回调函数：  

```cpp
Blinker.attachWeather(weatherData);
```

获取天气数据：  

```cpp  
Blinker.weather(citycode); //传入参数为对应城市编码
```

调用示例：

```cpp
Blinker.weather(); //默认查询设备ip所属地区的当前时刻的天气情况
Blinker.weather(510100); //查询成都市当前时刻的天气情况
```

#### 天气预报  

注册回调函数，当设备查询到天气预报数据时会调用对应的回调函数  

回调函数：  

```cpp
void weatherForecastData(const String & data) {
    BLINKER_LOG("weatherForecast: ", data);
}
```

注册回调函数：  

```cpp
Blinker.attachWeatherForecast(weatherForecastData);
```

获取天气数据：  

```cpp  
Blinker.weatherForecast(citycode); //传入参数为对应城市编码
```

调用示例：

```cpp
Blinker.weatherForecast(); //默认查询设备ip所属地区的当前时刻的天气情况
Blinker.weatherForecast(510100); //查询成都市当前时刻的天气情况
```

#### 当日空气  

注册回调函数，当设备查询到AQI数据时会调用对应的回调函数  

回调函数：  

``` cpp
void airData(const String & data) {
    BLINKER_LOG("air: ", data);
}
```

注册回调函数：

``` cpp
Blinker.attachAir(airData);
```

获取天气数据：  

```cpp  
Blinker.air(citycode); //传入参数为对应城市编码
```

调用示例：

``` cpp
Blinker.air(); //默认查询设备ip所属地区的当前时刻的空气质量情况
Blinker.air(510100); //查询成都市当前时刻的空气质量情况
```

### 调试模式Debug

#### 开启调试模式

将这行代码添加到您的工程文件第一行, 以启用串口调试输出功能:

```cpp 
#define BLINKER_PRINT Serial
``` 

在 `void setup()` 中初始化串口Serial :

``` cpp 
Serial.begin(115200); 
BLINKER_DEBUG.stream(BLINKER_PRINT); 
```

如果您想调试输出更多细节信息 :

``` cpp  
void setup() {
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);
    BLINKER_DEBUG.debugAll();
}
``` 

#### 输出调试信息

开启调试输出 (Debug) 后可以使用 **BLINKER_LOG()** 打印输出调试信息:

```cpp
BLINKER_LOG("detail message 1"); 
BLINKER_LOG("detail message 1", " 2"); 
BLINKER_LOG("detail message 1", " 2", " 3"); 
```

## 教育版本学习指南

### 🎓 学习目标

通过使用Blinker教育版，学生将掌握：

1. **面向对象编程**: 理解继承、多态的实际应用
2. **方法链模式**: 学习流畅接口的设计思想  
3. **IoT编程基础**: 物联网设备开发的核心概念
4. **内存管理**: C++中动态内存的分配和释放

### 📝 最佳实践

```cpp
// 推荐的代码结构
void setup() {
    // 1. 初始化串口和调试
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);
    
    // 2. 初始化硬件
    pinMode(LED_BUILTIN, OUTPUT);
    
    // 3. 初始化Blinker
    Blinker.begin(auth, ssid, pswd);
    
    // 4. 注册回调函数
    Button1.attach(button_callback);
    Blinker.attachData(dataRead);
}

void loop() {
    // 保持Blinker运行
    Blinker.run();
    
    // 定期更新传感器数据
    static unsigned long lastUpdate = 0;
    if (millis() - lastUpdate > 2000) {
        lastUpdate = millis();
        updateSensorData();
    }
}

void updateSensorData() {
    float temperature = readTemperature();
    
    // 使用方法链更新显示
    Number1.icon("far fa-thermometer")
           .color(temperature > 30 ? "#FF0000" : "#00AA00")
           .unit("°C")
           .text("温度")
           .value(temperature)
           .print();
}
```

### 🔍 常见问题解答

**Q: 为什么使用方法链？**  
A: 方法链让代码更简洁、更易读，一行代码就能设置多个属性，减少重复代码。

**Q: 如何选择合适的图标？**  
A: 访问 [FontAwesome图标库](https://fontawesome.com/v5/search) 查找合适的图标名称。

**Q: 颜色代码怎么写？**  
A: 支持十六进制颜色代码（如#FF0000）和HTML颜色名称（如red）。

### 📚 推荐学习路径

1. **基础入门**: 从Hello示例开始，理解基本的连接和通信
2. **组件学习**: 逐个学习Button、Number、Text等组件的使用
3. **传感器项目**: 结合实际传感器制作监控项目
4. **智能控制**: 实现远程控制LED、继电器等执行器
5. **综合项目**: 制作完整的智能家居或环境监测系统

## 感谢

[WebSockets](https://github.com/Links2004/arduinoWebSockets) - Blinker 用这个库建立了一个 websocket 服务器   
[Adafruit_MQTT_Library](https://github.com/adafruit/Adafruit_MQTT_Library) - Blinker 用这个库建立了一个 MQTT 客户端   
[ArduinoJson](https://github.com/bblanchon/ArduinoJson) - Blinker 用这个库解析Json数据
