/* tslint:disable no-empty */
import chai = require("chai");
import identity = require("../src/identity");
import MutableMap = require("../src/mutable_map");
import Optional = require("../src/optional");
import sinon = require("sinon");

var assert = chai.assert;

describe("MutableMap", () => {
    describe("#constructor()", () => {
        it("should create an empty map when not provided arguments", () => {
            var m = new MutableMap<string, string>();
            assert.isTrue(m.isEmpty());
        });

        it("should create a map initialized with the keys and values provided", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.equal(m.getOrNull("hello"), "world");
        });
    });

    describe("#clear()", () => {
        it("should not throw if called on an empty map", () => {
            var m = new MutableMap<string, string>();
            m.clear();
        });

        it("should make the map empty", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.clear();
            assert.isTrue(m.isEmpty());
        });

        it("should return the same map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var n = m.clear();
            assert.strictEqual(m, n);
        });
    });

    describe("#delete()", () => {
        it("should keep the map the same size for a missing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var initialSize = m.size();
            m.delete("goodbye");
            assert.equal(m.size(), initialSize);
        });

        it("should make the map smaller for an existing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var initialSize = m.size();
            m.delete("hello");
            assert.equal(m.size(), initialSize - 1);
        });

        it("should keep the map the same size when called a second time", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.delete("hello");
            var deletedSize = m.size();
            m.delete("hello");
            assert.equal(m.size(), deletedSize);
        });

        it("should make the map empty when called on the only key", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.delete("hello");
            assert.isTrue(m.isEmpty());
        });

        it("should return the same map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var n = m.delete("hello");
            assert.strictEqual(m, n);
        });
    });

    describe("#filter()", () => {
        it("should keep the map empty when the map is empty", () => {
            var m = new MutableMap<string, string>();

            m.filter(() => {
                return true;
            });
            assert.isTrue(m.isEmpty());

            m.filter(() => {
                return false;
            });
            assert.isTrue(m.isEmpty());
        });

        it("should contain all entries that passed the test", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.filter(identity);
            assert.isTrue(m.has("hello"));
            assert.isTrue(m.has("hi"));
        });

        it("should not contain any entries that failed the test", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.filter(identity);
            assert.isFalse(m.has("goodbye"));
            assert.isFalse(m.has("bye"));
        });

        it("should return the same map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var n = m.filter(identity);
            assert.strictEqual(m, n);
        });

        it("should contain all keys that passed the test", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.filter((value, key) => {
                return key.charAt(0) === "h";
            });
            assert.isTrue(m.has("hello"));
            assert.isTrue(m.has("hi"));
        });

        it("should not contain any keys that failed the test", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.filter((value, key) => {
                return key.charAt(0) === "h";
            });
            assert.isFalse(m.has("goodbye"));
            assert.isFalse(m.has("bye"));
        });

        it("should provide the predicate with the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var n = m.filter((value, key, map) => {
                assert.strictEqual(map, m);
                return true;
            });
        });
    });

    describe("#forEach()", () => {
        it("should not call the sideEffect when empty", () => {
            var m = new MutableMap<string, string>();
            var spy = sinon.spy();
            m.forEach(spy);
            sinon.assert.notCalled(spy);
        });

        it("should call the sideEffect exactly once for each entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world",
                "goodbye": "earth"
            });
            var spy = sinon.spy();
            m.forEach(spy);
            sinon.assert.calledTwice(spy);
        });

        it("should stop calling the sideEffect once the callback returns false", () => {
            var m = new MutableMap<string, boolean>({
                "hello": "world",
                "goodbye": "earth"
            });
            var spy = sinon.spy();
            m.forEach((value) => {
                spy.apply(null, arguments);
                return false;
            });
            sinon.assert.calledOnce(spy);
        });

        it("should return the number of times the sideEffect was called", () => {
            var m = new MutableMap<string, boolean>({
                "hello": "world",
                "goodbye": "earth"
            });
            var numCalled = m.forEach((value) => {
                return false;
            });
            assert.equal(numCalled, 1);
        });

        it("should provide the sideEffect with the corresponding keys and values", () => {
            var m = new MutableMap<string, boolean>({
                "hello": "world",
                "goodbye": "earth"
            });
            m.forEach((value, key) => {
                assert.equal(value, m.getOrNull(key));
            });
        });

        it("should provide the sideEffect with the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": "world",
                "goodbye": "earth"
            });
            m.forEach((value, key, map) => {
                assert.strictEqual(map, m);
            });
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": "world",
                "goodbye": "earth"
            });
            m.forEach(() => {});
            assert.deepEqual(m, new MutableMap<string, boolean>({
                "hello": "world",
                "goodbye": "earth"
            }));
        });
    });

    describe("#every()", () => {
        it("should be true for when empty", () => {
            var m = new MutableMap<string, boolean>();
            assert.isTrue(m.every(identity));
        });

        it("should be false when one entry fails the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "goodbye": false
            });
            assert.isFalse(m.every(identity));
        });

        it("should be false when multiple entries fail the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            assert.isFalse(m.every(identity));
        });

        it("should be true when all entries satisfy the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true
            });
            assert.isTrue(m.every(identity));
        });

        it("should be false when any key fails the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var allHKeys = m.every((value, key) => {
                return key.charAt(0) === "h";
            });
            assert.isFalse(allHKeys);
        });

        it("should be true when every key satisfies the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var allLongKeys = m.every((value, key) => {
                return key.length > 1;
            });
            assert.isTrue(allLongKeys);
        });

        it("should provide the predicate with the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.every((value, key, map) => {
                assert.strictEqual(map, m);
                return true;
            });
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.every(identity);
            assert.deepEqual(m, new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            }));
        });
    });

    describe("#get()", () => {
        it("should return NONE when accessing a missing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.equal(m.get("goodbye"), Optional.NONE);
        });

        it("should return an Optional of the value when accessing an existing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.equal(m.get("hello").getOrNull(), "world");
        });

        it("should return NONE when accessing a null value", () => {
            var m = new MutableMap<string, string>({
                "hello": null
            });
            assert.equal(m.get("hello"), Optional.NONE);
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.get("hello");
            m.get("goodbye");
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#getOrElse()", () => {
        it("should return the value when accessing an existing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var value = m.getOrElse("hello", () => {
                return "earth";
            });
            assert.equal(value, "world");
        });

        it("should return the fallback when accessing a missing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var value = m.getOrElse("goodbye", () => {
                return "earth";
            });
            assert.equal(value, "earth");
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.getOrElse("hello", () => {
                return "earth";
            });
            m.getOrElse("goodbye", () => {
                return "earth";
            });
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#getOrNull()", () => {
        it("should return the value when accessing an existing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.equal(m.getOrNull("hello"), "world");
        });

        it("should return null when accessing a missing", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.isNull(m.getOrNull("goodbye"));
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.getOrNull("hello");
            m.getOrNull("goodbye");
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#getOrSet()", () => {
        it("should return the value if it exists", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var valueAndMap = m.getOrSet("hello", () => {
                return "earth";
            });
            assert.equal(valueAndMap[0], "world");
        });

        it("should ensure the entry is in the map if it is not already there", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.getOrSet("goodbye", () => {
                return "earth";
            });
            assert.equal(m.getOrNull("goodbye"), "earth");
        });

        it("should return the result of the provided setter if the entry did not exist", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var valueAndMap = m.getOrSet("goodbye", () => {
                return "earth";
            });
            assert.equal(valueAndMap[0], "earth");
        });

        it("should return the same map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var valueAndMap = m.getOrSet("goodbye", () => {
                return "earth";
            });
            assert.strictEqual(valueAndMap[1], m);
        });
    });

    describe("#getOrThrow()", () => {
        it("should return the value if it exists", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.equal(m.getOrThrow("hello"), "world");
        });

        it("should throw when accessing a missing key", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.throws(() => {
                m.getOrThrow("goodbye");
            });
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.getOrThrow("hello");
            assert.throws(() => {
                m.getOrThrow("goodbye");
            });
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#has()", () => {
        it("should be false when accessing a missing entry", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.isFalse(m.has("goodbye"));
        });

        it("should be true when accessing the entry if it exists", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.isTrue(m.has("hello"));
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.has("hello");
            m.has("goodbye");
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#isEmpty()", () => {
        it("should be true when the map is first created", () => {
            var m = new MutableMap<string, string>();
            assert.isTrue(m.isEmpty());
        });

        it("should be false if the map is created with provided entries", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            assert.isFalse(m.isEmpty());
        });

        it("should be false when an entry is added", () => {
            var m = new MutableMap<string, string>();
            m.set("hello", "world");
            assert.isFalse(m.isEmpty());
        });

        it("should be true when the only entry is removed", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.delete("hello");
            assert.isTrue(m.isEmpty());
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.isEmpty();
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#keys()", () => {
        it("should return an empty array when the map is empty", () => {
            var m = new MutableMap<string, string>();
            assert.deepEqual(m.keys(), []);
        });

        it("should have length as the number of existing entries", () => {
            var m = new MutableMap<string, string>({
                "hello": "world",
                "goodbye": "earth"
            });
            assert.equal(m.keys().length, 2);
        });

        it("should contain all of the existing keys", () => {
            var m = new MutableMap<string, string>({
                "hello": "world",
                "goodbye": "earth"
            });
            var keys = m.keys();
            assert.notEqual(keys.indexOf("hello"), -1);
            assert.notEqual(keys.indexOf("goodbye"), -1);
        });

        it("should not contain any keys that do not exist", () => {
            var m = new MutableMap<string, string>({
                "hello": "world",
                "goodbye": "earth"
            });
            var keys = m.keys();
            assert.equal(keys.indexOf("hi"), -1);
            assert.equal(keys.indexOf("bye"), -1);
        });

        it("should not contain duplicates", () => {
            var m = new MutableMap<string, string>({
                "hello": "world",
                "goodbye": "earth"
            });
            m.set("hello", "earth");
            var keys = m.keys();
            assert.equal(keys.indexOf("hello"), keys.lastIndexOf("hello"));
            assert.equal(keys.indexOf("goodbye"), keys.lastIndexOf("goodbye"));
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.keys();
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#map()", () => {
        it("should return an empty map when the map is empty", () => {
            var m = new MutableMap<string, string>();
            var mapped = m.map(identity);
            assert.isTrue(mapped.isEmpty());
        });

        it("should return a map of the same size", () => {
            var m = new MutableMap<string, string>({
                "hello": "world",
                "goodbye": "earth"
            });
            var mapped = m.map(identity);
            assert.equal(mapped.size(), 2);
        });

        it("should return a map of string values when provided with a toString mapper", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "goodbye": false
            });
            var mapped = m.map((value) => {
                return value.toString();
            });
            assert.deepEqual(mapped, new MutableMap<string, string>({
                "hello": "true",
                "goodbye": "false"
            }));
        });

        it("should return an identity map when the mapper returns the key", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "goodbye": false
            });
            var mapped = m.map((value, key) => {
                return key;
            });
            mapped.forEach((value, key) => {
                assert.equal(value, key);
            });
        });

        it("should provide the mapper with the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "goodbye": false
            });
            m.map((value, key, map) => {
                assert.strictEqual(map, m);
            });
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.map(identity);
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#mapEntries()", () => {
        it("should return an empty map when the map is empty", () => {
            var m = new MutableMap<string, boolean>();
            var mapped = m.mapEntries(identity);
            assert.isTrue(mapped.isEmpty());
        });

        it("should return a map of the same size when provided a one-to-one key mapper", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var mapped = m.mapEntries((entry) => {
                var key = entry[0];
                return [key.length.toString(), entry[1]];
            });
            assert.equal(mapped.size(), m.size());
        });

        it("should return a map with fewer entries when provided a not one-to-one key mapper", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var mapped = m.mapEntries((entry) => {
                var key = entry[0];
                return [key.charAt(0), entry[1]];
            });
            assert.equal(mapped.size(), 3);
        });

        it("should return a map of string values when provided with a toString value mapper", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var mapped = m.mapEntries((entry) => {
                return [entry[0], entry[1].toString()];
            });
            assert.deepEqual(mapped, new MutableMap<string, string>({
                "hello": "true",
                "hi": "true",
                "goodbye": "false",
                "bye": "false"
            }));
        });

        it("should provide the mapper with increasing indexes", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var entriesSeen = 0;
            m.mapEntries((entry, index) => {
                assert.equal(index, entriesSeen);
                entriesSeen++;
                return entry;
            });
        });

        it("should provide the mapper with the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.mapEntries((entry, index, map) => {
                assert.strictEqual(map, m);
                return entry;
            });
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.mapEntries(identity);
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#mapKeys()", () => {
        it("should return an empty map when the map is empty", () => {
            var m = new MutableMap<string, boolean>();
            var mapped = m.mapKeys(identity);
            assert.isTrue(mapped.isEmpty());
        });

        it("should return a map of the same size when provided a one-to-one mapper", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var mapped = m.mapKeys((key) => {
                return key.length.toString();
            });
            assert.equal(mapped.size(), m.size());
        });

        it("should return a map with fewer entries when provided a not one-to-one mapper", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var mapped = m.mapKeys((key) => {
                return key.charAt(0);
            });
            assert.equal(mapped.size(), 3);
        });

        it("should return an identity map when the mapper returns the value", () => {
            var m = new MutableMap<string, string>({
                "hello": "true",
                "hi": "true",
                "goodbye": "false",
                "bye": "false"
            });
            var mapped = m.mapKeys((key, value) => {
                return value.toString();
            });
            mapped.forEach((value, key) => {
                assert.equal(value, key);
            });
        });

        it("should provide the mapper with the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.mapKeys((key, value, map) => {
                assert.strictEqual(map, m);
                return key;
            });
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.mapKeys(identity);
            assert.deepEqual(m, new MutableMap<string, string>({
                "hello": "world"
            }));
        });
    });

    describe("#reduce()", () => {
        it("should return the initial value when empty", () => {
            var m = new MutableMap<string, boolean>();
            var initial = 5;
            var reduction = m.reduce(identity, initial);
            assert.equal(reduction, initial);
        });

        it("should return the sum of all values when used with addition", () => {
            var m = new MutableMap<string, number>({
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4
            });
            var sum = m.reduce((reduction, value) => {
                return reduction + value;
            }, 0);
            assert.equal(sum, 10);
        });

        it("should support a reduction over the keys", () => {
            var m = new MutableMap<string, number>({
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4
            });
            var joined = m.reduce((reduction, value, key) => {
                return reduction + ", " + key;
            }, "");
            assert.equal(joined.length, ", one, two, three, four".length);
        });

        it("should provide the mapper with the map", () => {
            var m = new MutableMap<string, number>({
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4
            });
            m.reduce((reduction, value, key, map) => {
                assert.strictEqual(map, m);
                return 0;
            }, 0);
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, number>({
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4
            });
            m.reduce(identity, 0);
            assert.deepEqual(m, new MutableMap<string, number>({
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4
            }));
        });
    });

    describe("#set()", () => {
        it("should add the value if it doesn't exist", () => {
            var m = new MutableMap<string, string>();
            m.set("hello", "world");
            assert.equal(m.getOrNull("hello"), "world");
        });

        it("should replace the value if it exists", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            m.set("hello", "earth");
            assert.equal(m.getOrNull("hello"), "earth");
        });

        it("should return the same map", () => {
            var m = new MutableMap<string, string>({
                "hello": "world"
            });
            var n = m.set("hello", "earth");
            assert.strictEqual(m, n);
        });
    });

    describe("#size()", () => {
        it("should be zero when empty", () => {
            var m = new MutableMap<string, boolean>();
            assert.equal(m.size(), 0);
        });

        it("should correspond to the number of entries provided after creation", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            assert.equal(m.size(), 4);
        });

        it("should increase when an entry is added", () => {
            var m = new MutableMap<string, string>();
            m.set("hello", "world");
            assert.equal(m.size(), 1);
        });

        it("should decrease when an entry is removed", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.delete("hello");
            assert.equal(m.size(), 3);
        });

        it("should stay the same when an entry is replaced", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.set("hello", false);
            assert.equal(m.size(), 4);
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.size();
            assert.deepEqual(m, new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            }));
        });
    });

    describe("#some()", () => {
        it("shoud be false when empty", () => {
            var m = new MutableMap<string, boolean>();
            assert.isFalse(m.some(identity));
        });

        it("shoud be true when one entry satisfies the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "goodbye": false
            });
            assert.isTrue(m.some(identity));
        });

        it("shoud be true when multiple entries satisfy the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            assert.isTrue(m.some(identity));
        });

        it("shoud be false when no entries satisfy the predicate", () => {
            var m = new MutableMap<string, boolean>({
                "goodbye": false,
                "bye": false
            });
            assert.isFalse(m.some(identity));
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            m.some(identity)
            assert.deepEqual(m, new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            }));
        });
    });

    describe("#values()", () => {
        it("should be empty when the map is empty", () => {
            var m = new MutableMap<string, string>();
            var values = m.values();
            assert.equal(values.length, 0);
        });

        it("should contain all of values in the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "hi",
                "goodbye": "bye",
            });
            var values = m.values();
            assert.notEqual(values.indexOf("hi"), -1);
            assert.notEqual(values.indexOf("bye"), -1);
        });

        it("should not contain values not in the map", () => {
            var m = new MutableMap<string, string>({
                "hello": "hi",
                "goodbye": "bye",
            });
            var values = m.values();
            assert.equal(values.indexOf("hello"), -1);
        });

        it("should preserve duplicate values", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var values = m.values();
            assert.notEqual(values.indexOf(true), values.lastIndexOf(true));
            assert.notEqual(values.indexOf(false), values.lastIndexOf(false));
        });

        it("should not mutate the map", () => {
            var m = new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            });
            var values = m.values();
            assert.deepEqual(m, new MutableMap<string, boolean>({
                "hello": true,
                "hi": true,
                "goodbye": false,
                "bye": false
            }));
        });
    });
});
