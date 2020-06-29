# JavaScript支持模块  
**模块重构中**  
面向linux设备提供JavaScript模块支持  
目前模块处于调试阶段，没有正式发布，暂时无法通过npm安装  
你可以通过以下地址下载：  
https://github.com/blinker-iot/blinker-js  


## 支持情况  
Linux开发板、树莓派(Raspberry Pi)、香蕉派

## 示例程序
https://github.com/blinker-iot/blinker-js/blob/typescript/example.ts  

## 设备操作  
### 实例化设备  
```js
import { BlinkerDevice } from './blinker';
let device = new BlinkerDevice(CONFIG.KEY);
```


## Layouter组件操作  
注册组件 
```js
import { ButtonWidget, TextWidget, RangeWidget, NumberWidget, RGBWidget, JoystickWidget } from './widget';

let button1: ButtonWidget = device.addWidget(new ButtonWidget('btn-crf'));
let button2: ButtonWidget = device.addWidget(new ButtonWidget('btn-b9g'));
let text1: TextWidget = device.addWidget(new TextWidget('tex-pnd'));
let range1: RangeWidget = device.addWidget(new RangeWidget('ran-i89'));
let number1: NumberWidget = device.addWidget(new NumberWidget('num-lnw'));
let colorPicker1: RGBWidget = device.addWidget(new RGBWidget('col-a9t'));
let joystick1: JoystickWidget = device.addWidget(new JoystickWidget('joy-d32'));
```

### 文本组件  

### 按键组件  

### 数字组件  

### 滑动条组件  

### 颜色选择组件  

### 摇杆组件  
