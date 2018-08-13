# 小恶魔网关

可以认为“小恶魔梨梨”由“小恶魔”和“梨梨”两部分组成。“小恶魔”指代网关的部分，“梨梨”指核心服务程序。
在不产生歧义的时候，有时也用“小恶魔梨梨”来指代网关。
日后应当对命名加以讨论以使其容易理解和避免歧义。

## v1: ritorudemonriri

开发状态：稳定版（只接受 bugfix，不再增加新功能）

Feature：

+ √ 完全基于 Golang 实现
+ √ 支持 Telegram 和 QQ 两个平台，用户无须这两个平台的认证即可通过网关收发消息
+ √ 理论上对 Telegram Bot API 和 CoolQ Http API 的绝大部分主要功能都支持
+ √ 基于 Golang 的通用性抽象，用户在特定情境下（如：回复文本消息）不需要关心具体平台
+ √ 使用 jsonrpc 作为通信协议，SDK 中有封装好的使用方法和自动重连功能
+ √ 采用长轮询的消息服务，并可以队列缓存一定量的消息。

缺陷：

+ × 网关通信协议在平台 API 上层建立，用户必须使用 Golang 语言利用魔改的 SDK 中的包才能方便地使用
+ × 没有对聊天进行足够好的抽象，用户在很多情况下仍然需要关心消息发往哪个平台

## v2

开发状态：计划中

Feature：

+ √ 仍然使用 Golang 实现
+ √ 使用 gRPC 作为通信协议，设计通信文档
+ √ 在 gRPC 之外同时提供 HTTP Proxy
+ √ 抽象消息模型，建立自己的跨平台通用消息协议
+ √ 增加路由功能，BOT 可以选择 Accept 的消息类型，消息应答可以重新回到网关

### 消息路由

[![设计示意图](/GatewayDesign.jpg)](https://projectriri.github.io/GatewayDesign.pdf)

来自外界的消息

- -> From：Telegram，QQ
- -> To: （空）

回复给外界的消息

- <- From: [ProgramName] // Whatever
- <- To: Telegram，QQ

Bot 调用其他 Bot

- <- From: [ProgramName]
- <- To: [ProgramName]

Bot 被其他 Bot 调用

- -> From: [ProgramName]
- -> To: [ProgramName]

Bot 以伪装消息的形式触发其他 Bot

- <- From: Telegram，QQ
- <- To: [ProgramName]，（空）

### 与 v1 版相比

1. v1 相当于是只有图中 Mixed Proxy 这一条路径，这个方法因为它不是 HTTP，所以不能用已经有的 SDK。
而因为重新实现 SDK 是很繁琐的，所以唯一的办法就是 fork 一个 SDK，修改它的底层实现（把 HTTP 换成 RPC，以及涉及到加头的操作），很麻烦，而且不同语言都需要重新实现。
另一方面，消息中承载的内容又不统一，所以每次需要改两个 SDK，极其麻烦。
v2 版中不再推荐 Mixed Proxy，而是额外地提供了 HTTP Proxy 和 Abstract Proxy（这个抽象以前是以 Golang SDK 在 SDK 那一层来提供，现在改成直接上报和接收通用的格式）。其中前者可以直接利用现有的 SDK，而后者则不需要考虑不同平台。
这样在简化使用负担的同时，仍然能够很好地满足不同情景的使用需要。

2. 增加了路由功能，这样使得旗下的不同程序能够互相调用。

3. 改用了 gRPC，这个体验提升感觉比较有限，偷懒的话可以不做（但是能提高逼格）

4. [Commander](/Commander) 虽然理论上是独立的程序，但是实现的时候可以和网关编译在一起。
可以跟现在网关本身的 status 应答的部分结合在一起来完成。

### Services

+ Telegram
  - inbound: 从 Telegram 拉取长轮询消息
  - outbound: 通过 Telegram HTTP API 发送消息
+ QQ
  - inbound: 从 QQ WebHook 获得消息
  - outbound: 通过 QQ HTTP API 发送消息
+ Telegram HTTP
  - inbound: 通过 HTTP API 接受请求
  - outbound: 通过长轮询提供消息
+ QQ HTTP
  - inbound: 通过 HTTP API 接受请求
  - outbound: 通过长轮询提供消息
+ QQ WebSocket
  - inbound: 通过 WebSocket 接受请求
  - outbound: 通过 WebSocket 提供消息
+ RPC:
  - inbound: 通过 RPC 接受（原始/结构化）请求
  - outbound: 通过 RPC 提供（原始/结构化）消息

### 结构化消息

这是专门为了聊天而产生的消息

**发出的消息**

消息分为 语音/贴纸/图文

图文可以包括文字，emoji，at 和图片

消息可以回复（然而 QQ 的回复功能是残废的，贴纸/图文消息通过在内容开头添加 at 来回复，语音消息忽略回复）

问题：

1. Telegram 如何发送贴纸（源自文件）？QQ 的贴纸就是图片，然而 Telegram 的贴纸需要 Sticker ID。如何通过已有的图片文件直接发送贴纸？**Webp 格式可以么？**

2. Markdown 格式怎么处理？**一律不适用 Markdown 排版（即使是 Telegram）**

**收到的消息**

QQ 如何区分图片和 Sticker？

Telegram 如何下载 Sticker？

**暂时只支持文字，其他媒体用特殊文字如[图片]代替**
