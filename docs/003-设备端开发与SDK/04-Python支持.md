# Python支持模块

Blinker Python模块支持
[Github](https://github.com/blinker-iot/blinker-py)



## 环境/依赖安装

python版本仅支持 `3.7+`

模块暂时无法通过 `pip` 安装，可使用如下方式或别的python包安装方式

```shell
git clone https://github.com/blinker-iot/blinker-py.git
cd blinker-py
pip3 install --upgrade pip
pip3 install --upgrade .
```



## 示例程序

[示例程序](https://github.com/blinker-iot/blinker-py/tree/dev_3.0/example)



## 设备操作

### 实例化设备

```py
from blinker import Device
device = Device("authKey")
```



### 可用配置项

```python
from blinker import Device
device = Device(auth_key, protocol: str = "mqtt", websocket: bool = True, source_check: bool = False,
                 version: str = "1.0", ali_type: str = None, duer_type: str = None, mi_type: str = None,
                 heartbeat_func=None, realtime_func=None, ready_func=None, builtin_switch_func=None)
```

- `protocol`  指定设备连接协议，可选`mqtt/mqtts/ws/wss`
- `websocket` 开启后，会占用`81`端口，用于局域网中设备直接通信，如有安全性要求请关闭该功能
- `source_check` 开启后，会检查信息来源，设备只会处理所属用户发来的信息，如需设备间通信，请关闭该功能
- `version` 指定当前设备固件版本
- `ali_type` 指定在天猫精灵中模拟的设备类型
- `duer_type` 指定在小度中模拟的设备类型
- `mi_type` 指定在小爱中模拟的设备类型
- `heartbeat_func` 指定在APP与设备心跳反馈过程中执行的相关动作
- `realtime_func` 指定在收到实时数据请求时执行的相关动作
- `ready_func` 指定在设别连接上broker并加载完成配置后执行的相关动作
- `builtin_switch_func` 指定内置开关"switch"收到消息后执行的相关动作



### 设备初始化完成回调设置

可设置初始化完成回调函数，在设备连接broker并加载完配置后执行相关动作

```python
from blinker import Device

async def ready_func():
  # 初始化完成后进行的操作
  pass

# 方式一
device = Device("authKey", ready_func=ready_func)

# 方式二
device = Device("authKey")
device.ready_callback = ready_func

if __name__ == "main":
  device.run()
```

### 心跳反馈回调设置

```python
from blinker import Device

async def heartbeat_func(msg):
    print("Heartbeat received msg: {0}".format(msg))
    
device = Device("authKey", heartbeat_func=heartbeat_func)

if __name__ == '__main__':
    device.run()
  
```

### 其它数据

```python
from blinker import Device

async def ready_func():
    print(device.data_reader.get())

device = Device("authKey", ready_func=ready_func)

if __name__ == '__main__':
    device.run()
```

### 震动

```python
from blinker import Device

async def ready_func():
    device.vibrate()

device = Device("authKey", ready_func=ready_func)

if __name__ == '__main__':
    device.run()
```

### 开关

```python
from blinker import Device

async def builtin_switch_func(msg):
    print("builtinSwitch: {0}".format(msg))
    if msg["switch"] == "on":
        await (await device.builtinSwitch.set_state("on")).update()
    else:
        await (await device.builtinSwitch.set_state("off")).update()

device = Device("authKey", builtin_switch_func=builtin_switch_func)

if __name__ == '__main__':
    device.run()
```



## MQTT相关

### 向指定设备发送数据

```python
from blinker import Device

async def ready_func():
    msg = {"abc": 123}
    to_device = "设备名"
    await device.sendMessage(msg, to_device)

device = Device("authKey", protocol="mqtts", ready_func=ready_func)

if __name__ == '__main__':
    device.run()
```



## 其他

### 短信通知

> 往注册手机号发送短信通知，该功能仅限专业版用户使用 10条/天/人, 20字/条，1次/分钟，

```python
from blinker import Device

async def ready_func():
    await device.sendSms("test")

device = Device("authKey", protocol="mqtts", ready_func=ready_func)

if __name__ == '__main__':
    device.run()
```



### 微信通知

```python
from blinker import Device

async def ready_func():
    await device.wechat(title="消息测试", state="异常", text="设备1出现异常")

device = Device("authKey", protocol="mqtts", ready_func=ready_func)

if __name__ == '__main__':
    device.run()
```



## Layouter组建操作

### 组件引入并实例化

```python
from blinker import (
  	Device,
    ButtonWidget, 
    TextWidget, 
    RangeWidget, 
    NumberWidget, 
    RGBWidget, 
    JoystickWidget 
)

device = Deivce("authKey")

button: ButtonWidget = device.addWidget(ButtonWidget('btn-xxx'))
text: TextWidget = device.addWidget(TextWidget('tex-xxx'))
range1: RangeWidget = device.addWidget(RangeWidget('ran-xxx'))
number: NumberWidget = device.addWidget(NumberWidget('num-xxx'))
color_picker: RGBWidget = device.addWidget(RGBWidget('col-xxx'))
joystick: JoystickWidget = device.addWidget(JoystickWidget('joy-xxx'))
image: ImageWidget = device.addWidget(ImageWidget('img-xxx'))
```



### 文本组件

```python
await text.text('要显示的文本内容').text1('要显示的文本内容').icon('fad fa-sun').color('#FFFFFF').update();
```

### 数字组件

```python
await number.value(123).unit('单位').text('文字说明').color('#FFFFFF').update()
```

### 按键组件

#### 动作监听

```python
async def button_callback(msg):
  print("Button received: {0}".format(msg))
  
button.func = button_callback
```

#### 状态改变

```python
await button.turn('on/off').color('#FFFFFF').icon('fad fa-sun').text('文字说明').update()
```

### 滑动条组件

#### 动作监听

```python
async range_callback(msg):
  print("Range received: {0}".format(msg))

range1.func = range_callback
```

#### 状态改变

```python
await range1.value(123).max(300).color('#FFFFFF').text('文字说明').update();
```

### 颜色选择组件

#### 动作监听

```python
async color_picker_callback(msg):
  print('color: ', message.data)
  print('red:', message.data[0])
  print('green:', message.data[1])
  print('blue:', message.data[2])
  print('brightness:', message.data[3])

color_picker.func = color_picker_callback
```

#### 状态改变

```python
await colorPicker.color(randomColor()).brightness(randomNumber(0, 255)).update()
```

### 摇杆组件

#### 动作监听

```python
async joystick_callback(msg):
  print('joystick:', message.data)
  print('x:', message.data[0])
  print('y:', message.data[1])
```

### 图片组件

#### 切换图片

```python
await image.show(1).update()
```



## 存储

### 时序数据存储

```python
await device.saveTsData({
    "humi": randomNumber(),
    "temp": randomNumber(),
    "pm25": randomNumber(),
    "pm10": randomNumber()
})
```

### 对象存储

#### 存储

```python
await device.saveObjectData({"hello": "blinker"})
```

#### 获取

```python
TODO
```

### 文本存储

#### 存储

```python
await device.saveTextData("Helo, blinker")
```

#### 获取

```python
TODO
```

### 日志存储

#### 存储

```python
await device.saveLogData("This is log test")
```



## 气象数据  

气象数据接口，默认使用IP定位返回当前位置的气象数据，也可以通过参数cityCode（[国家行政区编码](http://preview.www.mca.gov.cn/article/sj/xzqh/2020/2020/202101041104.html)）来获取指定位置的数据。  
更多说明可见[气象数据接口](https://diandeng.tech/doc/weather-and-air)  

通过ip定位获取：  

```python
air = await device.getAir()
weather = await device.getWeather()
weatherForecast = await device.getWeatherForecast()
```

通过cityCode指定位置获取：  

```python
air = await device.getAir(510100)
weather = await device.getWeather(510100)
weatherForecast = await device.getWeatherForecast(510100)
```



## 语音助手接入  

[接入示例](https://github.com/blinker-iot/blinker-py/blob/dev_3.0/example/voice_assistant.py)

**注意事项：**开发过程中，如果改变了设备类型，需要在小度音箱App中解绑再重新绑定才能正常同步出设备。  



# 部署  

可使用[supervisor](http://supervisord.org/installing.html)来部署

