import net from "net";

import Whisper from "./index";

describe("app", () => {
  test("should listen on timeout", done => {
    const app = new Whisper();
    const connect = app.callback();
    const s1 = new net.Socket();
    connect(s1);
    app.on("timeout", session => {
      expect(session).toBe(app.sessions[0]);
      done();
    });

    s1.emit("timeout");
  });

  test("should listen on error after timeout", done => {
    const app = new Whisper();
    const connect = app.callback();
    const s1 = new net.Socket();
    connect(s1);

    app.on("error", err => {
      expect(err.message).toBe("session timeout");
      done();
    });

    s1.emit("timeout");
  });

  test("should listen on close after error", done => {
    const app = new Whisper();
    const connect = app.callback();
    const s1 = new net.Socket();
    connect(s1);
    s1.connect("baidu.com:80");

    const s = app.sessions[0];
    app.on("close", session => {
      expect(session).toBe(s);
      expect(app.sessions).toHaveLength(0);
      s1.destroy();
      done();
    });

    s1.emit("error");
  });

  test("should manage session list", () => {
    const app = new Whisper();
    const connect = app.callback();
    const s1 = new net.Socket();
    const s2 = new net.Socket();
    connect(s1);
    connect(s2);

    expect(app.sessions).toHaveLength(2);
    s1.emit("close");
    expect(app.sessions).toHaveLength(1);
  });

  test("should have write session list", () => {
    const app = new Whisper();
    const connect = app.callback();
    const s1 = new net.Socket();
    const s2 = new net.Socket();
    connect(s1);
    connect(s2);

    expect(app.sessions).toHaveLength(2);
  });

  test("should set development env when NODE_ENV missing", () => {
    const NODE_ENV = process.env.NODE_ENV;
    process.env.NODE_ENV = "";
    const app = new Whisper();
    process.env.NODE_ENV = NODE_ENV;
    expect(app.env).toEqual("development");
  });

  test("should broad cast to all clients", () => {
    const app = new Whisper();
    const connect = app.callback();
    const s1 = new net.Socket();
    const s2 = new net.Socket();
    s1.write = jest.fn();
    s2.write = jest.fn();
    s1.writable = true;
    s2.writable = true;
    connect(s1);
    connect(s2);

    app.broadcast("some data");
    expect(s1.write).toBeCalledWith("some data");
    expect(s2.write).toBeCalledWith("some data");
  });
});
