import chai = require("chai");
import tsutil = require("../src/index");

var lists = tsutil.lists;
var assert = chai.assert;

suite("lists", () => {
    suite("find", () => {
        var list: number[] = [5, 10, 15, 20];

        test("should find item by predicate", function () {
            var result = lists.find(list, (x) => x === 15);
            assert.equal(result, 15);
        });

        test("should return undefined when nothing matched", function () {
            var result = lists.find(list, (x) => x === -1);
            assert.equal(result, undefined);
        });

        test("should receive all three parameters", function () {
            lists.find(list, (value, index, arr) => {
                assert.equal(list[index], value);
                assert.equal(list, arr);
                return false;
            });
        });

        test("should work with the context argument", function () {
            var context = {};
            lists.find([1], function () {
                assert.equal(this, context);
                return false;
            }, context);
        });

        test("should work with a sparse list", function () {
            var obj = [1, , undefined];
            assert.isFalse(1 in obj);
            var seen: any[] = [];
            var found = lists.find(obj, (x) => {
                seen.push(x);
                return false;
            });
            assert.equal(found, undefined);
            assert.sameMembers(seen, [1, undefined, undefined]);
        });
    });

    suite("includes", () => {
        test("should return true when element is included", () => {
            assert.isTrue(lists.includes([1, 2, 3], 2));
        });

        test("should return false when element is missing", () => {
            assert.isFalse(lists.includes([1, 2, 3], 4));
        });

        test("should return false for undefined element", () => {
            assert.isFalse(lists.includes([1, 2, 3], undefined));
        });

        test("should return false for empty list", () => {
            assert.isFalse(lists.includes([], 1));
        });
    });

    suite("isEmpty", () => {
        test("should return true for empty list", () => {
            assert.isTrue(lists.isEmpty([]));
        });

        test("should return false for non-empty list", () => {
            assert.isFalse(lists.isEmpty([1]));
        });

        test("should return false for list of undefined", () => {
            assert.isFalse(lists.isEmpty([undefined]));
        });
    });
});
