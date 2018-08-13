# 命令控制器

原来的梨梨在一些很多程序都响应的命令触发的时候会刷屏，如 ping，三个程序都会响应，一下回复 3 条消息。

新版梨梨独立出命令控制程序，将原来的 v1 梨梨核心程序拆分成命令控制器和春歌服务程序。

通过新版小恶魔网关，命令控制器和星野版梨梨可以调用春歌版梨梨。

以前：

```
ping -> {  
  ritorudemonriri: Pong!
  riri-naive: Pong!
  yt2nd: Pong!
}
```

以后：

```
ping -> commander -> "ping!" -> 
gateway -> {  
  ritorudemonriri: Pong!
  riri-naive: Pong!
  yt2nd: Pong!
} -> gateway -> commander -> {
  Pong!
  edited: Pong!, Pong!
  edited: Pong!, Pong!, Pong!
}
```

问题：QQ 不支持消息编辑。那么应该 QQ 这方面的体验就很难提升了。
除非等，但感觉像 ping 的话等着也不好。而且也不知道等多长时间合适，因为如果有的服务掉线了是不可知的。
