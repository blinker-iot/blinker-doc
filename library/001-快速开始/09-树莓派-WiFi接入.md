# Linux设备/树莓派/香蕉派 MQTT接入  
==自blinker App 2.1.1起，原WiFi接入和MQTT已经合并为新WiFi接入==  

使用WiFi接入，当设备和手机在同一个局域网中，为局域网通信  
其余情况，使用MQTT远程通信  

=待更新=  

## 准备工作
开始使用前你需要做好如下准备:  

**下载并安装blinker APP**  
android下载：[点击下载](https://github.com/blinker-iot/app-release/releases)  
IOS下载：app store中搜索“blinker”下载  

### 安装python3  
==树莓派和其他自带python3的设备，可跳过本步==  
[python3.x](https://www.python.org/downloads/)  

### 安装相关依赖：
* Install the [blinker-py](https://github.com/blinker-iot/blinker-py)  
`git clone https://github.com/blinker-iot/blinker-py`  
`cd blinker-py`  
`sudo python3 setup.py install`  
`sudo pip3 install -r requirements.txt`  

## 在app中添加设备，获取Secret Key  
1. 进入App，点击右上角的“+”号，然后选择 **添加设备**    
2. 点击选择==Arduino== > ==WiFi接入==  
3. 选择要接入的服务商  
4. 复制申请到的==Secret Key==  

## DIY界面  
1. 在设备列表页，点击设备图标，进入设备控制面板  
2. 首次进入设备控制面板，会弹出向导页
3. 在向导页点击 **载入示例**，即可载入示例组件 
   
## 运行示例程序

```python
from Blinker import Blinker, BlinkerButton, BlinkerNumber  
from Blinker.BlinkerDebug import *

auth = 'Your Device Secret Key' # 修改为获取到的Secret Key

BLINKER_DEBUG.debugAll()

Blinker.mode("BLINKER_WIFI")
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

[Python3模块](https://github.com/blinker-iot/blinker-py)  
[Python3接入示例](https://github.com/blinker-iot/blinker-py/tree/master/example)  
JavaScript模块  
JavaScript接入示例  

## blinker QQ群  
blinker用户交流群   **301438087**  （初学者自行交流）  
blinker技术支持群   **775818454**  （官方技术支持，仅限github已Star的用户加群）  