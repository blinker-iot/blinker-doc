# blinker freeRTOS支持库
针对ESP8266/ESP32设备的blinker库，需配合ESP-IDF使用。  
github：https://github.com/blinker-iot/blinker-esp-idf

## 支持的硬件
* 使用 [ESP8266_RTOS_SDK v3.4](https://github.com/espressif/ESP8266_RTOS_SDK/releases/tag/v3.4) 的ESP8266  
* 使用 [esp-idf v4.3](https://github.com/espressif/esp-idf/releases/v4.3) 的ESP32  

## 注意事项
* SSL 使用的 wolfssl  
* MQTT 使用的 esp-mqtt  

## 支持的接入方式
* WiFi  

## 准备工作
使用前您需要做好如下准备：
* 安装 [ESP8266_RTOS_SDK](https://github.com/espressif/ESP8266_RTOS_SDK) 或者 [esp-idf](https://github.com/espressif/esp-idf) 的ESP-IDF  
* 下载 [blinker-freertos](https://github.com/blinker-iot/blinker-esp-idf) 将 **blinker** 文件夹放入自己所需项目下的 **component** 文件夹中即可  

> 注：1. ESP32及ESP8266的components文件夹下分别有**blinker**及**esp_http_server**两个文件夹  
> 将**esp_http_server**剪切并到**sdk安装目录下的components内**并覆盖原来的esp_http_server文件  
> 如 C:\Espressif\frameworks\esp-idf-v4.3.4\components  
> 2. 新建项目后将**blinker**复制到项目的**components**目录下, 目录如下：  
> blinker_example  
> |__components  
> |  |__blinker  
> |__main  

按如上方法配置好使用环境后输入  
> idf.py menuconfig  

可进入idf配置页面 在菜单主页中可以看到blinker配置选项, 选中blinker进入并配置相关参数  
> set BLINKER DEVICE TYPE  
> set BLINKER AUTH KEY  
> set Provisioning Type  

依次设置设备类型、设备auth key、配网方式, 设置完成后保存并退出blinker配置页面
进入**components**配置页面  
> enable mDNS  
> disable Newlib  
> enable webSocket server support(http_server)  

依次设置如上三个component, 设置完成后保存并退出即可开始编译测试  



## Blinker接口函数
### 设备配置
使用 **blinker_init()** 来配置Blinker:  
> 主要参数配置在idf中配置  

WiFi:
```cpp  
#include <Blinker.h>  
  
void app_main() {
    blinker_init(); 
}
```  

#### blinker_init()
完成设备功能初始化函数  
**注：设备WIFI/PRO 接入类型及语音助手等设置在IDF中设置**  

### 数据管理
#### blinker_data_handler()
注册回调函数，当有设备收到APP发来的数据时会调用对应的回调函数  

回调函数：
```cpp
static void data_callback(const char *data)
{
    ESP_LOGI(TAG, "data: %s", data);
}
```
注册回调函数：
```cpp
blinker_data_handler(data_callback);
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

