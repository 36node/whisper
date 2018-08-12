import delegate from 'delegates';

/**
 * Context class.
 */

export default class Context {
  no;
  data;
  session;
}

delegate(Context.prototype, 'session')
  .access('app')
  .access('socket')
  .method('send')
  .method('onerror');
