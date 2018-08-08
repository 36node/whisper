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

## API

### ctx.body

回复给 client 的数据

### ctx.data

收到 client 发送的数据

### ctx.bufferSize

`socket.bufferSize`

### ctx.bytesRead

`socket.bytesRead`

The amount of received bytes.

### ctx.bytesWritten

`socket.bytesWritten`

The amount of bytes sent.

### ctx.localAddress

`socket.localAddress`

The string representation of the local IP address the remote client is connecting on.
For example, in a server listening on '0.0.0.0', if a client connects on '192.168.1.1',
the value of socket.localAddress would be '192.168.1.1'.

### ctx.localPort

`socket.localPort`

The numeric representation of the local port. For example, 80 or 21.

### ctx.remoteAddress

`socket.remoteAddress`

The string representation of the remote IP address. For example, '74.125.127.100' or '2001:4860:a005::68'.
Value may be undefined if the socket is destroyed (for example, if the client disconnected).

### ctx.remoteFamily

`socket.remoteFamily`

The string representation of the remote IP family. 'IPv4' or 'IPv6'.

### ctx.remotePort

`socket.remotePort`

The numeric representation of the remote port. For example, 80 or 21.

### ctx.address()

- Returns: `<Object>`
- Returns the bound address, the address family name and port of the socket
  as reported by the operating system:
  `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`

### ctx.pause()

`socket.pause()`

Returns: <net.Socket> The socket itself.

Pauses the reading of data. That is, 'data' events will not be emitted. Useful to throttle back an upload.

### ctx.resume()

`socket.resume()`

Returns: <net.Socket> The socket itself.

Resumes reading after a call to socket.pause().

### ctx.setTimeout(timeout[, callback])

`socket.setTimeout(timeout[, callback])`

Returns: <net.Socket> The socket itself.

Sets the socket to timeout after timeout milliseconds of inactivity on the socket.
By default net.Socket do not have a timeout.

When an idle timeout is triggered the socket will receive a 'timeout' event but the connection will not be severed.
The user must manually call socket.end() or socket.destroy() to end the connection.

```js
socket.setTimeout(3000);
socket.on("timeout", () => {
  console.log("socket timeout");
  socket.end();
});
```

If timeout is 0, then the existing idle timeout is disabled.

The optional callback parameter will be added as a one-time listener for the 'timeout' event.

### ctx.write(data[, encoding][, callback])

`socket.write(data[, encoding][, callback])`

```js
data <string> | <Buffer> | <Uint8Array>
encoding <string> Only used when data is string. Default: utf8.
callback <Function>
Returns: <boolean>
```

Sends data on the socket. The second parameter specifies the encoding in the case of a string

it defaults to UTF8 encoding.

Returns true if the entire data was flushed successfully to the kernel buffer.
Returns false if all or part of the data was queued in user memory.
'drain' will be emitted when the buffer is again free.

The optional callback parameter will be executed when the data is finally written out -
this may not be immediately.

See Writable stream write() method for more information.

## Contributing

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Author

**whisper** © [36node](https://github.com/36node), Released under the [MIT](./LICENSE) License.

Authored and maintained by 36node with help from contributors ([list](https://github.com/36node/whisper/contributors)).

> [github.com/zzswang](https://github.com/zzswang) · GitHub [@36node](https://github.com/36node) · Twitter [@y](https://twitter.com/y)
