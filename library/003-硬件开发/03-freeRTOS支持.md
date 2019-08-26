# blinker freeRTOS支持库
针对ESP8266/ESP32设备的blinker库，需配合ESP-IDF使用。  
github：https://github.com/blinker-iot/blinker-freertos  

## 支持的硬件
* 使用 [ESP8266_RTOS_SDK](https://github.com/espressif/ESP8266_RTOS_SDK) 的ESP8266  
* 使用 [esp-idf](https://github.com/espressif/esp-idf) 的ESP8266  

## 注意事项
* SSL 使用的 wolfssl  
* MQTT 使用的 esp-mqtt  

## 支持的接入方式
* WiFi  

## 准备工作
使用前你需要做好如下准备：
* 安装 [ESP8266_RTOS_SDK](https://github.com/espressif/ESP8266_RTOS_SDK) 或者 [esp-idf](https://github.com/espressif/esp-idf) 的ESP-IDF  
* 下载 [blinker-freertos](https://github.com/blinker-iot/blinker-freertos) 将 **blinker** 文件夹放入上一步安装的 ESP-IDF 安装目录下 **conponent** 文件夹中即可  

## Blinker接口函数
### 设备配置
使用 **Blinker.begin()** 来配置Blinker: 
```cpp
Blinker.begin(...);
```
根据你使用的连接方式选择不同的参数用于配置Blinker  

WiFi:
```cpp  
#include <Blinker.h>  
  
void setup() {  
    blinker_config_t init_conf = {
        .type = BLINKER_WIFI,
        .wifi = BLINKER_DEFAULT_CONFIG,
    };
    blinker_init(&init_conf);

    Blinker.begin(auth, ssid, pswd);  
}
```  

**begin()** 主要完成以下配置:  
1.初始化硬件设置;  
2.连接网络并广播设备信息等待app连接;  
