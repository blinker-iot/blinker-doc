# JavaScript支持模块  
面向linux设备提供JavaScript/TypeScript模块支持  
目前模块处于调试阶段，没有正式发布，暂时无法通过npm安装  
您可以通过以下地址下载：  
https://github.com/blinker-iot/blinker-js  


## 支持情况  
树莓派(Raspberry Pi)、香蕉派等Linux设备、Windows、MAC OS等  

## 环境/依赖安装  
最新nodejs LTS版本  
```
npm i -g ts-node
git clone https://github.com/blinker-iot/blinker-js.git
cd blinker-js
npm i
```

## 示例程序
https://github.com/blinker-iot/blinker-js/blob/typescript/example/example.ts  
```
ts-node .\example\example.ts
```

## 设备操作  
### 实例化设备  
```js
import { BlinkerDevice } from './blinker';
let device = new BlinkerDevice(authkey);
```
### 心跳  
```js
device.heartbeat.subscribe(message => {
console.log('heartbeat:', message);
})
```

### 其他数据  
device.dataRead.subscribe(message => {
    console.log('otherData:', message);
})

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

## 其他  
### 短信通知  
**仅限专业版用户使用，限制为10条/天, 20字/条**  
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
