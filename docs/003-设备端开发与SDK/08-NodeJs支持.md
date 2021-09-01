# JavaScript支持模块  

blinker JavaScript/TypeScript模块支持  
目前模块处于测试阶段，没有正式发布，暂时无法通过npm安装  
[Github](https://github.com/blinker-iot/blinker-js)  

## 支持情况  

树莓派(Raspberry Pi)、香蕉派等Linux设备、Windows、MacOS等  

## 环境/依赖安装  

最新nodejs LTS版本  

```shell
npm i -g ts-node
git clone https://github.com/blinker-iot/blinker-js.git
cd blinker-js
npm i
```

## 示例程序  

[基础示例程序](https://github.com/blinker-iot/blinker-js/blob/typescript/example/example.ts)  

```shell
ts-node .\example\example.ts
```

## 设备操作  

### 实例化设备  

```js
import { BlinkerDevice } from './blinker';
let device = new BlinkerDevice(authkey);
```

### 等待设备初始化完成  

```js
device.ready().then(() => {
    //初始化完成后进行的操作
})
```

### 心跳 反馈 

```js
device.heartbeat.subscribe(message => {
console.log('heartbeat:', message);
})
```

### 其他数据  

```javascript
device.dataRead.subscribe(message => {
    console.log('otherData:', message);
})
```

### 震动  

```js
device.vibrate();
```

### 开关  

```js
device.builtinSwitch.change.subscribe(message => {
    console.log('builtinSwitch:', message);
    device.builtinSwitch.setState("on/off").update();
})
```



## MQTT相关

用户可通过 BlinkerDevice.mqttClient 直接操作mqtt客户端，相关API见[mqtt.js Github](https://github.com/mqttjs/MQTT.js)

```javascript
let mqttClient = device.mqttClient 
```

### 发送消息

向指定设备发送数据

```javascript
let message = {"abc" : 123}
let toDevice = 'ABCDEFGHIJ' // 设备识别码
device.sendMessage(message, toDevice)
```



## 其他  

### 短信通知  
**该功能仅限专业版用户使用 10条/天/人, 20字/条，1次/分钟，只能向注册手机号发送短信通知**  

```js
device.sendSms('text')
```

### 微信通知  

```js
device.wechat('text')
```

### App通知  

```js
device.push('text')
```

## Layouter组件操作  

使用前请先引入相关组件  

```js
import { 
    ButtonWidget, 
    TextWidget, 
    RangeWidget, 
    NumberWidget, 
    RGBWidget, 
    JoystickWidget 
} from './widget';
```

实例化并注册组件，构造函数参数为App中设置的key，如：  

```js
let button: ButtonWidget = device.addWidget(new ButtonWidget('btn-xxx'));
let text: TextWidget = device.addWidget(new TextWidget('tex-xxx'));
let range: RangeWidget = device.addWidget(new RangeWidget('ran-xxx'));
let number: NumberWidget = device.addWidget(new NumberWidget('num-xxx'));
let colorPicker: RGBWidget = device.addWidget(new RGBWidget('col-xxx'));
let joystick: JoystickWidget = device.addWidget(new JoystickWidget('joy-xxx'));
let image: ImageWidget = device.addWidget(new ImageWidget('img-xxx'));
```

### 文本组件  

```js
text.text('要显示的文本内容').text1('要显示的文本内容').icon('fad fa-sun').color('#FFFFFF').update();
```

### 数字组件  

```js
number.value(123).unit('单位').text('文字说明').color('#FFFFFF').update();
```

### 按键组件  

动作监听  

```js  
button.listen().subscribe(message => {
    console.log('button1:', message.data);
})
```

状态改变  

```js  
button.turn('on/off').color('#FFFFFF').icon('fad fa-sun').text('文字说明').update();
```

### 滑动条组件  

动作监听  

```js  
range.listen().subscribe(message => {
    console.log('range:', message.data);
})
```

状态改变

```js  
range1.value(123).max(300).color('#FFFFFF').text('文字说明').update();
```

### 颜色选择组件  

动作监听  

```js
colorPicker.listen().subscribe(message => {
    console.log('color:', message.data);
    console.log('red:', message.data[0]);
    console.log('green:', message.data[1]);
    console.log('blue:', message.data[2]);
    console.log('brightness:', message.data[3]);
})
```

状态改变

```js  
colorPicker.color(randomColor()).brightness(randomNumber(0, 255)).update()
```

### 摇杆组件  

动作监听  

```js
joystick1.listen().subscribe(message => {
    console.log('joystick:', message.data);
    console.log('x:', message.data[0]);
    console.log('y:', message.data[1]);
})
```

### 图片组件  

切换图片  

```js
image.show(1).update()
```

## 数据存储  

### 时序数据存储  

```js
device.saveTsData({
    humi: randomNumber(),
    temp: randomNumber(),
    pm25: randomNumber(),
    pm10: randomNumber()
});
```

时序数据存储有如下限制：  
    1.采集频率最高为5秒1次，上传最高频率为1分钟1次  
    2.每次上传数据不得超过5kb  
达到以上限制，则会存储失败，并被broker自动断开  

#### 时序数据获取  

待提供  

### 对象存储  

```js
device.saveObjectData({
    key1: 123,
    key2: 'abc'
});
```

免费版、专业版对象数据存储有如下限制：  
    1.上传最高频率为1分钟1次  
    2.每次上传数据不得超过5kb  
达到以上限制，则会存储失败，并被broker自动断开  

#### 对象数据获取  

```js
device.loadObjectData('key');
```

### 文本存储  

```js
device.saveTextData('text');
```

对象数据存储有如下限制：  
    1.上传最高频率为1分钟1次  
    2.每次上传数据不得超过1kb  
达到以上限制，则会存储失败，并被broker自动断开  

#### 文本数据获取  

```js
device.loadTextData();
```

## 气象数据  

气象数据接口，默认使用IP定位返回当前位置的气象数据，也可以通过参数cityCode（[国家行政区编码](http://preview.www.mca.gov.cn/article/sj/xzqh/2020/2020/202101041104.html)）来获取指定位置的数据。  
更多说明可见[气象数据接口](https://diandeng.tech/doc/weather-and-air)  

通过ip定位获取：  

```js
let air = await device.getAir()
let weather = await device.getWeather()
let weatherForecast = await device.getWeatherForecast()
```

通过cityCode指定位置获取：  

```js
let air = await device.getAir()
let weather = await device.getWeather()
let weatherForecast = await device.getWeatherForecast()
```

## 语音助手接入  

[小度示例](https://github.com/blinker-iot/blinker-js/tree/typescript/example/dueros)  
[天猫精灵示例](https://github.com/blinker-iot/blinker-js/tree/typescript/example/aligenie)  
[小爱示例](https://github.com/blinker-iot/blinker-js/tree/typescript/example/miot)  

**注意事项：**开发过程中，如果改变了设备类型，需要在小度音箱App中解绑再重新绑定才能正常同步出设备。  
