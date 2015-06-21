var val = require('./backboneSpec.js');

describe("A suite", function() {
  it("it's my mistake", function() {
    expect(val.a).toBe('test');
  });
  it("it's not", function() {
    expect(true).toBe(true);
  });
});

describe("A suite2", function() {
  it("it's my mistake", function() {
    expect(true).toBe(false);
  });
  it("it's not", function() {
    expect(true).toBe(true);
  });
});