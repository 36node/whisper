import delegate from "delegates";
import nanoid from "nanoid";

/**
 * Context class.
 */

export default class Context {
  id;
  no;
  data;
  session;

  constructor() {
    this.id = nanoid();
    this.state = {}; // for additional data store
  }
}

delegate(Context.prototype, "session")
  .access("app")
  .access("socket")
  .method("send");
