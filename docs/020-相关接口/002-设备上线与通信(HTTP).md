# 设备上线与通信  
**接口内测中，正式上线时间待定**  

本文档适用于使用点灯自有Broker  
## 设备上线

### 获取连接信息  

**接口（独立设备）**  

``` 
GET https://iot.diandeng.tech/api/v1/user/device/diy/auth?authKey=<authKey>&protocol=https
```
protocol参数也可以设为`http`

**Response**  

``` js
{
    message: 1000
    detail: {
        broker: 'blinker',
        deviceName: 'BDB1C0D8PS3Rxxxxxxxxxxxx',
        host:'https://broker.diandeng.tech',
        port:'1887'
        iotId: 'xxxxxxxxJLSBnI13000xxx',
        iotToken: 'xxxxxxxxxx468856x4f15936243c64fd',
        uuid: '9140dxx9843bxxd6bc439exxxxxxxxxx'
    }
}
```

## 发布 

设备向Topic发布信息后，broker会获取其中的toDevice信息，并将该信息转发到指定设备  
``` 
POST https://broker.diandeng.tech:1887/device/{deviceName}
```
数据样式：  
``` json
{"toDevice":"xxxxxxxx","data":"abcdefg"}
```
toDevice：目标设备  
data：承载数据  

## 获取  
broker转发来的数据，会以fromDevice注明消息的来源设备  
``` 
GET https://broker.diandeng.tech:1887/device/{deviceName}
```
数据样式：  
``` json
{"fromDevice":"xxxxxxxx","data":"abcdefg"}
```

fromDevice：来源设备  
data：承载数据  

### 组
blinker Broker以组（Group）进行权限鉴别，在同一组内的设备可以相互通信  
**向组发送数据**  
```
POST https://broker.diandeng.tech:1887/device/{deviceName}  
```
数据样式： 
```json
{"toGroup":"xxx","data":{"get":"state"}}
```

toDevice：目标设备  
data：承载数据  

**接收组发来的数据**
```
GET https://broker.diandeng.tech:1887/device/{deviceName}  
```
数据样式：
```json
{"fromGroup":"xxx","data":{"get":"state"}}
```

fromGroup：来源组 
data：承载数据  
