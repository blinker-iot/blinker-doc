# 1.准备工作
### 硬件准备  
WiFiduino32 或 esp32开发板  
可淘宝搜索 WiFiduino 自行购买  
### 软件准备  
**Arduino IDE需安装好esp32扩展**  
安装方法可见：https://github.com/espressif/arduino-esp32

**下载并安装blinker APP**  
android下载链接：https://github.com/blinker-iot/app-release
ios版审核中，很快上线，敬请期待  
  
# 2.下载blinker Arduino库，并上传例程  
[点击下载](https://github.com/blinker-iot/blinker-library/archive/master.zip)
  
将下载好的blinker库解压到 **我的电脑>文档>Arduino>libraries** 文件夹中  
打开Arduino IDE，通过 **文件>示例>Blinker>Blinker_Button>Button_WiFi** 打开例程Button_WiFi  
将程序开头的宏修改为之前APP中显示的数据键名，例如“btn-clz”  
再程序中找到保存WiFi名称和密码的变量，填入你要连接的WiFi名和密码，如：  
```
char ssid[] = "abcdefg"; //你的WiFi热点名称
char pswd[] = "123456789"; //你的WiFi密码
```
编译并下载程序到WiFiduino32，打开串口调试器。如果看到输出“Connected”和IP地址，说明WiFiduino已成功连接到WiFi  
  
  
## 3.在app中添加设备，并布局界面  
添加设备  

布局界面  

在app上，解锁布局后，点击按键，即可看到生成的键值  
 

# 3.在app中添加设备，并布局界面  


完成设备添加后，添加一个按键(Button)
将按键的数据键名，如图中btn-gnk修改为ButtonKey
修改完成后锁定界面，点击按键即可板载LED的亮灭