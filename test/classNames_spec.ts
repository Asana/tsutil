import chai = require("chai");
import tsutil = require("../src/index");

var cx = tsutil.classNames;
var assert = chai.assert;

describe("classNames", () => {

  it("should filter to return only truthy strings", () => {
    assert.equal(cx({
      foo: true,
      bar: undefined,
      baz: true,
      fire: null,
      foobar: false
    }), "foo baz");
  });

  it("should append extra class strings", () => {
    assert.equal(cx({
      baz: false,
      boo: true,
      bar: true
    }, "a", "b", "c"), "boo bar a b c");
  });

  it("should also accept a string as the first argument", () => {
    assert.equal(cx("foobar", "foo", "baz"), "foobar foo baz");
  });
});

