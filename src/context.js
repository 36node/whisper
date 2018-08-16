import delegate from "delegates";
import shortid from "shortid";

/**
 * Context class.
 */

export default class Context {
  id;
  no;
  data;
  session;

  constructor() {
    this.id = shortid.generate();
  }
}

delegate(Context.prototype, "session")
  .access("app")
  .access("socket")
  .method("send");
