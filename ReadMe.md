# MoveMate 久坐提醒

## 项目介绍

该 Chrome 扩展名为 "久坐提醒" 旨在帮助用户合理安排工作时间，定时提醒用户该休息、起身活动、伸展身体，避免长时间久坐带来的身体不适问题。

## 如何使用

### 安装

1. 下载代码或 Clone 项目到本地。
2. 在 Chrome 浏览器中打开 `chrome://extensions/`。
3. 打开开发者模式（Developer mode）。
4. 点击 "加载已解压的扩展程序（Load unpacked）"。
5. 选择项目文件夹并确认加载。

> 注意，如果通知没有生效且没有任何报错，参考以下解决办法
1. 在Chrome浏览器中访问地址：[chrome://flags](chrome://flags)
2. 搜索栏中搜索：`notifications`，找到`Enable system notifications`选项，将其选项值改为`Disabled`，重启浏览器，问题解决（如果**chrome >= 121**, 需要先enable `Temporarily unexpire M120 flags` 再重启）


### 设置提醒间隔时间

1. 安装完成后，点击扩展图标。
2. 在弹出的设置页面中，设置提醒间隔时间（单位：分钟）。
3. 点击 "设置" 按钮确认。

如下图所示：
![](https://qingwave.github.io/img/blog/movemate.png)

### 使用通知

- 在设定的提醒间隔时间过后，会收到 Chrome 通知，提醒用户休息或活动。

## 开发

### 文件作用介绍

- `manifest.json`: 插件清单文件，定义了插件的配置信息。
- `popup.html`: 扩展的弹出页面，用于用户设置提醒时间。
- `popup.js`: 弹出页面的 JavaScript 文件，处理用户交互和设置操作。
- `background.js`: 后台脚本，处理定时提醒功能和存储操作。

### 贡献与反馈

- 欢迎贡献代码，提交 Pull 请求。
- 如有问题或建议，请在 GitHub 上提交 Issue。

### 版本历史

#### v1.0
- 实现基本功能：设置提醒时间，接收通知。

### 许可证

Apache License 2.0
