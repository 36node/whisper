import Emitter from 'events';
import net from 'net';
import util from 'util';

import compose from 'koa-compose';
import Debugger from 'debug';
import only from 'only';

import Session from './session';
import Context from './context';

const debug = new Debugger('whisper');

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
    this.sessions = [];
    this.env = process.env.NODE_ENV || 'development';

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
    debug('listen');
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
    return only(this, ['env']);
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
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    debug('use %s', fn._name || fn.name || '-');
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

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleConnect = socket => {
      // create session while new connection
      const session = this.createSession(socket);

      // hanlders
      const handleEnd = () => session.end();
      const handleClose = () => session.close();
      const handleError = err => session.onerror(err);
      const handleTimeout = () => session.timeout();
      const handleData = data => {
        const ctx = this.createContext(session, data);
        this.handleRequest(ctx, fn);
      };

      socket.on('close', handleClose);
      socket.on('data', handleData);
      socket.on('end', handleEnd);
      socket.on('error', handleError);
      socket.on('timeout', handleTimeout);
    };

    return handleConnect;
  }

  /**
   * broad cast data to all client or clients match filter
   * filt is a function
   * filt = session => { return true; }
   *
   * @param {*} data string/buffer/json
   */
  broadcast(data, filt = () => true) {
    debug('broadcast');
    this.sessions.filter(filt).forEach(session => session.send(data));
  }

  /**
   * Handle request in callback.
   *
   * @param {Context} ctx
   * @param {Function} fnMiddleware
   * @api private
   */

  handleRequest(ctx, fnMiddleware) {
    debug('data comming with seq no %s', ctx.no);
    debug(ctx.data);

    const onerror = err => ctx.onerror(err);
    return fnMiddleware(ctx).catch(onerror);
  }

  /**
   * Default error handler.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    if (!(err instanceof Error)) throw new TypeError(util.format('non-error thrown: %j', err));

    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, '  '));
    console.error();
  }

  /**
   * add session to list
   *
   * @param {*} session
   * @api private
   */
  add(session) {
    const index = this.sessions.indexOf(session);
    if (index === -1) this.sessions.push(session);
    return session;
  }

  /**
   * remove session from list
   *
   * @param {*} session
   * @api private
   */
  remove(session) {
    const index = this.sessions.indexOf(session);
    if (index !== -1) this.sessions.splice(index, 1);
    return session;
  }

  /**
   * Initialize a new session.
   * @param {Socket} socket
   *
   * @api private
   */

  createSession(socket) {
    const session = new Session();
    session.app = this;
    session.socket = socket;

    return this.add(session);
  }

  /**
   * Initialize a new context.
   * @param {Socket} socket
   * @param {Session} session
   * @param {*} data
   *
   * @api private
   */

  createContext(session, data) {
    const ctx = new Context();
    ctx.data = data;
    ctx.session = session;
    ctx.no = session.genSeq();

    return ctx;
  }
}
