import Whisper from "../src";

const app = new Whisper();

app.listen(3456, () => console.log(`app started at 3456`));

const logMiddleware = async (ctx, next) => {
  // step 1: log start
  const startedAt = Date.now();

  await next();

  // step 4: log end
  const endAt = Date.now();
  console.log(ctx.data);
  console.log(`req: ${ctx.req}`);
  console.log(`res: ${ctx.res}`);
  console.log(`session ${ctx.session.id}: seq ${ctx.no} success ${endAt - startedAt} ms`);
};

const dataMiddleware = async (ctx, next) => {
  // step 2: handle request
  ctx.req = ctx.data.toString("utf8", 0, 2);

  await next();

  // step 3: send data
  ctx.res = `haha ${ctx.req}`;
  ctx.send(ctx.res);
};

app.use(logMiddleware);
app.use(dataMiddleware);

app.on("close", session => {
  console.log(`session ${session.id}: closed`);
});

app.on("timeout", session => {
  console.log(`session ${session.id}: timeout`);
});

app.on("end", session => {
  console.log(`session ${session.id}: end`);
});

app.on("error", session => {
  console.log(`session ${session.id}: error`);
});

/**
 * test data
 */
// request
// 23 23 02 FE 45 52 52 30 38 30 33 30 30 30
// response
// haha ##
