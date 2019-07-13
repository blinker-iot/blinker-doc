# Arduino实例教程
本实例教程使用esp8266开发板进行  

[0.开发准备](https://www.arduino.cn/thread-83174-1-1.html)  
[1.控制开关灯](https://www.arduino.cn/thread-83177-1-1.html)  
[2.数据反馈](https://www.arduino.cn/thread-83176-1-1.html)  
[3.语音、定时与设备共享](https://www.arduino.cn/thread-83175-1-1.html)  
[4.智能音响控制](https://www.arduino.cn/thread-83756-1-1.html)  
[5.云端历史数据存储与查看](https://www.arduino.cn/thread-85699-1-1.html)  

### 其他
#### 图标库使用方法  
在图标库 (https://fontawesome.com) 中找到要使用的图标，点击进入该图标页面，可以看到其html调用形式，如
```html
<i class="far fa-lightbulb"></i>
```
其中class内容即是我们设备端程序需要的参数。  
arduino程序中调用方法如下：  
```c++
Button1.icon("far fa-lightbulb");
```

####开关LED(开关按键)，并改变APP UI:  

```c++
#define BLINKER_WIFI

#include <Blinker.h>

char auth[] = "Your Device Secret Key";
char ssid[] = "Your WiFi network SSID or name";
char pswd[] = "Your WiFi network WPA password or WEP key";

// 新建组件对象
BlinkerButton Button1("btn-abc");

int counter = 0;

// 按下按键即会执行该函数
void button1_callback(const String & state)
{
    BLINKER_LOG("get button state: ", state);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));

    if (state == BLINKER_CMD_BUTTON_TAP) {
        BLINKER_LOG("Button tap!");

        // Button1.icon("icon_1");
        Button1.color("#FF0000");
        Button1.text("Your button name or describe");
        Button1.print();
    }
    else if (state == BLINKER_CMD_BUTTON_PRESSED) {
        BLINKER_LOG("Button pressed!");

        // Button1.icon("icon_1");
        Button1.color("#FFFF00");
        Button1.text("Your button name or describe");
        Button1.print();
    }
    else if (state == BLINKER_CMD_BUTTON_RELEASED) {
        BLINKER_LOG("Button released!");

        // Button1.icon("icon_1");
        Button1.color("#FFFFFF");
        Button1.text("Your button name or describe");
        // Button1.text("Your button name", "describe");
        Button1.print();
    }
    else if (state == BLINKER_CMD_ON) {
        BLINKER_LOG("Toggle on!");

        // Button1.icon("icon_1");
        Button1.color("#0000FF");
        Button1.text("Your button name or describe");
        // Button1.text("Your button name", "describe");
        Button1.print("on");
    }
    else if (state == BLINKER_CMD_OFF) {
        BLINKER_LOG("Toggle off!");

        // Button1.icon("icon_1");
        Button1.color("#00FFFF");
        Button1.text("Your button name or describe");
        // Button1.text("Your button name", "describe");
        Button1.print("off");
    }
    else {
        BLINKER_LOG("Get user setting: ", state);

        // Button1.icon("icon_1");
        Button1.color("#FFFFFF");
        Button1.text("Your button name or describe");
        // Button1.text("Your button name", "describe");
        Button1.print();
    }
}

void setup()
{
    // 初始化串口
    Serial.begin(115200);
    BLINKER_DEBUG.stream(Serial);
    
    // 初始化有LED的IO
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, HIGH);
    // 初始化blinker
    Blinker.begin(auth, ssid, pswd);

    Button1.attach(button1_callback);
}

void loop() {
    Blinker.run();
}
```