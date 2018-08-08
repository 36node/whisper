import shortid from "shortid";

/**
 * Session class.
 */

export default class Session {
  id;
  app;
  socket;

  constructor(app, socket) {
    if (!app) throw new Error("whisper session should attached to an app");
    if (!socket) throw new Error("whisper session should attached to a socket");

    this.id = shortid.generate();
    this.app = app;
    this.socket = socket;
    this._lastSeq = 0;
  }

  genSeq() {
    return this._lastSeq++;
  }
}
