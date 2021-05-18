# OTA&固件管理  
**专业版功能**  
**该功能仅支持esp8266、esp32**  
设备开发者可通过管理台测试并发布新固件，用以更新对应设备  

## 固件编译  

### 设备版本号
**请务必遵循[版本号命名规则](https://semver.org/lang/zh-CN/)**  
固件默认版本号为 0.1.0，如要编译新版本的固件，需要设置更高的版本号，如0.1.1。  
版本号设置方法如下：  
```c++
#define BLINKER_WIFI
#define BLINKER_OTA_VERSION_CODE "0.1.1"

#include <Blinker.h>
```  

### OTA状态获取
**BlinkerUpdater.onProgress()**  
获取 OTA 更新进度, 在更新下载固件过程中会不定时调用通过该函数注册的回调函数。  
如下代码可实现固件更新过程中闪烁LED：  
```cpp
uint32_t os_time = 0;

void setup() {
    BlinkerUpdater.onProgress(otaStatus);
}

void otaStatus(uint32_t load_size, uint32_t total_size) {
    if (millis() - os_time >= BLINKER_OTA_BLINK_TIME) {
        os_time = millis();
        digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    }
}
```
> 回调函数中不能有耗时操作！耗时操作将导致OTA失败！**  


### 设备配置  
以最新package版本为例    
设置ESP8266例:
```
开发板:"WiFiduino"
Flash Size:"4M (FS:2MB OTA:~1019KB)"
Debug port:"Disabled"
Debug Level:"无"
lwIp Variant:"v2 Lower Memory"
VTables:"Flash"
CPU Frequency:"80 MHz"
Upload Speed:"921600"
Erase Flash:"Only Sketch"
```
> 注: 建议 Flash Size 设置为 OTA:~1019KB的选项, 以免OTA空间不够  
>   
设置ESP32例:
```
开发板:"WiFiduino32"
Partition Scheme:"Minimal SPIFFS(Large APPS with OTA)"
FLASH Frequency:"80 MHz"
```
  
### 固件获取  
通过 **Arduino IDE菜单 > 项目 > 导出已编译的二进制文件** 即可导出固件，导出的固件在当前项目的项目文件夹中。  

## 固件上传  
1. 进入**管理台固件管理页面**，点击“固件列表”右侧的下拉框，选择要上传的固件的产品；  
2. 右上方点击**上传固件**按键，在弹出框中输入 版本号、说明信息，并选择固件文件，最后点击**上传固件**完成上传。  
 
> 固件版本号应为程序中设定的版本号，且大于当前设备中的版本，方可正常更新   
>  
  
## 固件测试  
固件测试功能，用于在固件正式发布前对部分设备进行测试。  
1. 在管理台选中要测试的固件，点击**测试固件**；  
2. 在弹出框中，指定测试设备的ID，并点击**测试**；  
2. 重启blinker App，进入设备固件更新页面，就可以看到固件更新信息了；  
4. 点击**立即更新**,设备即会开始固件更新；  

> 程序中的固件版本需要和上传时填入的版本一致；只有云端版本大于当前设备版本时，app才会提示更新设备。  
> 
  
## 固件发布  
固件测试通过后，可以点击**发布固件**，进行发布。固件发布后，该产品下的所有设备，都可以收到新的固件。  
