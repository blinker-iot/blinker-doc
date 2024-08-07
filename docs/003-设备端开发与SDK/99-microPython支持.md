# microPython支持模块  
**已弃用，不建议使用**  
面向ESP32设备提供microPython模块支持  
您可以通过以下地址下载：  
https://github.com/blinker-iot/blinker-mpy  

## 支持情况  
ESP32  

## 连接类型
* WiFi  

## 准备工作
* [micropython](http://docs.micropython.org/en/latest/esp32/quickref.html)  
* [ESP32 firmware](https://micropython.org/download#esp32)  
* [blinker-mpy](https://github.com/blinker-iot/blinker-mpy)  

> 注:  
> 解压后直接各文件夹放到mpy的根目录下即可  

## Blinker接口函数
### 设备配置
#### Blinker.begin()
使用 **Blinker.begin()** 来配置 Blinker:
```
Blinker.begin(...)
```
根据您使用的连接方式选择不同的参数用于配置Blinker  
    
WiFi:
```
from Blinker.Blinker import *  

auth = 'Your Device Secret Key'
ssid = 'Your WiFi network SSID or name'
pswd = 'Your WiFi network WPA password or WEP key'
  
Blinker.mode("BLINKER_WIFI")  
Blinker.begin(auth, ssid, pswd)
```  

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
== from Blinker.Blinker import Blinkerxxxx ==
#### BlinkerButton  
按键组件在App中可以设置 按键/开关/自定义 三种模式:  
- **按键** 模式下支持 点按/长按/释放(tap/press/pressup) 三个动作  
- **开关** 模式下支持 打开/关闭(on/off) 两个动作  
- **自定义** 模式下支持 自定义指令 发送  

**函数** :
- attach()  
    *BlinkerButton.attach()*  
    注册按键的回调函数, 当收到指令时会调用该回调函数
- icon()  
    *BlinkerButton.icon()*  
    设置按键中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/v5/search)
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
```cpp
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
> - **按键** : "tap"(点按); "press"(长按); "pressup"(释放)  
> - **开关** : "on"(打开); "off"(关闭)  
> - **自定义** : 用户设置的值  
>   
> *也可以在创建对象时注册回调函数:
>> Button1 = BlinkerButton(BUTTON_1, button1_callback)  


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

#### BlinkerNumber
数字组件, 用于发送数据到APP, 显示数字数据  

**函数** :
- icon()  
    *BlinkerNumber.icon()*  
    设置数字组件中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/v5/search)
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

### 短信通知  
**该功能仅限专业版用户使用 10条/天/人, 20字/条，1次/分钟，只能向注册手机号发送短信通知**  
设备通过WiFi接入时可以使用 **Blinker.sms()** 默认向该设备所属用户注册对应的手机发送一条短信.
```
Blinker.sms("Hello blinker!")
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
- 1.关注 点灯物联 微信公众号  
- 2.打开 点灯物联 微信公众号, 点击主页右下角 Blinker  
- 3.输入账号密码完成绑定  

**建议用户使用微信模板消息**  
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

### Debug
如果您想调试输出更多细节信息 :
```
from Blinker.Blinker import *

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
