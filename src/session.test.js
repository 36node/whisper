import Session from "./session";

describe("session", () => {
  test("should auto increase seq", () => {
    const app = {};
    const socket = {};
    const s = new Session(app, socket);
    const seq0 = s.genSeq();
    expect(seq0).toBe(0);
    const seq1 = s.genSeq();
    expect(seq1).toBe(1);
  });
});
