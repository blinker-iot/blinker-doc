# microPython支持模块
面向ESP32设备提供microPython模块支持  
你可以通过以下地址下载：  
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
根据你使用的连接方式选择不同的参数用于配置Blinker  
    
WiFi:
```
from Blinker import *  

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
> - **按键** : "tap"(点按); "pre"(长按); "pup"(释放)  
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
