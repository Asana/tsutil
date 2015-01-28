import chai = require("chai");
import tsutil = require("../src/index");

var arrayFind = tsutil.arrayFind;
var assert = chai.assert;

describe("arrayFind", () => {

  var list: number[] = [5, 10, 15, 20];

  it("should find item by predicate", function() {
    var result = arrayFind(list, (x) => x === 15);
    assert.equal(result, 15);
  });

  it("should return undefined when nothing matched", function() {
    var result = arrayFind(list, (x) => x === -1);
    assert.equal(result, undefined);
  });

  it("should receive all three parameters", function() {
    arrayFind(list, (value, index, arr) => {
      assert.equal(list[index], value);
      assert.equal(list, arr);
      return false;
    });
  });

  it("should work with the context argument", function() {
    var context = {};
    arrayFind([1], function() {
      assert.equal(this, context);
      return false;
    }, context);
  });

  it("should work with a sparse array", function() {
    var obj = [1, , undefined];
    assert.isFalse(1 in obj);
    var seen: any[] = [];
    var found = arrayFind(obj, (x) => {
      seen.push(x);
      return false;
    });
    assert.equal(found, undefined);
    assert.sameMembers(seen, [1, undefined, undefined]);
  });
});

