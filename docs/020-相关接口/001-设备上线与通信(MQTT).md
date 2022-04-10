# 设备上线与通信  
本文档适用于使用点灯自有Broker  
## 设备上线

### 获取连接信息  

**接口（独立设备）**  

``` 
GET https://iot.diandeng.tech/api/v1/user/device/diy/auth?authKey={authKey}
```

**Response**  

``` js
{
    message: 1000
    detail: {
        broker: 'blinker',
        deviceName: 'BDB1C0D8PS3Rxxxxxxxxxxxx',
        host:'mqtt://broker.diandeng.tech',
        port:'1883'
        iotId: 'xxxxxxxxJLSBnI13000xxx',
        iotToken: 'xxxxxxxxxx468856x4f15936243c64fd',
        uuid: '9140dxx9843bxxd6bc439exxxxxxxxxx'
    }
}
```

### 指定连接协议
```
GET https://iot.diandeng.tech/api/v1/user/device/diy/auth?authKey=<authKey>&protocol=<protocol>
```
添加参数protocol可指定连接协议，目前支持的协议有：mqtt、mqtts、ws、wss  


## 连接&&鉴权  
使用以上连接信息，即可连接MQTT Broker  

``` js
mqtt.connect('mqtts://broker.diandeng.tech:1883', {
    clientId: deviceName,
    username: iotId,
    password: iotToken
});
```

## 发布&&订阅  
**发布**  
设备向Topic发布信息后，broker会获取其中的toDevice信息，并将该信息转发到指定设备  
``` 
TOPIC /device/{deviceName}/s
```

``` json
{"toDevice":"xxxxxxxx","data":"abcdefg"}
```
toDevice：目标设备  
data：承载数据  

**订阅**  
broker转发来的数据，会以fromDevice注明消息的来源设备  
``` 
TOPIC /device/{deviceName}/r
```

``` json
{"fromDevice":"xxxxxxxx","data":"abcdefg"}
```

fromDevice：来源设备  
data：承载数据  

### 组
blinker Broker以组（Group）进行权限鉴别，在同一组内的设备可以相互通信  
例如：两个设备都是同一用户创建的，这两个设备将都在同一用户组中，因此可以相互通信。  
**向组发送数据**  
TOPIC /group/groupName/s  
```json
{"toGroup":"xxx","data":{"get":"state"}}
```

toDevice：目标设备  
data：承载数据  

**接收组发来的数据**
TOPIC /group/groupName/r  
```json
{"fromGroup":"xxx","data":{"get":"state"}}
```

fromDevice：来源设备  
data：承载数据  

## 限制机制  
1. 一个authkey只能一个设备使用，每次获取连接信息，都将重置iotToken  
2. 设备只能发布和订阅属于自身的topic，如果操作其他topic将被broker断开连接  
3. 设备消息发布频率最高每秒1次，否则将被broker断开连接  
4. 每条消息长度不能大于1024，否则将被broker断开连接  
5. 设备只能和所在组（Group）的其他设备通信  

## MQTT SDK
我们建议项目中使用以下推荐SDK：    

| C（Linux/windows/MacOS使用） | [Paho C SDK](https://github.com/eclipse/paho.mqtt.c)         |
| ---------------------------- | ------------------------------------------------------------ |
| C（MCU使用）                 | [Paho embedded-C SDK](https://github.com/eclipse/paho.mqtt.embedded-c) |
| Python                       | [Paho Python SDK](https://github.com/eclipse/paho.mqtt.python) |
| JavaScript                   | [mqtt.js](https://github.com/mqttjs/MQTT.js)                 |
| Java                         | [Paho Java SDK](https://github.com/eclipse/paho.mqtt.java)   |
| Golang                       | [Paho Golang SDK](https://github.com/eclipse/paho.mqtt.golang) |

