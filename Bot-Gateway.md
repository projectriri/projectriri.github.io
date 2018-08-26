## Basic Terminologies

### Plugin

A plugin is a go package that can be compiled into a *.so library, which can be loaded by the program without the need of rebuilding the program itself.

### Adaptor

An adaptor is a module (a go package, typically provided as a plugin) that exchanges data between the gateway and outside. Adaptors are also called protocol-adaptors, which means they adapt the interface of the gateway to external users, with various protocols.

### Producer

Producer is a role of adaptor. Producers produce messages and provide them to the gateway.

### Consumer

Consumer is a role of adaptor. Consumers take messages from the gateway and consume messages.

### Client

A client is an adaptor that acts as a client of others, from which it gets messages (producer client), to which it sends messages (consumer client). A client starts as soon as the gateway starts and starts working immediately.

### Server

A sever is an adaptor that act as a service provider, via which allows others to send messages (producer server)  or get messages (consumer server). A server starts as soon as the gateway starts but does not become working until a client connects to it.

Examples:

An adaptor connects _Telegram Bot API_ over long polling, gets messages from it and push them to the gateway: This is a Producer Client.

An adaptor takes messages from the gateway and send them to _Telegram Bot API_ via HTTP requests: This is a Consumer Client.

An adaptor connects _CoolQ HTTP API_ over websocket, via which it gets messages from the _API_ and push them to the gateway, take messages from the gateway and send them to the _API_: This is a Consumer-Producer Client.

An adaptor provides a websocket service. Users can connect to this adaptor just like they are connecting _CoolQ HTTP API_: This is a Consumer-Producer Server.

An adaptor provides an RPC service. Users can connect to this adaptor with RPC, send messages to the gateway and subscribe messages from the gateway: This is a Consumer-Producer Server.

### Converter

Converters are also called format-converters or API-converters. A converter converts specific format of message to another format, in order to meet the format requirements/preference of consumers. Messages may pass through serveral converters before reaching the consumer.

Examples:

Here comes a consumer names "Telegram", which accepts messages in format "Telegram-Bot-API" only. Here comes a message which is sent to "Telegram", however, it is in a "CoolQ-HTTP-API" format. Fortunately, we have a converter, it converts "CoolQ-HTTP-API" format to "Telegram-Bot-API" format, thanks to which the consumer "Telegram" will be able to accept this message.

In a more actual practice, as we planned, there will be a universal message format. Let's call it "UM-API" at this time. A bot that connects to the gateway, probably via an RPC adaptor, use the "UM-API" only. Messages from Telegram and QQ are converted to "UM-API" by, say "TBA-UM Converter" and "CHA-UM Converter", before sending to the Bot. And messages from the Bot will be convert back in the same way.

### Router

Router routes messages. The router is the core of the gateway, while converters and adapters are provided as plugins, in order to gradually support more and more messengers.

### Channel

A channel is the unit we use to count and identify different consumer connections. Typically, a client adaptor establishes only one channel, while a server adaptor might establishes multiple channels, depending on the connections connected to the server.

### Buffer

Buffer caches messages before they're used. All producers push messages into one union Producer Buffer. Each channel has a Consumer Buffer. Each time the router take a message from the Producer Buffer and put it into one or multiple Consumer Buffer.

## Routing

For each message, it has a schema like this:

```yaml
type: "object"
properties:
  head:
    type: "object"
    properties:
      from:
        type: "string"
      to:
        type: "string"
      level:
        type: "integer"
      format:
        type: "string"
      version:
        type: "string"
      protocol:
        type: "string"
  body:
    type: "bytes"
```

Producers should produce messages meeting this schema, for example:

```json
{
  head: {
    from: "QQ",
    to: "",
    level: -20,
    format: "CoolQ-HTTP-API",
    version: "4.4.1",
    protocol: "WebSocket"
  },
  body: "..."
}
```

For each channel, it has something that describes what kind of message it accept/prefer.

```yaml
type: "object"
properties:
  uuid:
    type: "string"
  accept:
    type: "array"
    items:
      type: "object"
      properties:
        from:
          type: "string"
        to:
          type: "string"
        level:
          type: "integer"
        formats:
          type: "array"
          items:
            type: "object"
            properties:
              format:
                type: "string"
              version:
                type: "string"
              protocol:
                type: "string"
```

This should be submitted to the router by the consummer at the time channel established, for example:

```json
{
  uuid: "dcc528ff-42eb-4e56-9df8-04edd4626519",
  accept: [
    {
      from: "Telegram",
      to: "*",
      level: 0,
      formats: [
        {
          format: "UM-API",
          version: "^1.0",
          protocol: "*"
        },
        {
          format: "Telegram-Bot-API",
          version: "latest",
          protocol: "WebHook"
        }
      ]
    },
    {
      from: "QQ",
      to: "*",
      level: 0,
      formats: [
        {
          format: "UM-API",
          version: "^1.0",
          protocol: "*"
        },
        {
          format: "CoolQ-HTTP-API",
          version: "^3",
          protocol: "*"
        }
      ]
    }
  ]
}
```

### UUID

A uuid helps identify the channel. If the connection between the gateway and the user temporarily broken, the user won't lose it's messages cached in the buffer if it reconnects with the same uuid in a short time.

### From/To

Note that there are no warranties for the validation of the "from" and "to" field. A producer can claim whoever it is in the "from" field of messages which produces. A consumer can expect messages to whomever in the "to" field.

### Level

A message can only flow to the channels with a minimum level bigger than the level of the message. For example, "Telegram" produces messages with a level -20, and consumes messages with a level 20. There are 3 bots: BotA consumes level 0, produces level 0; BotB consumes level 0, produces level 0; BotC consumes level 10, produces level 10. Then the message flow will be: Telegram -> { A, B } -> C -> Telegram.

### Formats

The format of messages will meet the formats as preferable (lower index in the formats array) as possible. If no format in the format array can be met, the message will be dropped.

For instance, let's say a consumer accepts messages in format [ 'UM-API', 'CoolQ-HTTP-API' ], and here is a message with format "CoolQ-HTTP-API". So the router will first check if there are any converter could convert "CoolQ-HTTP-API" to "UM-API". (In some situations, it might find a way using serveral converters. Say we want to convert "Telegram-Bot-API" to "CoolQ-HTTP-API", while there are no direct converters but both of them can convert with "UM-API".) After that it tries to convert. (Even if one converter claims, like, it converts messages from "CoolQ-HTTP-API" to "UM-API", it's likely not all messages formatted in "CoolQ-HTTP-API" could be possibly converted to "UM-API".) If fails, match the next choice. If all acceptable formats cannot be met, the message will eventually get dropped.

