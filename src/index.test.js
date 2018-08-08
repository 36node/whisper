import Whisper from "./index";

describe("app", () => {
  test("should set development env when NODE_ENV missing", () => {
    const NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = "";
    const app = new Whisper();
    process.env.NODE_ENV = NODE_ENV;
    expect(app.env).toEqual("development");
  });
});
