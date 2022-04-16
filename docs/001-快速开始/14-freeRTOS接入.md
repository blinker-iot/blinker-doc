# freeRTOS接入  

## 支持芯片
SDK已支持esp8266、esp32，其他芯片可基于本SDK适配  

## Github 
[GITHUB](https://github.com/blinker-iot/blinker-freertos)  

## ESP-IDF环境安装  
[乐鑫官网](https://idf.espressif.com/zh-cn/index.html)  

## 示例  
Hello blinker示例：
```c++
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "Blinker.h"

static const char *TAG = "blinker";

char auth[] = "Your Device Secret Key";
char ssid[] = "Your WiFi network SSID or name";
char pswd[] = "Your WiFi network WPA password or WEP key";

BlinkerButton button1 = {.name = "btn-abc"};
BlinkerNumber number1 = {.name = "num-abc"};

int counter = 0;

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

void data_callback(const cJSON *data)
{
    BLINKER_LOG(TAG, "get json data");

    counter++;

    char count[10];
    sprintf(count, "%d", counter);

    blinker_number_config_t config = {
        .value = count,
    };

    blinker_number_print(&number1, &config);
}

void app_main()
{
    BLINKER_DEBUG_ALL();
    blinker_config_t init_conf = {
        .type = BLINKER_WIFI,
        .wifi = BLINKER_DEFAULT_CONFIG,
    };
    blinker_init(&init_conf);
    blinker_button_init(&button1, button1_callback);
    blinker_attach_data(data_callback);

    Blinker.begin(auth, ssid, pswd);
}
```

## 更多
可见[freeRTOS支持](https://diandeng.tech/doc/freertos-support)