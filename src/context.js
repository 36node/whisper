import delegate from "delegates";

import Session from "./session";

export default class Context {
  app;
  data;
  session;
  socket;

  constructor(session, data) {
    if (!session instanceof Session)
      throw new TypeError("whisper context should attached to a session");
    if (!data) throw new Error("whisper context should have request data");

    this.seq = session.genSeq();
    this.data = data;
    this.session = session;
    this.app = session.app;
    this.socket = session.socket;
  }

  /**
   * Default error handling.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) return;

    if (!(err instanceof Error)) err = new Error(util.format("non-error thrown: %j", err));

    // delegate
    this.app.emit("error", err, this);
  }
}

/**
 * Socket delegation.
 */

delegate(Context.prototype, "socket")
  .getter("bufferSize")
  .getter("bytesRead")
  .getter("bytesWritten")
  .getter("localAddress")
  .getter("localPort")
  .getter("remoteAddress")
  .getter("remotePort")
  .method("address")
  .method("pause")
  .method("resume")
  .method("setTimeout")
  .method("write");
