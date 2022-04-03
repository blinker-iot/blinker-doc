# blinker freeRTOS支持库
针对ESP8266/ESP32设备的blinker库，需配合ESP-IDF使用。  
github：https://github.com/blinker-iot/blinker-freertos  

## 支持的硬件
* 使用 [ESP8266_RTOS_SDK](https://github.com/espressif/ESP8266_RTOS_SDK) 的ESP8266  
* 使用 [esp-idf](https://github.com/espressif/esp-idf) 的ESP32  

## 注意事项
* SSL 使用的 wolfssl  
* MQTT 使用的 esp-mqtt  

## 支持的接入方式
* WiFi  

## 准备工作
使用前您需要做好如下准备：
* 安装 [ESP8266_RTOS_SDK](https://github.com/espressif/ESP8266_RTOS_SDK) 或者 [esp-idf](https://github.com/espressif/esp-idf) 的ESP-IDF  
* 下载 [blinker-freertos](https://github.com/blinker-iot/blinker-freertos) 将 **blinker** 文件夹放入自己所需项目下的 **component** 文件夹中即可  

## Blinker接口函数
### 设备配置
使用 **Blinker.begin()** 来配置Blinker: 
```cpp
Blinker.begin(...);
```
根据您使用的连接方式选择不同的参数用于配置Blinker  

WiFi:
```cpp  
#include <Blinker.h>  
  
void setup() {
    blinker_init(); 
}
```  

**setup()** 主要完成以下配置:  
1.初始化硬件设置;  
2.连接网络并广播设备信息等待app连接;  

#### blinker_init()
完成设备功能初始化函数  
**注：设备WIFI/PRO 接入类型及语音助手等设置在IDF中设置**  
**make menuconfig->Compontent conifg->Blinker**

### 数据管理
#### blinker_attach_data()
注册回调函数，当有设备收到APP发来的数据时会调用对应的回调函数  

回调函数：
```cpp
void data_callback(const cJSON *data)
{
    BLINKER_LOG(TAG, "get json data");
}
```
注册回调函数：
```cpp
blinker_attach_data(data_callback);
```

### App组件
#### BlinkerButton
按键组件在App中可以设置 按键/开关/自定义 三种模式:  
- **按键** 模式下支持 点按/长按/释放(tap/press/pressup) 三个动作  
- **开关** 模式下支持 打开/关闭(on/off) 两个动作  
- **自定义** 模式下支持 自定义指令 发送  

初始化, 创建对象
```cpp
BlinkerButton button1 = {.name = "btn-abc"};
```
用于处理 **button** 收到数据的回调函数
```cpp
void button1_callback(const char *data)
{
    BLINKER_LOG(TAG, "get button data: %s", data);

    blinker_button_config_t config = {
        .icon = "fas fa-alicorn",
        .color = "0xFF",
        .text1 = "test",
    };

    blinker_button_print(&button1, &config);
}
```
注册回调函数
```cpp
blinker_button_init(&button1, button1_callback);
```
> 在回调函数中, **state** 的值为:  
> - **按键** : "tap"(点按); "press"(长按); "pressup"(释放)  
> - **开关** : "on"(打开); "off"(关闭)  
> - **自定义** : 用户设置的值  

**blinker_button_config_t**:
- state  
    *const char \*state*  
    设置按键的状态  
- icon  
    *const char \*icon*  
    设置按键中显示的图标(icon), [图标列表及对应图标名称见](https://fontawesome.com/v5/search)  
- color  
    *const char \*color*  
    设置按键中显示图标的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)  
- content  
    *const char \*content*  
    设置按键中显示图标的内容  
- text  
    *const char \*text1*  
    设置按键中显示的名字或者描述   
    *const char \*text1*  
    一段描述文字  
    *const char \*text1*  
    *const char \*text2*  
    两段描述文字  
- text_color  
    *const char \*text_color*  
    设置按键中显示文字的颜色, [HTML颜色表](http://www.w3school.com.cn/tags/html_ref_colornames.asp)  

