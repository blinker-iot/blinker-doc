# OTA与固件管理  
允许开发者远程更新设备上的固件  
**该功能仅支持WiFi接入的专属设备使用**  
**该功能目前仅支持WiFi接入的专属设备使用**  

## 设备端与APP端  
blinker SDK和blinker App已集成OTA功能，几乎不用进行其他开发  

### 示例程序  
**暂时仅支持esp8266/esp32 Arduino lib**
[设备端示例](https://github.com/blinker-iot/blinker-library/blob/master/examples/Blinker_OTA/OTA_WiFi/OTA_WiFi.ino)  

### 版本号  
固件版本号以三段式命名，如1.1.1；每段最大为9，不可为两位数；当云端固件版本号高于设备版本时，App即会提示有新固件。  

默认 OTA 版本为 0.1.0，用户在编译 OTA 固件时可将固件设置为 0.1.1 或更高版本  

使用 **BLINKER_OTA_VERSION_CODE** 对固件版本号进行设置
```
#define BLINKER_OTA_VERSION_CODE "0.1.1"
```

### 更新固件  
在APP设备设置界面，点击固件更新，并确认，App即会向设备发送更新指令
```json
{"set":{"upgrade":true}}
```
设备收到指令即会开始更新  

### 注意事项  
但您还需要注意以下事项：  
1.固件大小应小于除开SPIFFS外的Flash空间的一半。  
2.设备更新过程中不能断电，否则会照成设备固件损坏。  

## 固件管理台  
### 固件上传  
通过**管理台>固件管理**可上传固件  

### 固件测试  
针对设备开发，blinker提供了固件测试功能  
可以向指定的设备推送固件更新，用以验证设备OTA功能和固件的可用性   

### 固件发布  
固件正式发布后，该设备类型下的所有设备都会收到更新  

### 其他  
在管理台中点击**下载固件**和**删除固件**可以执行下载和删除操作  

## OTA固件要求
> 由于 ESP-Arduino SDK 中 **EEPROM** 设置在 **SPIFFS** 分区后  
> 编译固件前务必将 **Flash Size** 选择为有 SPIFFS 分区的模式  
> OTA 更新信息储存在 EEPROM 中, 设备完成 OTA 重启后需要检测 EEPROM 后上报是否更新成功  
> 建议 Flash Size 设置为 4M (2M SPIFFS), 以免OTA空间不够  
最新版本的库可以不再设置SPIFFS  
设置示例:  
```
开发板:"WiFiduino"
Flash Size:"4M (3M SPIFFS)"
Debug port:"Disabled"
Debug Level:"无"
lwIp Variant:"v2 Lower Memory"
VTables:"Flash"
CPU Frequency:"80 MHz"
Upload Speed:"921600"
Erase Flash:"Only Sketch"
```

## OTA固件获取
**Arduino IDE** : 打开 文件->首选项  
在设置中的 **显示详细输出** 勾选 **编译**、**上传**  

设置完成后打开需要 OTA 的固件代码, 点击 **编译** , 等待编译完成  
在编译输出信息中找到如下信息:

> "C:\\Users\\blinker\\AppData\\Local\\Temp\\arduino_build_18986/OTA_MQTT.ino.bin" -bm dio -bf 40 -bz 4M -bs .text -bp 4096 -ec -eo  
> "C:\\Users\\blinker\\AppData\\Local\\Temp\\arduino_build_18986/OTA_MQTT.ino.elf" -bs .irom0.text -bs .text -bs .data -bs .rodata -bc -ec  

如上信息中 **C:\\Users\\blinker\\AppData\\Local\\Temp\\arduino_build_18986** 即为编译后固件所在文件夹路径  
**OTA_MQTT.ino.bin** 即为编译后固件  

## 设备端OTA状态获取
### BlinkerUpdater.onProgress()
获取 OTA 更新进度, 在更新下载固件过程中会不定时调用通过该函数注册的回调函数  
回调函数:
```cpp
void otaStatus(uint32_t load_size, uint32_t total_size)
{
    if (millis() - os_time >= BLINKER_OTA_BLINK_TIME)
    {
        os_time = millis();

        digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    }
}
```
> 回调中会返回已下载固件大小及固件总大小。  

注册回调函数:
```cpp
BlinkerUpdater.onProgress(ota);
```

**该回调中务必避免使用阻塞代码！阻塞代码将导致OTA失败！**  
