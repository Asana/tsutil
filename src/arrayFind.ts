/**
 * Usage: import arrayFind = require("tsutil/arrayFind");
 *
 * arrayFind([1,2,3,4,5], (x) => x === 3);
 *
 * @param {Array<T>} list
 * @param {(x: T) => boolean} predicate
 * @param {Object} thisArg?
 * @returns {T?}
 */
function arrayFind<T>(
    list: T[],
    predicate: (x: T, index: number, list: T[]) => boolean,
    thisArg?: {}): T {

    var length = list.length;
    var value: T;
    for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
            return value;
        }
    }
    return undefined;
}

export = arrayFind;

