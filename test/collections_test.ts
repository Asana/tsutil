import chai = require("chai");
import sinon = require("sinon");
import tsutil = require("../src/index");

var collections = tsutil.collections;
var assert = chai.assert;

suite("collections", () => {
    suite("get", () => {
        var map = <tsutil.Map<number>>{ test: 3 };

        test("should return Optional.NONE for a non existent key", () => {
            assert.equal(collections.get(map, "DNE"), tsutil.Optional.NONE);
        });

        test("should return the value if the key does exist", () => {
            assert.equal(collections.get(map, "test").getOrThrow(), 3);
        });
    });

    suite("forEach", () => {
        test("should not invoke the callback for an empty map", () => {
            var callback = sinon.spy();
            collections.forEach<number>(<tsutil.Map<number>>{}, callback);
            sinon.assert.notCalled(callback);
        });

        test("should call the callback with the right params", () => {
            var callback = sinon.spy();
            var map = <tsutil.Map<number>>{ test: 3 };
            collections.forEach(map, callback);
            sinon.assert.calledOnce(callback);
            sinon.assert.calledWithExactly(callback, 3, "test", map);
        });

        test("should call the callback many times", () => {
            var callback = sinon.spy();
            var map = <tsutil.Map<number>>{ foo: 0, bar: 1 };
            collections.forEach(map, callback);
            sinon.assert.calledTwice(callback);
        });
    });

    suite("every", () => {
        var map = <tsutil.Map<number>>{ foo: 0, bar: 1 };

        test("should return true if every value matches", () => {
            assert.isTrue(collections.every(map, (value) => {
                return value < 2;
            }));
        });

        test("should return false if a value does not match", () => {
            assert.isFalse(collections.every(map, (value) => {
                return value !== 1;
            }));
        });
    });

    suite("some", () => {
        var map = <tsutil.Map<number>>{ foo: 0, bar: 1 };

        test("should return true if any value matches", () => {
            assert.isTrue(collections.some(map, (value) => {
                return value === 1;
            }));
        });

        test("should return false if no value matches", () => {
            assert.isFalse(collections.some(map, (value) => {
                return value === -1;
            }));
        });
    });

    suite("filter", () => {
        test("should return only the values that match the filter", () => {
            var map = <tsutil.Map<number>>{ foo: 0, bar: 1 };
            assert.deepEqual(collections.filter(map, (value) => {
                return value === 1;
            }), <tsutil.Map<number>>{ bar: 1 });
        });
    });

    suite("map", () => {
        test("should return only the values that match the filter", () => {
            var map = <tsutil.Map<number>>{ foo: 0, bar: 1 };
            assert.deepEqual(collections.map(map, (value) => {
                return "v" + value;
            }), <tsutil.Map<string>>{ foo: "v0", bar: "v1" });
        });
    });

    suite("fold", () => {
        var map = <tsutil.Map<number>>{ foo: 1, bar: 2 };

        test("should return the reduced value", () => {
            assert.equal(collections.fold(map, (current, value) => {
                return current + value;
            }), 3);
        });

        test("should use the initial value", () => {
            var callback = sinon.spy();
            collections.fold(map, callback);
            sinon.assert.calledOnce(callback);
            sinon.assert.calledWithExactly(callback, 1, 2, "bar", map);
        });
    });

    suite("reduce", () => {
        test("should return the reduced value", () => {
            var map = <tsutil.Map<number>>{ foo: 1, bar: 2 };
            assert.equal(collections.reduce(map, (current, value) => {
                return current + value;
            }, 3), 6);
        });
    });
});
