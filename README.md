# whisper

Inspired by koa.js, follow koa, great project.

TCP server framework, communicating in binary data.

[![NPM version](https://img.shields.io/npm/v/whisper.svg?style=flat)](https://npmjs.com/package/whisper)
[![NPM downloads](https://img.shields.io/npm/dm/whisper.svg?style=flat)](https://npmjs.com/package/whisper)
[![CircleCI](https://circleci.com/gh/36node/whisper/tree/master.svg?style=shield)](https://circleci.com/gh/36node/whisper/tree/master)
[![codecov](https://codecov.io/gh/36node/whisper/branch/master/graph/badge.svg)](https://codecov.io/gh/36node/whisper)
[![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/36node/donate)

## Install

```bash
yarn add whisper
```

## Usage

```js
import Whisper from "whisper";

const app = new Whisper();

app.listen(3456);

app.use(async (ctx, next) => {
  const buf = ctx.data;

  // handle request
  ctx.start = buf.toString("utf8", 0, 2);

  await next();

  // send data back to client
  // body could be string or buf
  // body also can be a stream, like file stream
  ctx.body = "haha";
});

app.use(async (ctx, next) => {
  await next();
  console.log(ctx.start);
});
```

逻辑在 中间件中写，通过 app.use 调用，整体采用和 KOA 一样的洋葱模型。

TODO: 补更多的 readme

## API

### Application 即 `Whisper`

#### Whisper()

构造函数，创建 Application

#### Whisper.listen(port)

启动 server，监听端口

#### Whisper.toJSON()

return json data

#### Whisper.use(fn)

使用中间件

其中 fn 即中间件

```js
fn = (ctx, next) => { ... }
```

#### Whisper.broadcast(data, filt)

群发消息

- data: string/buffer/json
- filt: function 过滤符合条件的 sessions

filt:

```js
fn = session => {
  return true;
};
```

### Context

#### ctx.data

origin data from socket buffer

#### ctx.no

当前通讯 在会话中的位置序号

#### ctx.socket

`net.Socket`

[参见 nodejs 文档](https://nodejs.org/api/net.html#net_class_net_socket)

#### ctx.session

`Session`

同一个 socket 的连续数据传输组成一个会话

#### ctx.app

`Application`

### Session

#### method Session.send(data)

发送数据到客户端

- data: string, buffer or json

如果 socket.writable === false, 那么数据将不会发送

#### method Session.close()

关闭会话

#### Session.id

session 的唯一编号

#### Session.createdAt

session 创建的时间

#### Session.closedAt

session 关闭的时间

#### Session.app

`Application`

同 ctx.app

#### Session.socket

`net.Socket`

同 ctx.socket

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Author

**whisper** © [36node](https://github.com/36node), Released under the [MIT](./LICENSE) License.

Authored and maintained by 36node with help from contributors ([list](https://github.com/36node/whisper/contributors)).

> [github.com/zzswang](https://github.com/zzswang) · GitHub [@36node](https://github.com/36node)
