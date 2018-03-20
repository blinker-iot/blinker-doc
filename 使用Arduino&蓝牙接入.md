1.硬件准备
Arduino UNO + ble蓝牙串口模块
推荐以下蓝牙模块：
openjumper ble串口模块 （默认波特率9600）
HM10 / HM11 （默认波特率9600）
JDY08 / JDY10 （默认波特率115200）
JDY18/JDY09 （默认波特率9600）
AT09 （默认波特率9600）
可淘宝搜索自行购买

以上模块我们测试了兼容性，其他蓝牙串口模块暂不确定能否适配

将串口BLE模块的 TXD连接到UNO的2号引脚，RXD连接到UNO的3号引脚


2.下载并安装blinker
android版：
https://cdn.clz.me/blinker/blinker.apk

ios版：
app store搜索blinker

3.在app中添加设备，并布局界面
添加设备

布局界面


3.下载blinker Arduino库，并上传例程
方法1 github下载安装：
https://github.com/i3water/blinker-library
将下载好的blinker库解压到 我的电脑>文档>Arduino>libraries 文件夹中。

方法2 通过Arduino IDE库管理器安装
通过**文件菜单>示例>Blinker>Blinker_Button>Button_BLE**打开例程**Button_BLE**。
将程序开头的宏修改为之前APP中显示的**数据键名**，例如“btn-clz”,如图：
  》修改为》  





在app上，解锁布局后，点击按键，即可看到生成的键值~

编译并上传程序到Arduino UNO中。
现在点击app中的按键，即可控制Arduino上的LED灯开关了。