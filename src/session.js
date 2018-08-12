import Stream from 'stream';
import util from 'util';

import Debugger from 'debug';
import shortid from 'shortid';

const debug = new Debugger('whisper');

/**
 * Session class.
 */

export default class Session {
  createdAt;
  closedAt;
  id;
  app;
  socket;

  constructor() {
    this.createdAt = new Date();
    this.id = shortid.generate();
    this._lastSeq = 0;
  }

  /**
   * send data to client
   *
   * @param {*} ctx
   * @api public
   */
  send(body) {
    const socket = this.socket;

    // no socket
    if (!socket) return;

    // socket close
    if (!socket.writable) return;

    // no body
    if (!body) {
      return debug('no body');
    }

    debug('bodyponse body');
    debug(body);

    // body: string, buffer, stream
    if (Buffer.isBuffer(body)) return socket.write(body);
    if ('string' === typeof body) return socket.write(body);
    if (body instanceof Stream) return body.pipe(socket);

    // body: json
    const str = JSON.stringify(body);
    socket.write(str);
  }

  /**
   * generate seq no
   *
   * @api private
   */
  genSeq() {
    return this._lastSeq++;
  }

  /**
   * timeout session
   *
   * @api private
   */
  timeout() {
    debug('session timeout');

    // delegate
    this.app.emit('timeout', this);
    this.socket.destroy(new Error('session timeout'));
  }

  /**
   * end session
   *
   * @api private
   */
  end() {
    debug('session end');

    // delegate
    this.app.remove(this);
    this.app.emit('end', this);
  }

  /**
   * close session
   *
   * @api private
   */
  close() {
    debug('session close');

    // delegate
    this.app.remove(this);
    this.app.emit('close', this);
  }

  /**
   * Default error handling.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {
    debug('session error');

    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null === err) return;
    if (!(err instanceof Error)) err = new Error(util.format('non-error thrown: %j', err));

    // delegate
    this.app.emit('error', err, this);
  }
}
