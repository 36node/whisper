import Whisper from "../src";

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

/**
 * test data
 */
// 23 23 02 FE 45 52 52 30 38 30 33 30 30 30
