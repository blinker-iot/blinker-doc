1.硬件准备
ESP32开发板


2.软件准备
Arduino IDE 中按 安装方法 安装 esp32-arduino
Android 手机中安装 Blinker APP
IOS版本待上线

3.下载blinker-library
下载blinker-library
打开Arduino IDE，在菜单栏中点击 项目>加载库>添加一个 .ZIP库
选择刚才下载的 blinker-library.zip 
IDE显示 "库已经加入，请检查”导入库“菜单" 表示添加库成功

4.下载示例代码
在 Arduino IDE 菜单栏中点击 文件>示例>Blinker>Blinker_Button>Button_BLE

打开 Button_BLE 示例后，在示例中配置开发板信息
工具>开发板  选择对应的ESP32开发板型号
工具>端口     选择对应的端口

完成开发板配置后点击上传，等待示例编译下载完成
下载完成后打开串口监视器显示如下，表示示例下载成功
  

5.添加设备


完成设备添加后，添加一个按键(Button)
将按键的数据键名，如图中btn-gnk修改为ButtonKey
修改完成后锁定界面，点击按键即可板载LED的亮灭
