# Project Little Daemon Riri

这里是梨梨项目的设计文档，
用来描述项目的目标、计划，当前正在设计的代码结构和 API。

## 关于项目

小恶魔梨梨是一个虚拟机器人项目。主要是虚拟聊天，目前支持和计划支持的平台有 Telegram，QQ 和 Web。

项目的目标是实现一个机器人（梨梨），能够模仿特定人类（梨子）在社交网络上的存在，同时不被其他人类察觉。
例如，我们试图实现或期望梨梨可以运行在如下形态：

+ 作为助理机器人，在梨子不在的时候帮助梨子应答聊天，总结群聊摘要，并通知梨子
+ 和梨子兼容运行，以梨子的口吻帮助梨子回复某些消息（对外不显示其存在）
+ 完全取代梨子，使梨子能够随心所欲地从社交网络中断开（而不被外界察觉）

这个是从 2018 年 5 月开始挖的坑。

这个项目应该不会轻易地死掉（例如不再有需求了或者已经有别人实现好了）。
但是要实现其目标大概要花费很久。

## 项目成果

### [小恶魔机器人网关](https://projectriri.github.io/bot-gateway) 
  
  [![Status](https://img.shields.io/badge/status-beta-green.svg)](https://projectriri.github.io/bot-gateway)
  [![GitHub last commit](https://img.shields.io/github/last-commit/projectriri/bot-gateway.svg)](https://github.com/projectriri/bot-gateway)  
  用于服务多种 Bot 平台的统一 API 网关，已经在公测了喵！  
  使用 Go 编写，支持直接 Go 的插件或通过协议使用。  
  详见链接中的文档。

### [春歌服务程序](https://github.com/projectriri/haruka)
  
  [![Status](https://img.shields.io/badge/status-next%20stage%20in%20design-%233ed2ff.svg)](https://github.com/projectriri/haruka)
  [![GitHub last commit](https://img.shields.io/github/last-commit/projectriri/haruka.svg)](https://github.com/projectriri/haruka)  
  静态资源服务程序。用来接收指令直接发送图片、语音、模板语句等资源。  
  现在可以发表情和一言网的句子。  
  当前仅使用文件驱动。  
  推荐结合 [filebrowser](https://github.com/filebrowser/filebrowser) 一起食用。filebrowser 提供的超棒的界面可以让世界人民方便地给梨梨添加表情包！

  未来打算结合一些 LoveLive! SIF 中的语音和歌曲来用。有关细节仍在设计中。

### [春风 MP3 裁剪工具](https://github.com/projectriri/harukaze)

  [![Status](https://img.shields.io/badge/status-in%20design-ff69b4.svg)](https://github.com/projectriri/harukaze)
  [![GitHub last commit](https://img.shields.io/github/last-commit/projectriri/harukaze.svg)](https://github.com/projectriri/harukaze)  
  这个工具虽然计划了很久，但是到现在还没有真正开始写。  
  春风是用来裁剪春歌的。期望可以通过导入 LRC 歌词来把歌曲裁剪成一句一句的，这样就可以在消息中发了。  
  需要一个好用的前端来支持导入后微调。裁剪可以用 ffmepg。
  
### [调试用绒布球](https://github.com/projectriri/rbq)

  [![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)](https://github.com/projectriri/rbq)
  [![GitHub last commit](https://img.shields.io/github/last-commit/projectriri/rbq.svg)](https://github.com/projectriri/rbq)  
  纯调试用绒布球。但是熟知它的人类总是用它做一些奇怪的事情。  
  提供强大的调试功能，包括强制消息转发，隐式命令调用等。
  
### [复读姬](https://github.com/projectriri/repeatress)

  [![Status](https://img.shields.io/badge/staus-in%20active%20dev-%23ffae52.svg)](https://github.com/projectriri/repeatress)
  [![GitHub last commit](https://img.shields.io/github/last-commit/projectriri/repeatress.svg)](https://github.com/projectriri/repeatress)  
  写 Bot 的人在不知道写什么的时候总是想做一个复读姬。  
  但是这个复读姬不一样。这个复读姬的目的不是复读，而是像人类一样复读。  
  使用 Python 编写，后端使用 [Firestore](https://firebase.google.com/docs/firestore/)（是一个类似 MongoDB 的文档数据库）。
  
### [星野服务程序](#)

  [![Status](https://img.shields.io/badge/status-in%20design-ff69b4.svg)](#)  
  星野服务程序是梨梨的主进程。用于决定梨梨应当在什么时间，什么聊天中发言。  
  完全没有想好该怎么写。
  
## 设计稿

这里是一些设计稿。  
设计稿仅仅是设计的时候的稿件。  
标注 `Closed` 表示该 Proposal 已经实现，并且实现的细节可能与设计稿有出入。
此稿件已归档，请参阅正式文档。

### [小恶魔网关 v2](/Gateway)

  [![Project](https://img.shields.io/badge/project-Bot--Gateway-%23c0c15b.svg)](#小恶魔机器人网关)
  [![Status](https://img.shields.io/badge/status-closed-%236f42c1.svg)](#)

### [Bot-Gateway Prototype](/Bot-Gateway)

  [![Project](https://img.shields.io/badge/project-Bot--Gateway-%23c0c15b.svg)](#小恶魔机器人网关)
  [![Status](https://img.shields.io/badge/status-closed-%236f42c1.svg)](#)

### [梨梨.2](/Riri-2)

  [![Project](https://img.shields.io/badge/project-haruka-%23c0c15b.svg)](#春歌服务程序)
  [![Project](https://img.shields.io/badge/project-hoshino-%23c0c15b.svg)](#星野服务程序)
  [![Status](https://img.shields.io/badge/status-partly%20closed-yellow.svg)](#)

## 加入贡献

1. 直接 [编辑](https://github.com/projectriri/projectriri.github.io/new/master) 本文档或发起 [Issue](https://github.com/projectriri/projectriri.github.io/issues/new) 来讨论。
2. 编写代码。
3. 调戏梨梨。
4. 贡献你的计算资源。

## 关于本文档

本文档是 GitHub 仓库 [projectriri.github.io](https://github.com/projectriri/projectriri.github.io) 中的实时内容。  
网站由 [docute](https://github.com/leptosia/docute) 驱动。要修改本文档，只要修改仓库中的 Markdown 文件，无须编译，网站会实时更新。

欢迎 [Pull Request](https://github.com/projectriri/projectriri.github.io/compare)。

要在本地运行本文档，可以克隆后执行

```shell
yarn install
yarn start
```
