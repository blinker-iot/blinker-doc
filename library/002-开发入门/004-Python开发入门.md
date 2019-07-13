# python开发入门  
==2.0 python模块陆续更新中==  
本文档，适用于Linux开发板、树莓派(Raspberry Pi)、香蕉派等。  

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
这里以 WiFi接 入为例  
```python
from Blinker import *

auth = 'Your Device Secret Key'

BLINKER_DEBUG.debugAll()

Blinker.mode(BLINKER_WIFI)
Blinker.begin(auth)

button1 = BlinkerButton("btn-abc")
number1 = BlinkerNumber("num-abc")

counter = 0

def button1_callback(state):
    """ """

    BLINKER_LOG('get button state: ', state)

    button1.icon('icon_1')
    button1.color('#FFFFFF')
    button1.text('Your button name or describe')
    button1.print(state)

def data_callback(data):
    global counter
    
    BLINKER_LOG("Blinker readString: ", data)
    counter += 1
    number1.print(counter)

button1.attach(button1_callback)
Blinker.attachData(data_callback)

if __name__ == '__main__':

    while True:
        Blinker.run()

```

## blinker初始化/选择连接方式  
```python
Blinker.mode(BLINKER_WIFI)
```
用于指定设备接入方式，你还可以使用 **BLINKER_BLE**，不同的接入方式对应的Blinker初始化函数也不同：
### 蓝牙接入
```python
Blinker.mode(BLINKER_BLE)
```
### WiFi接入  
```python
Blinker.mode(BLINKER_WIFI)
```

## 新建组件对象/绑定组件  
```python
Button1 = BlinkerButton("btn-abc")
Number1 = BlinkerNumber("num-abc")
```
使用组件的键名创建对应的对象可以将设备与blinker app界面上的UI组件进行绑定。  
key为组件的键名，在app中切换到编辑模式可以看到；  
blinker库定义了多种组件类型，如 **BlinkerSlider BlinkerRGB BlinkerNumber BlinkerText**  

## 注册组件回调
回调函数
```python
def button1_callback(state):
    """ """

    BLINKER_LOG('get button state: ', state)

    button1.icon('icon_1')
    button1.color('#FFFFFF')
    button1.text('Your button name or describe')
    button1.print(state)
```
注册回调函数
```python
button1.attach(button1_callback)
```
当app中组件触发并发送到设备端时将触发该组件注册的回调函数  

**使用方法：**
```python
Slider1 = BlinkerSlider("Slider_1")  //绑定滑动条  
RGB1 = BlinkerRGB("RGB_1")           //绑定取色器  
NUM1 = BlinkerNumber("NUM_1")        //绑定数字组件  
Text1 = BlinkerText("TEXTE_1")       //绑定文字组件  
```

## 开启调试信息
```python
BLINKER_DEBUG.debug()
``` 

## Blinker运行时  
```python
if __name__ == '__main__':

    while True:
        Blinker.run()

```
Blinker.run()语句负责处理Blinker收到的数据，每次运行都会将设备收到的数据进行一次解析。  
在使用WiFi接入时，该语句也负责保持网络连接  


## 组件操作
```
def button1_callback(state):
    """ """

    BLINKER_LOG('get button state: ', state)

    button1.icon('icon_1')
    button1.color('#FFFFFF')
    button1.text('Your button name or describe')
    button1.print(state)
```
触发该组件注册的回调函数时将返回该组件对应的状态值  
其他组件操作可见 [Python支持](?file=003-硬件开发/03-Python支持)  


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
def data_callback(data):
    global counter
    
    BLINKER_LOG("Blinker readString: ", data)
    counter += 1
    number1.print(counter)
```
可以检测是否收到未解析的数据  
如果app发送的数据，不是绑定过的组件数据，blinker将不会解析这些数据  
此时你可以回调函数获取这些未解析的数据。
### 注册该回调函数
```
Blinker.attachData(data_callback)
```

### 发送数据
```
Blinker.print(BlinkerTime)
Blinker.print("millis", BlinkerTime)
```
使用print可以向app发送数据，其形式有二：
```
Blinker.print(value)
```
当只有一个参数时,发送的是一个内容为value的纯字符串  
```
Blinker.print(key, value)
```
但有两个参数时，发送的是一个json数据，如{"millis":1000}  
如果数据键名对应app上的文本组件、开关组件、滑块组件，app收到数据后，会找到对应的键名的组件，并将值传递给组件，组件会以自己的方式呈现出这个数据  

#### 特定指令
```
Blinker.vibrate()
```
blinker app能接收一些特定指令，但设备端调用api发送特定指令后，app会执行相应操作。  
如使用Blinker.vibrate()即会让手机震动。  
