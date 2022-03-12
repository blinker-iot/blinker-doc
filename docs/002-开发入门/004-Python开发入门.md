# python开发入门  
本文档，适用于Linux开发板、树莓派(Raspberry Pi)、香蕉派等。  


## 接入示例  
这里以 WiFi接 入为例  
```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = "stao"

from blinker import Device, ButtonWidget, NumberWidget

device = Device("authKey")

button1 = device.add_widget(ButtonWidget('btn-123'))
button2 = device.add_widget(ButtonWidget('btn-abc'))
number1 = device.add_widget(NumberWidget('num-abc'))

num = 0


async def button1_callback(msg):
    global num

    num += 1

    await number1.text("num").value(num).update()


async def button2_callback(msg):
    print("Button2: {0}".format(msg))


async def heartbeat_func(msg):
    print("Heartbeat func received: {0}".format(msg))
    # 文本组件


async def ready_func():
    # 获取设备配置信息
    print(vars(device.config))


button1.func = button1_callback
button2.func = button2_callback

device.heartbeat_callable = heartbeat_func
device.ready_callable = ready_func

if __name__ == '__main__':
    device.run()

```

## blinker初始化/选择连接方式  
```python
device = Device("authKey")
```

## 新建组件对象/绑定组件  
```python
button1 = device.add_widget(ButtonWidget('btn-123'))
button2 = device.add_widget(ButtonWidget('btn-abc'))
number1 = device.add_widget(NumberWidget('num-abc'))
```
使用组件的键名创建对应的对象可以将设备与blinker app界面上的UI组件进行绑定。  
key为组件的键名，在app中切换到编辑模式可以看到；  
blinker库定义了多种组件类型，如 **BlinkerSlider BlinkerRGB BlinkerNumber BlinkerText**  

## 注册组件回调
### 回调函数
```python
async def button1_callback(msg):
    global num
    num += 1
    await number1.text("num").value(num).update()
```

### 注册回调函数
```python
button1.func = button1_callback
```
当app中组件触发并发送到设备端时将触发该组件注册的回调函数  


## 启动设备    
```python
if __name__ == '__main__':
    device.run()
```  

更多可见 [Python支持](https://diandeng.tech/doc/python-support)  