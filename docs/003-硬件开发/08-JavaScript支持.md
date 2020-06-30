# JavaScript支持模块  
面向linux设备提供JavaScript模块支持  
目前模块处于调试阶段，没有正式发布，暂时无法通过npm安装  
你可以通过以下地址下载：  
https://github.com/blinker-iot/blinker-js  


## 支持情况  
树莓派(Raspberry Pi)、香蕉派等Linux设备  

## 环境/依赖安装  
最新nodejs LTS版本  
```
npm i -g ts-node
npm i
```

## 示例程序
https://github.com/blinker-iot/blinker-js/blob/typescript/example.ts  

## 设备操作  
### 实例化设备  
```js
import { BlinkerDevice } from './blinker';
let device = new BlinkerDevice(CONFIG.KEY);
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
