import Whisper from "../src";

const app = new Whisper();

app.listen(3456, () => console.log("started!"));

app.use(async (ctx, next) => {
  await next();
  ctx.body = "haha";
});
