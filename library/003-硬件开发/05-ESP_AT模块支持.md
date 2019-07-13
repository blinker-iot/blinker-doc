# ESP_AT模块支持文档
==ESP_AT模块指令集文档，需烧录blinker定制的[AT固件](https://github.com/blinker-iot/blinker-library/blob/master/examples/Blinker_AT_Firmware/AT_Firmware_WiFi/AT_Firmware_WiFi.ino)。==  
固件在安装blinker库后  
**blinker->examples->Blinker_AT_Firmware->AT_Firmware_WiFi**  
路径下，使用 arduino IDE 直接编译下载即可。

>1. [支持的硬件](#支持的硬件 "支持的硬件")
1. [支持的接入方式](#支持的接入方式 "支持的接入方式")
1. [准备工作](#准备工作 "准备工作")
1. [设备上线流程](#设备上线流程 "设备上线流程")
1. [Blinker接口函数](#Blinker接口函数 "Blinker接口函数")
    1. [设备配置](#设备配置 "设备配置")
	1. [GPIO配置](#GPIO配置 "GPIO配置")
    1. [RESET](#RESET "RESET")
1. [AT-指令说明](#AT-指令说明 "AT-指令说明")
    1. [AT-规范](#AT-规范 "AT-规范")
	1. [基础AT指令](#基础AT指令 "基础AT指令")
	1. [基础AT指令描述](#基础AT指令描述 "基础AT指令描述")
1. [感谢](#感谢 "感谢")

## 支持的硬件
* ESP8266  
* ESP32  

## 支持的接入方式
* WiFi  

## 准备工作
使用前你需要做好如下准备:
* [Arduino IDE](https://www.arduino.cc/en/Main/Software) 1.6.12或更新版本  
* 使用 Arduino IDE 的开发板管理器安装[esp8266 arduino package](https://github.com/esp8266/arduino)  
* 按照 [安装说明](https://github.com/espressif/arduino-esp32#installation-instructions) 安装 [espressif/arduino-esp32](https://github.com/espressif/arduino-esp32)  

==注意：blinker AT固件至少需要1MB以上的Flash空间，请自行在**IDE>工具>Flash size**中设置==  

## 设备上线流程
![](assets/003/esp_at.png)  
**MCU主控** 往 **ESP_AT模块** 发送: ***AT***  
**ESP_AT模块** 向 **MCU主控** 反馈: ***OK***  
**MCU主控** 往 **ESP_AT模块** 发送: ***AT+BLINKER_WIFI=1,authKey***  
**ESP_AT模块** 向 **MCU主控** 反馈: ***+BLINKER_WIFI:deviceName,uuid***  

==设备上线后即可作为透传模块让主控与app进行通信==  

<!-- ```sequence
participant MCU主控
participant ESP_AT模块

MCU主控 -> ESP_AT模块: AT
ESP_AT模块 ->MCU主控: OK
MCU主控 -> ESP_AT模块: AT+BLINKER_WIFI=1,authKey
ESP_AT模块 ->MCU主控: +BLINKER_WIFI:deviceName,uuid
``` -->  

## Blinker接口函数
==此处主要针对ESP AT支持使用到的特有接口函数，未提到的接口函数参考[Arduino支持](?file=003-硬件开发/02-Arduino支持 "Blinker接口函数")==  

### 设备配置  
#### Blinker.begin()  
使用 **Blinker.begin()** 来配置 Blinker:  
```arduino
Blinker.begin(...);
```

WiFi:
```arduino
#define BLINKER_WIFI  
#include <Blinker.h>  
  
void setup() {  
    Blinker.begin(auth, ssid, pswd);  
}
```
>ESP AT模块:
>**Blinker.begin(auth, ssid, pswd)** 将使用默认设置配置 Serial(默认使用软串口)   
>  
>Blinker.begin(auth, ssid, pswd);// 默认设置: 数字IO 2(RX) 3(TX), 波特率 9600 bps  
>Blinker.begin(auth, ssid, pswd, 4, 5);// 设置数字IO 4(RX) 5(TX), 默认波特率 9600 bps  
>Blinker.begin(auth, ssid, pswd, 4, 5, 115200);// 设置数字IO 4(RX) 5(TX) 及波特率 115200 bps  
>  
>若配置时Blinker.begin(auth, ssid, pswd, 0, 1);  
>0 1对应硬串口的RX TX, 库会默认使用硬串口与BLE模块进行通信  
>Blinker.begin(auth, ssid, pswd, 15, 14);//Arduino MEGA中如15, 14对应硬串口Serial3  
>  
>注意使用软串口时:  
>使用Arduino MEGA时以下IO可以设置为RX: 10, 11, 12, 13, 50, 51, 52, 53, 62, 63, 64, 65, 66, 67, 68, 69  
>使用Arduino Leonardo时以下IO可以设置为RX: 8, 9, 10, 11, 14, 15, 16  
  
> WiFi 支持的AT模块硬件: WiFiduino, WiFiduino32, ESP8266, ESP32  

**begin()** 主要完成以下配置:  
1.初始化硬件设置;  
2.连接网络并广播设备信息等待app连接;

### GPIO配置
#### Blinker.pinMode()
设置 ESP_AT 模块上 GPIO 的工作模式
```arduino
Blinker.pinMode(4, INPUT);
Blinker.pinMode(5, INPUT_PULLUP);
Blinker.pinMode(6, OUTPUT);
```
将 ESP_AT 模块上的 GPIO4 设置为输入模式，不使能上拉也不使能下拉;  
将 ESP_AT 模块上的 GPIO5 设置为输入模式并使能上拉;  
将 ESP_AT 模块上的 GPIO6 设置为输出模式;  

#### Blinker.digitalWrite()
设置 ESP_AT 模块上 GPIO 的输出电平
```arduino
Blinker.digitalWrite(6, HIGH);
Blinker.delay(1000);
Blinker.digitalWrite(6, LOW);
```
将 ESP_AT 模块上的 GPIO6 设置为输出高电平后延时1s，再将 GPIO6 设置为输出低电平;  

#### Blinker.digitalRead()
读取 ESP_AT 模块上 GPIO 的输入电平
```arduino
uint8_t d5_read = Blinker.digitalRead(5);
```

#### Blinker.analogRead()
读取 ESP_AT 模块上 GPIO A0 的 ADC 值
```arduino
int adc_read = Blinker.analogRead();
```

### RESET
发送重启指令并重启 ESP_AT 模块
```arduino
Blinker.reset();
```

## AT-指令说明
### AT-规范
| 指令 | 描述 |
| :-: | :- |
| 测试指令 | AT+\<X>=? |  
| 查询指令 | AT+\<X>? |  
| 设置指令 | AT+\<X>=\<...> |  
| 执行指令 | AT+\<X> |  

### 基础AT指令
| 指令 | 描述 |
| :-: | :- |
| AT | 测试AT启动 |
| AT+RST | 重启模块 |
| AT+GMR | 查询版本信息 |
| AT+RESTORE | 恢复出厂设置 |
| AT+UART_CUR | UART 当前临时配置 |
| AT+UART_DEF | UART 默认配置，保存到 Flash |
| AT+SYSRAM | 查询系统当前剩余内存 |
| AT+SYSADC | 查询 ADC 值 |
| AT+SYSIOSETCFG | 设置 IO 工作模式 |
| AT+SYSIOGETCFG | 查询 IO 工作模式 |
| AT+SYSGPIOWRITE | 设置 GPIO 的输出电平 |
| AT+SYSGPIOREAD | 读取 GPIO 的电平状态 |
| AT+BLINKER_WIFI | 设置 BLINKER_WIFI 接入 |
| AT+BLINKER_ALIGENIE | 设置天猫精灵接入设备类型 |
| AT+BLINKER_DUEROS | 设置小度音箱接入设备类型 |
| AT+TIMEZONE | 设置时区 |
| AT+TIME | 查询 当前 NTP 时间 |
| AT+SECOND | 查询 当前时间 秒数 |
| AT+MINUTE | 查询 当前时间 分钟数 |
| AT+HOUR | 查询 当前时间 小时数 |
| AT+WDAY | 查询 当前时间 当周的日期 |
| AT+MDAY | 查询 当前时间 为当月第几天 |
| AT+YDAY | 查询 当前时间 为当年第几天 |
| AT+MONTH | 查询 当前时间 为当年第几月 |
| AT+YEAR | 查询 当前时间 对应年 |
| AT+WEATHER | 读取 天气情况 |
| AT+AQI | 读取 AQI 情况 |
| AT+NOTIFY | 发送通知 |
| AT+SMS | 发送 SMS 短信 |


<!-- | AT+SYSGPIODIR | 设置 GPIO 工作为输入或输出 | -->

### 基础AT指令描述
#### AT - 测试 AT 启动
| 执行指令 | AT |  
| :-: | :- |
| 响应 | OK | 
| 参数说明 | - | 

#### AT+RST - 重启模块
| 执行指令 | AT+RST | 
| :-: | :- |
| 响应 | OK | 
| 参数说明 | - | 

#### AT+GMR - 查询版本信息
| 执行指令 | AT+GMR | 
| :-: | :- |
| 响应 | \<AT version info> <br> \<SDK version info> <br> OK |
| 参数说明 | \<AT version info>: AT 版本信息 <br> \<SDK version info>: SDK 版本信息 | 

#### AT+RESTORE - 恢复出厂设置
| 执行指令 | AT+RESTORE | 
| :-: | :- |
| 响应 | OK | 
| 参数说明 | 恢复出厂设置，将擦除所有保存到 Flash 的参数，恢复为默认参数。<br>恢复出厂设置会导致设备重启。 | 

#### AT+UART_CUR - UART 当前临时配置
| 指令 | 查询指令:<br>AT+UART_CUR? | 设置指令:<br>AT+UART_CUR=\<baudrate>,\<databits>,\<stopbits>,\<parity> |
| :-: | :- | :- |
| 响应 | +UART_CUR:\<baudrate>,\<databits>,\<stopbits>,\<parity> <br> OK | OK |
| 参数说明 | \<baudrate>: UART 波特率 <br> \<databits>: 数据位 <br> \<stopbits>: 停止位 <br> \<parity>: 校验位 </td> | \<baudrate>: UART 波特率 <br> - 波特率范围: 110-115200*40 <br> <br> \<databits>: 数据位 <br> - 5: 5 bit 数据位 <br> - 6: 6 bit 数据位 <br> - 7: 7 bit 数据位 <br> - 8: 8 bit 数据位 <br> <br> \<stopbits>: 停止位 <br> - 1: 1 bit 停止位 <br> - 1.5: 1.5 bit 停止位 <br> - 2: 2 bit 停止位 <br> <br> \<parity>: 校验位 <br> - 0: NONE <br> - 1: Odd <br> - 2: Even |
> *注：本设置不保存在 Flash  
> 波特率默认 9600, 8 bit 数据位, 1 bit 停止位, NONE 校验位  

#### AT+UART_DEF - UART 默认配置，保存到 Flash
| 指令 | 查询指令:<br>AT+UART_DEF? | 设置指令:<br>AT+UART_DEF=\<baudrate>,\<databits>,\<stopbits>,\<parity> |
| :-: | :- | :- |
| 响应 | +UART_DEF:\<baudrate>,\<databits>,\<stopbits>,\<parity> <br> OK | OK |
| 参数说明 | \<baudrate>: UART 波特率 <br> \<databits>: 数据位 <br> \<stopbits>: 停止位 <br> \<parity>: 校验位 </td> | \<baudrate>: UART 波特率范围:  <br> 300/1200/2400/4800/9600/19200/ <br> 38400/57600/74880/115200/230400/ <br> 250000/500000/1000000/2000000 <br> <br> \<databits>: 数据位 <br> - 5: 5 bit 数据位 <br> - 6: 6 bit 数据位 <br> - 7: 7 bit 数据位 <br> - 8: 8 bit 数据位 <br> <br> \<stopbits>: 停止位 <br> - 1: 1 bit 停止位 <br> - 1.5: 1.5 bit 停止位 <br> - 2: 2 bit 停止位 <br> <br> \<parity>: 校验位 <br> - 0: NONE <br> - 1: Odd <br> - 2: Even |
> *注：本设置保存在 Flash 模拟的 EEPROM 中, 重新上电后仍然生效  
> 波特率默认 9600, 8 bit 数据位, 1 bit 停止位, NONE 校验位  

#### AT+SYSRAM - 查询系统当前剩余内存
| 查询指令 | AT+SYSRAM? | 
| :-: | :- |
| 响应 | +SYSRAM:\<RAM> <br> OK |
| 参数说明 | \<RAM>：系统当前剩余内存，单位：byte | 

#### AT+SYSADC - 查询 ADC 值
| 查询指令 | AT+SYSADC? | 
| :-: | :- |
| 响应 | +SYSADC:\<ADC> <br> OK |
| 参数说明 | \<ADC>：查询到的 ADC 值，单位：1/1024V | 

#### AT+SYSIOSETCFG - 设置 IO 工作模式
| 设置指令 | AT+SYSIOSETCFG=\<pin>,\<mode>,\<pull_state> | 
| :-: | :- |
| 响应 | OK | 
| 参数说明 | \<pin>: IO 管脚号 <br> <br> \<mode>: IO 工作模式 <br> - 0: INPUT 输入 <br> - 1: OUTPUT 输出 <br> <br> \<pull_state> <br> - 0: NONE 不使能上拉及下拉 <br> - 1: 使能上拉 <br> 2: 使能下拉 | 

#### AT+SYSIOGETCFG - 查询 IO 工作模式
| 设置指令 | AT+SYSIOGETCFG=\<pin> | 
| :-: | :- |
| 响应 | +SYSIOSETCFG:\<pin>,\<mode>,\<pull_state> <br> OK | 
| 参数说明 | \<pin>: IO 管脚号 <br> <br> \<mode>: IO 工作模式 <br> - 0: INPUT 输入 <br> - 1: OUTPUT 输出 <br> - 2: NONE 未设置 <br> <br> \<pull_state> <br> - 0: NONE 不使能上拉及下拉 <br> - 1: 使能上拉 <br> 2: 使能下拉 | 

#### AT+SYSGPIOWRITE - 设置 GPIO 的输出电平
| 设置指令 | ATSY+SGPIOWRITE=\<pin>,\<level> | 
| :-: | :- |
| 响应 | - 如果成功 返回<br> OK <br> - 如果 IO 不处于输出模式 返回 <br> ERROR | 
| 参数说明 | \<pin>: IO 管脚号 <br> <br> \<level>:  <br> - 0: LOW 低电平 <br> - 1: HIGH 高电平 | 

#### AT+SYSGPIOREAD - 读取 GPIO 的电平状态
| 设置指令 | AT+SYSGPIOREAD=\<pin> | 
| :-: | :- |
| 响应 | - 如果成功 返回 <br> +SYSGPIOREAD:\<pin>,\<mode>,\<level> <br> OK <br> <br> - 如果 IO 不处于输出模式 返回  <br> ERROR | 
| 参数说明 | \<pin>: IO 管脚号 <br> <br> \<mode>: IO 工作模式 <br> - 0: INPUT 输入 <br> - 1: OUTPUT 输出 <br> <br> \<level>:  <br> - 0: LOW 低电平 <br> - 1: HIGH 高电平 | 

#### AT+BLINKER_WIFI - 设置 BLINKER_WIFI 接入
| 指令 | 查询指令:<br>AT+BLINKER_WIFI? | 设置指令:<br>AT+BLINKER_WIFI=\<MQTT_CONFIG_MODE>,\<MQTT_AUTH_KEY>[,\<MQTT_WIFI_SSID>,\<MQTT_WIFI_PSWD>]|
| :-: | :- | :- |
| 响应 | +BLINKER_WIFI:\<MQTT_CONFIG_MODE>,\<MQTT_AUTH_KEY>[,\<MQTT_WIFI_SSID>,\<MQTT_WIFI_PSWD>] <br> OK | +BLINKER_WIFI:\<DEVICEID>,\<UUID> <br> OK |
| 参数说明 | \<MQTT_CONFIG_MODE>: WiFi配网模式 <br> \<MQTT_AUTH_KEY>: MQTT设备的authKey <br> \<MQTT_WIFI_SSID>: 接入WiFi的SSID <br> \<MQTT_WIFI_PSWD>: 接入WiFi的PASSWORD | \<DEVICEID>: 设备ID <br> <br> \<UUID>: 用户UUID <br> <br> \<MQTT_CONFIG_MODE>: WiFi配网模式 <br> - 0 common config 常规配网 <br> - 1 smartconfig ESPTOUCH自动配网 <br> - 2 apconfig AP热点配网 <br> <br> * 常规配网[0]时务必填写接入WiFi的SSID和PASSWORD, ESPTOUCH[1]和AP[2]配网可不填 |
> *注: 设置完成后，模块即可作为透传模块让主控与app进行通信。  

#### AT+BLINKER_ALIGENIE - 设置设置天猫精灵接入设备类型
| 指令 | 查询指令:<br>AT+BLINKER_ALIGENIE? | 设置指令:<br>AT+BLINKER_ALIGENIE=\<type> |
| :-: | :- | :- |
| 响应 | +BLINKER_WIFI:\<type><br> OK | OK |
| 参数说明 | \<type>: 接入设备类型 | \<type>: 接入设备类型 <br> - 0 NONE 未设置 <br> - 1 LIGHT 灯 <br> - 2 OUTLET 插座 <br> - 3 SENSOR 传感器 |
> *注: 需在设置 BLINKER_WIFI 前进行天猫精灵接入设备类型的设置。  

示例:
```arduino
AT+BLINKER_ALIGENIE=0
AT+BLINKER_WIFI=1,authKey
```

#### AT+BLINKER_DUEROS - 设置设置小度音箱接入设备类型
| 指令 | 查询指令:<br>AT+BLINKER_DUEROS? | 设置指令:<br>AT+BLINKER_DUEROS=\<type> |
| :-: | :- | :- |
| 响应 | +BLINKER_WIFI:\<type><br> OK | OK |
| 参数说明 | \<type>: 接入设备类型 | \<type>: 接入设备类型 <br> - 0 NONE 未设置 <br> - 1 LIGHT 灯 <br> - 2 OUTLET 插座 <br> - 3 SENSOR 传感器 |
> *注: 需在设置 BLINKER_WIFI 前进行小度音箱接入设备类型的设置。  

示例:
```arduino
AT+BLINKER_DUEROS=0
AT+BLINKER_WIFI=1,authKey
```

#### AT+TIMEZONE - 设置时区
| 指令 | 查询指令:<br>AT+TIMEZONE? | 设置指令:<br>AT+TIMEZONE=\<TIMEZONE> |
| :-: | :- | :- |
| 响应 | +UART_CUR:\<TIMEZONE> <br> OK | OK |
| 参数说明 | \<TIMEZONE>: 时区 | \<TIMEZONE>: 时区 <br> 中国-北京: 8.0 <br> 美国-纽约: -5.0 |

#### AT+TIME - 查询 当前 NTP 时间
| 查询指令 | AT+TIME? | 
| :-: | :- |
| 响应 | +TIME:\<senconds> <br> OK |
| 参数说明 | \<senconds>：查询到的 NTP 时间，单位：s | 

#### AT+SECOND - 查询 当前时间 秒数
| 查询指令 | AT+SECOND? | 
| :-: | :- |
| 响应 | +SECOND:\<senconds> <br> OK |
| 参数说明 | \<senconds>：查询到的 当前时间 秒数，单位：s <br> 获取成功时值: 0-59 <br> 获取失败时值: -1 | 

#### AT+MINUTE - 查询 当前时间 分钟数
| 查询指令 | AT+MINUTE? | 
| :-: | :- |
| 响应 | +MINUTE:\<minutes> <br> OK |
| 参数说明 | \<minutes>：查询到的 当前时间 分钟数，单位：m <br> 获取成功时值: 0-59 <br> 获取失败时值: -1 | 

#### AT+HOUR - 查询 当前时间 小时数
| 查询指令 | AT+HOUR? | 
| :-: | :- |
| 响应 | +HOUR:\<hours> <br> OK |
| 参数说明 | \<hours>：查询到的 当前时间 小时数，单位：h <br> 获取成功时值: 0-23 <br> 获取失败时值: -1 | 

#### AT+WDAY - 查询 当前时间 当周的日期
| 查询指令 | AT+WDAY? | 
| :-: | :- |
| 响应 | +WDAY:\<wday> <br> OK |
| 参数说明 | \<wday>：查询到的 当前时间 当周的日期，单位：d <br> 获取成功时值: 0-6(依次为周日/一/二/三/四/五/六) <br> 获取失败时值: -1 | 

#### AT+MDAY - 查询 当前时间 为当月第几天
| 查询指令 | AT+MDAY? | 
| :-: | :- |
| 响应 | +MDAY:\<mday> <br> OK |
| 参数说明 | \<mday>：查询到的 当前时间 为当月第几天，单位：d <br> 获取成功时值: 1-31 <br> 获取失败时值: -1 | 

#### AT+YDAY - 查询 当前时间 为当年第几天
| 查询指令 | AT+YDAY? | 
| :-: | :- |
| 响应 | +YDAY:\<yday> <br> OK |
| 参数说明 | \<yday>：查询到的 当前时间 为当年第几天，单位：d <br> 获取成功时值: 1-366 <br> 获取失败时值: -1 | 

#### AT+MONTH - 查询 当前时间 为当年第几月
| 查询指令 | AT+MONTH? | 
| :-: | :- |
| 响应 | +MONTH:\<month> <br> OK |
| 参数说明 | \<month>：查询到的 当前时间 为当年第几月，单位：m <br> 获取成功时值: 1-12 <br> 获取失败时值: -1 | 

#### AT+YEAR - 查询 当前时间 对应年
| 查询指令 | AT+YEAR? | 
| :-: | :- |
| 响应 | +YEAR:\<year> <br> OK |
| 参数说明 | \<year>：查询到的 当前时间 对应年，单位：y <br> 获取成功时值: 20xx <br> 获取失败时值: -1 | 

#### AT+WEATHER - 读取 天气情况
| 设置指令 | AT+WEATHER=\<city> | 
| :-: | :- |
| 响应 | +WEATHER:\<weather> <br> OK |
| 参数说明 | \<city>:查询城市的名字 默认则为:default <br>\<weather>：读取到的 天气情况 | 

#### AT+AQI - 读取 AQI 情况
| 设置指令 | AT+AQI=\<city> | 
| :-: | :- |
| 响应 | +AQI:\<aqi> <br> OK |
| 参数说明 | \<city>:查询城市的名字 默认则为:default <br>\<aqi>：读取到的 AQI 情况 | 

#### AT+NOTIFY - 发送通知
| 设置指令 | AT+NOTIFY=\<data> | 
| :-: | :- |
| 响应 | OK |
| 参数说明 | \<data>：通知消息的内容 | 

#### AT+SMS - 发送 SMS 短信
| 设置指令 | AT+SMS=\<data> | 
| :-: | :- |
| 响应 | OK |
| 参数说明 | \<data>：SMS 短信的内容 | 

## 感谢
[WebSockets](https://github.com/Links2004/arduinoWebSockets) - Blinker 用这个库建立了一个 websocket 服务器   
[Adafruit_MQTT_Library](https://github.com/adafruit/Adafruit_MQTT_Library) - Blinker 用这个库建立了一个 MQTT 客户端   
[ArduinoJson](https://github.com/bblanchon/ArduinoJson) - Blinker 用这个库解析Json数据   
