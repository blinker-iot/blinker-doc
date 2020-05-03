# MicroPython设备接入  
MicroPython解释器需要消耗大量的资源，因此在esp8266上无法很好的使用，目前blinker仅提供ESP32 MicroPython支持模块  

## 准备工作
### 硬件准备  
ESP32开发板  
[点击查看blinker设备端支持](?file=003-硬件开发/01-设备端支持 "设备端支持")  
### 软件准备  
预先为ESP32开发板烧录[MicroPython固件](https://micropython.org/download#esp32)
 
#### 下载并安装blinker模块 
[点击下载](https://github.com/blinker-iot/blinker-mpy/archive/master.zip)

## 在app中添加设备，获取Secret Key  
1. 进入App，点击右上角的“+”号，然后选择 **添加设备**    
2. 点击选择**Arduino > WiFi接入**  
3. 选择要接入的服务商  
4. 复制申请到的**Secret Key**  

  
## 上传示例程序 
[示例程序](https://github.com/blinker-iot/blinker-mpy/blob/master/example/Blinker_Hello/Hello_WiFi/Hello_WiFi.py)  
修改其中的基本参数  
```python
auth = 'Your Device Secret Key'
ssid = 'Your WiFi network SSID or name'
pswd = 'Your WiFi network WPA password or WEP key'
```
然后上传程序即可。

## 恭喜！一切就绪  
在APP中点击刚才你添加的设备，即可进入控制界面，点点按钮就可以控制Arduino上的LED灯开关  
另一个按钮也点下试试，放心，你的手机不会爆炸~  

## 进一步使用blinker
#### 想了解各接入方式的区别？  
看看[添加设备](?file=002-开发入门/001-添加设备 "添加设备")  
#### 更多参考？  
看看[microPython支持](?file=003-硬件开发/05-microPython支持 "microPython支持")  
#### 更多示例？
看看[microPython示例教程](https://github.com/blinker-iot/blinker-mpy/tree/master/example)  
#### 想制作与众不同的物联网设备？
看看[自定义界面](?file=005-App使用/02-自定义布局 "自定义布局")

## 完整示例程序
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

from machine import Pin

from Blinker.Blinker import Blinker, BlinkerButton, BlinkerNumber
from Blinker.BlinkerDebug import *

auth = 'Your Device Secret Key'
ssid = 'Your WiFi network SSID or name'
pswd = 'Your WiFi network WPA password or WEP key'

BLINKER_DEBUG.debugAll()

Blinker.mode('BLINKER_WIFI')
Blinker.begin(auth, ssid, pswd)

button1 = BlinkerButton('btn-abc')
number1 = BlinkerNumber('num-abc')

counter = 0
pinValue = 0

p2 = Pin(2, Pin.OUT)
p2.value(pinValue)

def button1_callback(state):
    ''' '''

    BLINKER_LOG('get button state: ', state)

    button1.icon('icon_1')
    button1.color('#FFFFFF')
    button1.text('Your button name or describe')
    button1.print(state)

    global pinValue
    
    pinValue = 1 - pinValue
    p2.value(pinValue)

def data_callback(data):
    global counter
    
    BLINKER_LOG('Blinker readString: ', data)
    counter += 1
    number1.print(counter)

button1.attach(button1_callback)
Blinker.attachData(data_callback)

if __name__ == '__main__':

    while True:
        Blinker.run()
```