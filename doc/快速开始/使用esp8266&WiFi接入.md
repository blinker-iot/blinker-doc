# 1.准备工作
### 硬件准备  
WiFiduino 或 esp8266开发板  
可淘宝搜索 WiFiduino 自行购买  
### 软件准备  
**Arduino IDE需安装好esp8266扩展**  
安装方法可见：https://www.arduino.cn/thread-75969-1-1.html  

**下载并安装blinker APP**  
android下载链接：https://github.com/blinker-iot/app-release
ios版审核中，很快上线，敬请期待  
  
  
# 2.下载blinker Arduino库，并上传例程  
[点击下载](https://github.com/blinker-iot/blinker-library/archive/master.zip)
  
将下载好的blinker库解压到 **我的电脑>文档>Arduino>libraries** 文件夹中  
打开Arduino IDE，通过 **文件>示例>Blinker>Blinker_Button>Button_WiFi** 打开例程Button_WiFi  
再程序中找到保存WiFi名称和密码的变量，填入你要连接的WiFi名和密码，如：  
```
char ssid[] = "abcdefg"; //你的WiFi热点名称
char pswd[] = "123456789"; //你的WiFi密码
```
编译并下载程序到WiFiduino，打开串口调试器  
如果看到输出“Connected”和IP地址，说明WiFiduino已成功连接到WiFi  
  
  
# 3.在app中添加设备，并布局界面  
添加设备  

布局界面  

在app上，解锁布局后，点击按键，即可看到生成的键值  




现在点击app中的按键，即可控制WiFIduino上的LED灯开关了  