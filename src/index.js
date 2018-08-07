import Emitter from "events";
import net from "net";
import util from "util";
import Stream from "stream";

import compose from "koa-compose";
import Debugger from "debug";
import only from "only";

import Session from "./session";
import Context from "./context";

const debug = new Debugger("whisper");

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

export default class Application extends Emitter {
  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  constructor() {
    super();

    this.middleware = [];
    this.env = process.env.NODE_ENV || "development";

    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }

  /**
   * Shorthand for:
   *
   *    net.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  listen(...args) {
    debug("listen");
    const server = net.createServer(this.callback());
    return server.listen(...args);
  }

  /**
   * Return JSON representation.
   * We only bother showing settings.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {
    return only(this, ["env"]);
  }

  /**
   * Inspect implementation.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    return this.toJSON();
  }

  /**
   * Use the given middleware `fn`.
   *
   * Old-style middleware will be converted.
   *
   * @param {Function} fn
   * @return {Application} self
   * @api public
   */

  use(fn) {
    if (typeof fn !== "function") throw new TypeError("middleware must be a function!");
    debug("use %s", fn._name || fn.name || "-");
    this.middleware.push(fn);
    return this;
  }

  /**
   * Return a socket handler callback
   * for node's net server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount("error")) this.on("error", this.onerror);

    const handleConnect = socket => {
      // create session while new connection
      const session = new Session(this, socket);
      socket.on("data", data => {
        const ctx = new Context(session, data);
        this.handleRequest(ctx, fn);
      });
    };

    return handleConnect;
  }

  /**
   * Handle request in callback.
   *
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    debug("data comming with seq %s", ctx.seq);
    debug(ctx.data);

    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    return fnMiddleware(ctx)
      .then(handleResponse)
      .catch(onerror);
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format("non-error thrown: %j", err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, "  "));
    console.error();
  }
}

/**
 * Response helper.
 */

function respond(ctx) {
  const { socket, dumb, body } = ctx;

  // allow bypassing whisper
  if (dumb) return;

  // socket close
  if (!socket.writable) return;

  // no body
  if (!body) {
    return debug("no body");
  }

  debug("respond body");
  debug(body);

  // responses
  if (Buffer.isBuffer(body)) return socket.write(body);
  if ("string" === typeof body) return socket.write(body);
  if (body instanceof Stream) return body.pipe(socket);

  // body: json
  const str = JSON.stringify(body);
  socket.write(str);
}
