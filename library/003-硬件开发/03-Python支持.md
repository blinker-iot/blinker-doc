# Python支持模块  
==2.0版本陆续更新中==  
面向linux设备提供python模块支持  
目前模块处于调试阶段，没有正式发布，暂时无法通过pip仓库安装  
你可以通过以下地址下载：  
https://github.com/blinker-iot/blinker-py  

>1. [支持情况](#支持情况 "支持情况")
1. [连接类型](#连接类型 "连接类型")
1. [准备工作](#准备工作 "准备工作")
1. [Blinker接口函数](#Blinker接口函数 "Blinker接口函数")
	1. [设备配置](#设备配置 "设备配置")
	1. [连接管理](#连接管理 "连接管理")
	1. [数据管理](#数据管理 "数据管理")
    1. [心跳包](#心跳包 "心跳包")
	1. [组件控制](#组件控制 "组件控制")
    1. [NTP时间](#NTP时间 "NTP时间")
	1. [设备延时](#设备延时 "设备延时")
    1. [SMS短信](#SMS短信 "SMS短信")
    1. [通知推送](#通知推送 "通知推送")
    1. [微信推送](#微信推送 "微信推送")
    1. [天气查询](#天气查询 "天气查询")
    1. [AQI查询](#AQI查询 "AQI查询")
    1. [Debug](#Debug "Debug")
	1. [LOG](#LOG "LOG")
1. [感谢](#感谢 "感谢")


## 支持情况  
Linux开发板、树莓派(Raspberry Pi)、香蕉派
  
## 连接类型
* Bluetooth 4.x(BLE)  
* WiFi  
* MQTT  
  
## 准备工作
开始使用前你需要做好如下准备:
* [python3.x](https://www.python.org/downloads/)  

* Install the [bluez](http://www.bluez.org/) 5.49 or newer  
[Adafruit install-bluez-on-the-raspberry-pi](https://learn.adafruit.com/install-bluez-on-the-raspberry-pi/installation)  
* Install the [blinker-py](https://github.com/blinker-iot/blinker-py)  
`git clone https://github.com/blinker-iot/blinker-py`  
`cd blinker-py`  
`sudo python3 setup.py install`  
`sudo pip3 install -r requirements.txt`  

<!-- * Install the [simple-websocket-server](https://github.com/dpallot/simple-websocket-server)  
`pip3 install SimpleWebSocketServer`  

* Install the [python-zeroconf](https://github.com/jstasiak/python-zeroconf)  
`pip3 install zeroconf`   

* Install the [paho.mqtt.python](https://github.com/eclipse/paho.mqtt.python)  
`pip3 install paho-mqtt`

* Install the [requests](https://github.com/requests/requests)  
`pip3 install requests`  

* Install the [bluez](http://www.bluez.org/) 5.49 or newer  
[Adafruit install-bluez-on-the-raspberry-pi](https://learn.adafruit.com/install-bluez-on-the-raspberry-pi/installation)  

* Install the [dbus-python](https://pypi.org/project/dbus-python/#description)  
`pip3 install dbus-python`  

* Install the [PyGobject](https://pygobject.readthedocs.io/en/latest/)  
`pip3 install pygobject`  

* Install the [blinker-py](https://github.com/blinker-iot/blinker-py)  
`git clone https://github.com/blinker-iot/blinker-py`  
`cd blinker-py`  
`sudo python3 setup.py install`     -->

>注:
>- 务必安装的模块 [blinker-py](https://github.com/blinker-iot/blinker-py)
>- BLE接入必需安装模块 [bluez](http://www.bluez.org/) / [dbus-python](https://pypi.org/project/dbus-python/#description) / [PyGobject](https://pygobject.readthedocs.io/en/latest/)  
>- WiFi接入必需安装模块 [simple-websocket-server](https://github.com/dpallot/simple-websocket-server) / [python-zeroconf](https://github.com/jstasiak/python-zeroconf) / [python-zeroconf](https://github.com/jstasiak/python-zeroconf) / [paho.mqtt.python](https://github.com/eclipse/paho.mqtt.python) / [requests](https://github.com/requests/requests)  

  
## Blinker接口函数
### 设备配置
#### Blinker.begin()
使用 **Blinker.begin()** 来配置 Blinker:
```
Blinker.begin(...)
```
根据你使用的连接方式选择不同的参数用于配置Blinker  
  

BLE:
```
from Blinker import *  
  
Blinker.mode("BLINKER_BLE")  
Blinker.begin()
```  

  
WiFi:
```
from Blinker import *  

auth = 'Your Device Secret Key'
  
Blinker.mode("BLINKER_WIFI")  
Blinker.begin(auth)
```  

<!-- > MQTT 支持的硬件: WiFiduino, WiFiduino32, ESP8266, ESP32   -->

**begin()** 主要完成以下配置:  
1.初始化硬件设置;  
2.连接网络并广播设备信息等待app连接;
### 连接管理
#### Blinker.connect()
建立 **Blinker** 设备间连接并返回连接状态, 默认超时时间为10秒
```
result = Blinker.connect()  
  

timeout = 30000 # ms  
result = Blinker.connect(timeout)
```
#### Blinker.disconnect()
断开 **Blinker** 设备间连接
```
Blinker.disconnect()
```
#### Blinker.connected()
返回 **Blinker** 设备间连接状态
```
result = Blinker.connected()
```  
#### Blinker.run()
此函数需要频繁调用以保持设备间连接及处理收到的数据, 建议放在 **main** 函数中
```
if __name__ == '__main__':  
    while True:  
        Blinker.run()
```

### 数据管理
#### Blinker.attachData()
注册回调函数，当有设备收到APP发来的数据时会调用对应的回调函数  

回调函数:
```
def data_callback(data):
    BLINKER_LOG("Blinker readString: ", data)
```
注册回调函数:
```
Blinker.attachData(data_callback)
```

#### Blinker.print()
发送数据
```
Blinker.print(data)
```

```
*发送数据最大为 128 字节  
*MQTT方式接入时, print需间隔1s以上  
例:  
Blinker.print("hello")  
Blinker.delay(1000)  
Blinker.print("world)  
```  

#### Blinker.notify()
使用 **notify** 时, 发送数据以感叹号开始, 将会发送消息通知到app, 否则将会发送Json数据到app  

发送通知
```
Blinker.notify("!notify")
```
发送Json数据, 如 {"notice":"notify"}
```
Blinker.notify("notify")
```  

### 心跳包
app定时向设备发送心跳包, 设备收到心跳包后会返回设备当前状态  
如果用户有自定义状态需要在收到心跳包时返回, 可调用以下函数:  

**Blinker.attachHeartbeat()**  
用户自定义状态返回的回调函数:
```
def heartbeat_callback():
    global counter
    
    button1.icon('icon_1')
    button1.color('#FFFFFF')
    button1.text('Your button name or describe')
    button1.print("on")

    number1.print(counter)
```
注册回调函数:
```
Blinker.attachHeartbeat(heartbeat_callback)
```
> 设备建立连接后app会立刻发送心跳包, 此后每30s-60会发送一次心跳包  

### 组件控制
== 使用组件前需要引用对应的组件 ==  
== from Blinker import Blinkerxxxx ==
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
```
BlinkerButton Button1("ButtonKey")
```
用于处理 **button** 收到数据的回调函数
```c++
void button1_callback(state)
{
    BLINKER_LOG("get button state: ", state)

    Button1.icon("icon_1")
    Button1.color("#FFFFFF")
    Button1.text("Your button name or describe")
    Button1.print("on")
}
```

在 **setup()** 中注册回调函数
```
Button1.attach(button1_callback)
```

> 在回调函数中, **state** 的值为:  
> - **按键** : "tap"(点按); "pre"(长按); "pup"(释放)  
> - **开关** : "on"(打开); "off"(关闭)  
> - **自定义** : 用户设置的值  
>   
> *也可以在创建对象时注册回调函数:
>> Button1 = BlinkerButton(BUTTON_1, button1_callback)  

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
```
BlinkerRGB RGB1("RGBKey")
```
用于处理 **RGB** 收到数据的回调函数
```
void rgb1_callback(r_value, g_value, b_value, bright_value)
{
    BLINKER_LOG("R value: ", r_value)
    BLINKER_LOG("G value: ", g_value)
    BLINKER_LOG("B value: ", b_value)
    BLINKER_LOG("Rrightness value: ", bright_value)
}
```

在 **setup()** 中注册回调函数
```
RGB1.attach(rgb1_callback)
```
> *也可以在创建对象时注册回调函数:
>> RGB1 = BlinkerRGB(RGB_1, rgb1_callback)   

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
```
BlinkerSlider Slider1("SliderKey")
```
用于处理 **Slider** 收到数据的回调函数
```
void slider1_callback(value)
{
    BLINKER_LOG("get slider value: ", value)
}
```

在 **setup()** 中注册回调函数
```
Slider1.attach(slider1_callback)
```
> *也可以在创建对象时注册回调函数:
>> Slider1 = BlinkerSlider(Slider_1, slider1_callback) 

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
```
BlinkerNumber NUM1("NUMKey")
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
    *BlinkerText.print()*  
    发送文字到APP  
    *BlinkerText.print(text1)*  
    发送一段文字  
    *BlinkerText.print(text1, text2)*  
    发送两段文字  

初始化, 创建对象
```
BlinkerText Text1("TextKey")
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
```
BlinkerJoystick JOY1("JOYKey")
```  

用于处理 **BlinkerJoystick** 收到数据的回调函数
```
void joystick1_callback(xAxis, yAxis)
{
    BLINKER_LOG("Joystick1 X axis: ", xAxis)
    BLINKER_LOG("Joystick1 Y axis: ", yAxis)
}
```

在 **setup()** 中注册回调函数
```
JOY1.attach(joystick1_callback)
```
> *也可以在创建对象时注册回调函数:
>> JOY1 = BlinkerJoystick(JOY_1, joystick1_callback)  

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
```
void switch_callback(state)
{
    BLINKER_LOG("get switch state: ", state)

    BUILTIN_SWITCH.print("on")
}
```

在 **setup()** 中注册回调函数
```
BUILTIN_SWITCH.attach(switch_callback)
```

#### Blinker.ahrs()
开启手机 **AHRS** 功能
```
Blinker.attachAhrs()
```
读取 **AHRS** 数据
```
result_Yaw = Blinker.ahrs(Yaw)  
result_Roll = Blinker.ahrs(Roll)  
result_Pitch = Blinker.ahrs(Pitch)
```
关闭手机 **AHRS** 功能
```
Blinker.dettachAhrs()
```
#### Blinker.gps()
<!-- 刷新手机 **GPS** 功能
```
Blinker.freshAhrs();
``` -->
读取 **GPS** 数据
```
result_LONG = Blinker.gps(LONG)  
result_LAT = Blinker.gps(LAT)
```
> LONG 经度  
> LAT 维度  

#### Blinker.vibrate()
发送手机振动指令, 震动时间, 单位ms 毫秒, 数值范围0-1000, 默认为500
```
Blinker.vibrate()
Blinker.vibrate(255)  
```
### NTP时间  
> NTP 目前仅试用于WiFi接入  

#### Blinker.time()
获取当前ntp时间, 单位为秒(s)
```
times = Blinker.time()
```
#### Blinker.second()
获取当前时间秒数, 单位为秒(s), 获取成功时值: 0-59
```
sec = Blinker.second()
```
#### Blinker.minute()
获取当前时间分钟数, 单位为分(m), 获取成功时值: 0-59
```
min = Blinker.minute()
```
#### Blinker.hour()
获取当前时间小时数, 单位为小时(h), 获取成功时值: 0-23
```
hour = Blinker.hour()
```
#### Blinker.wday()
获取当前时间为当周的日期, 单位为天(d), 获取成功时值: 0-6(依次为周日/一/二/三/四/五/六)
```
wday = Blinker.wday()
```
#### Blinker.mday()
获取当前时间为当月第几天, 单位为天(d), 获取成功时值: 1-31
```
mday = Blinker.mday()
```
#### Blinker.yday()
获取当前时间为当年第几天, 单位为天(d), 获取成功时值: 1-366
```
yday = Blinker.yday()
```
#### Blinker.month()
获取当前时间为当年第几月, 单位为月(mon), 获取成功时值: 1-12
```
month = Blinker.month()
```
#### Blinker.year()
获取当前时间对应年, 单位为年(y), 获取成功时值: 201x
```
year = Blinker.year()
```
### 设备延时
#### Blinker.delay()
延时函数, 在延时过程中仍保持设备间连接及数据接收处理
```
Blinker.delay(500)
```
>*为了连接设备成功, 需要延时时务必使用该函数;  
>使用此函数可以在延时期间连接设备及接收数据并处理数据, 延时完成后才能执行后面的程序; 

### SMS短信
设备通过WiFi接入时可以使用 **Blinker.sms()** 默认向该设备所属用户注册对应的手机发送一条短信.
```
Blinker.sms("Hello blinker!")
```
>注: 每个用户短信使用限制为 10条/天/人, 20字/条  
>目前diy用户只能向设备所属用户注册对应的手机发送短信  
  
后期将增加功能，付费用户可以在app端设置10个短信接收手机号, 对其中一个手机号发送一条信息
```
phone = "18712345678";
Blinker.sms("Hello blinker!", phone)
```

### 通知推送
设备通过 **WiFi** 接入时可以使用 **Blinker.push()** 默认向该设备所属用户登陆App的手机发送一条通知.
```
Blinker.push("Hello blinker! Button pressed!")
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
Blinker.wechat("Title: button", "State: pressed", "Message: hello blinker")
```
> 模板消息中依次为标题, 状态, 消息内容  

> 注: 每个用户微信推送使用限制为 10条/天/人  
> *限制 1次/分钟    


>**注意**  
>- 禁止发送互联网金融相关的所有内容，包括验证码、系统通知和营销推广短信  
>- 系统通知类短信不支持营销内容  
>- 禁止发送涉及：色情、赌博、毒品、党政、维权、众筹、慈善募捐、宗教、迷信、股票、移民、面试招聘、博彩、贷款、催款、信用卡提额、投资理财、中奖、抽奖、一元夺宝、一元秒杀、A货、整形、烟酒、交友、暴力、恐吓、皮草、返利、代开发票、代理注册、代办证件、加群、加QQ或者加微信、贩卖个人信息、运营商策反、流量营销等信息的短信  
>- 营销推广短信除上述禁止内容外，另不支持：保险、房地产、教育、培训、游戏、美容、医疗、会所、酒吧、足浴、助考、商标注册、装修、建材、家私、会展、车展、房展等信息的短信  
>- 如出现违法违规或者损害到相关他人权益的,平台将保留最终追究的权利！请各会员严格遵守规范要求，加强自身业务安全，健康发送短信  

### 天气查询
设备通过 **WiFi** 接入时可以使用 **Blinker.weather()** 查询天气情况.
```
weather_default = Blinker.weather()//默认查询设备ip所属地区的当前时刻的天气情况

weather_chengdu = Blinker.weather("chengdu")//查询成都市当前时刻的天气情况

weather_beijing = Blinker.weather("beijing")//查询北京市当前时刻的天气情况
```
> *限制 1次/分钟  

```
location = "chengdu"//传入参数为对应城市拼音/英文
weather = Blinker.weather(location)
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
设备通过 **WiFi** 接入时可以使用 **Blinker.aqi()** 查询空气质量情况.
```
aqi_default = Blinker.aqi()//默认查询设备ip所属地区的当前时刻的空气质量情况

aqi_chengdu = Blinker.aqi("chengdu")//查询成都市当前时刻的空气质量情况

aqi_beijing = Blinker.aqi("beijing")//查询北京市当前时刻的空气质量情况
```
> *限制 1次/分钟  

```
location = "chengdu"//传入参数为对应城市拼音/英文
aqi = Blinker.aqi(location)
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


### Debug
<!-- 将这行代码添加到你的工程文件第一行, 以启用串口调试输出功能:
```
#define BLINKER_PRINTER Serial
```
在 `void setup()` 中初始化串口Serial :
```
Serial.begin(115200);
```
你可以用额外的硬件串口 (HardWareSerial) 或者软串口 (SoftWareSerial) 来调试输出 (你需要额外的适配器将该串口连接到你的电脑上).  
   -->
如果你想调试输出更多细节信息 :
```
from Blinker import *

BLINKER_DEBUG.debugAll()

Blinker.mode(BLINKER_WIFI)
Blinker.begin(auth)
```

### LOG
开启调试输出 (Debug) 后可以使用 **BLINKER_LOG()** 打印输出调试信息:
```
BLINKER_LOG("detail message 1")  
BLINKER_LOG("detail message 1", " 2")    
```

## 感谢
[simple-websocket-server](https://github.com/dpallot/simple-websocket-server) - Blinker 用这个库建立了一个 websocket 服务器  
[python-zeroconf](https://github.com/jstasiak/python-zeroconf) - Blinker 用这个库建立了一个 mDNS 服务  
[paho.mqtt.python](https://github.com/eclipse/paho.mqtt.python) - Blinker 用这个库建立了一个 MQTT Client  
[requests](https://github.com/requests/requests) - Blinker 用这个库发送网络请求  
[bluez](http://www.bluez.org/)  
[dbus-python](https://pypi.org/project/dbus-python/#description)  
[PyGobject](https://pygobject.readthedocs.io/en/latest/)  - Blinker 用这些库建立BLE服务  


